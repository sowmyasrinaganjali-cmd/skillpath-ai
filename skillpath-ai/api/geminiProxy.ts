import express from "express";
import type { Request, Response, NextFunction, Router as ExpressRouter } from "express";
import { GoogleGenAI } from "@google/genai";

export interface GeminiProxyRequest extends Request {
  geminiClient?: GoogleGenAI;
}

/**
 * Secure Gemini client initializer.
 * Accesses process.env.GEMINI_API_KEY exclusively on the server.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/**
 * Express Middleware: Ensures process.env.GEMINI_API_KEY is present
 * and attaches the authenticated GoogleGenAI client to the request.
 */
export function requireGeminiAuth(
  req: GeminiProxyRequest,
  res: Response,
  next: NextFunction
) {
  const client = getGeminiClient();
  if (!client) {
    return res.status(503).json({
      error: "API key missing",
      message:
        "process.env.GEMINI_API_KEY is not configured on the server. Please set it in environment secrets.",
      status: "CONFIG_REQUIRED",
    });
  }
  req.geminiClient = client;
  next();
}

/**
 * Utility: Robust JSON parser for Gemini responses.
 * Handles clean JSON, Markdown codeblocks (```json ... ```), and embedded object/array strings.
 */
export function parseGeminiJsonResponse(rawText: string): any {
  if (!rawText || typeof rawText !== "string") {
    return null;
  }

  let cleaned = rawText.trim();

  // Strip Markdown code fencing if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    // Attempt pattern extraction for embedded JSON objects { ... }
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {}
    }

    // Attempt pattern extraction for embedded JSON arrays [ ... ]
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {}
    }

    throw new Error(
      `Unable to parse Gemini output as JSON: ${err?.message || err}. Raw preview: ${cleaned.slice(0, 150)}`
    );
  }
}

/**
 * Executes a resilient generation request with automatic failover between
 * gemini-3.8-flash (primary) and gemini-3.1-flash-lite (high-demand fallback).
 */
export async function executeResilientGeminiCall(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
    timeoutMs?: number;
  }
): Promise<{ rawText: string; modelUsed: string }> {
  const primary = params.primaryModel || "gemini-3.8-flash";
  const fallback = "gemini-3.1-flash-lite";
  const models = [primary, fallback];
  const timeoutMs = params.timeoutMs || 12000;

  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Request timed out after ${timeoutMs}ms on ${model}`)),
            timeoutMs
          )
        ),
      ]);

      const rawText = response.text || "";
      return { rawText, modelUsed: model };
    } catch (err: any) {
      console.warn(
        `[Gemini Proxy] Model ${model} encountered issue (${err?.message || err}). Attempting fallback if available...`
      );
      lastError = err;
    }
  }

  throw lastError;
}

/**
 * Creates the Express router that handles proxy requests to the Google Gemini API.
 */
export function createGeminiProxyRouter(): ExpressRouter {
  const router = express.Router();

  // Status / Health route
  const handleStatus = (req: Request, res: Response) => {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    res.json({
      status: "ok",
      proxyActive: true,
      hasGeminiKey: hasKey,
      defaultModel: "gemini-3.8-flash",
      fallbackModel: "gemini-3.1-flash-lite",
      timestamp: new Date().toISOString(),
    });
  };
  router.get("/status", handleStatus);
  router.get("/health", handleStatus);

  // Shared proxy request handler
  const handleProxyRequest = async (req: GeminiProxyRequest, res: Response) => {
    try {
      const {
        prompt,
        contents,
        systemInstruction,
        responseSchema,
        model = "gemini-3.8-flash",
        temperature,
        parseJson = true,
      } = req.body;

      const payloadContents = contents || prompt;
      if (!payloadContents) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Either 'prompt' or 'contents' must be provided in request body.",
        });
      }

      const ai = req.geminiClient!;

      // Build config
      const config: Record<string, any> = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (typeof temperature === "number") {
        config.temperature = temperature;
      }

      // Always request JSON mime-type if responseSchema is supplied or parseJson is enabled
      if (parseJson || responseSchema) {
        config.responseMimeType = "application/json";
        if (responseSchema) {
          config.responseSchema = responseSchema;
        }
      }

      const { rawText, modelUsed } = await executeResilientGeminiCall(ai, {
        contents: payloadContents,
        config,
        primaryModel: model,
      });

      // Parse response as JSON
      if (parseJson) {
        try {
          const parsedData = parseGeminiJsonResponse(rawText);
          return res.json({
            success: true,
            data: parsedData,
            modelUsed,
            source: "gemini_proxy",
          });
        } catch (parseError: any) {
          return res.status(502).json({
            error: "JSON Parsing Error",
            message: parseError.message,
            rawResponse: rawText,
            modelUsed,
          });
        }
      }

      // Plain text response if parseJson is explicitly false
      return res.json({
        success: true,
        text: rawText,
        modelUsed,
        source: "gemini_proxy",
      });
    } catch (error: any) {
      console.error("[Gemini Proxy Error]:", error?.message || error);
      const statusCode = error?.status === "UNAVAILABLE" ? 503 : 500;
      return res.status(statusCode).json({
        error: "Gemini Proxy Request Failed",
        message: error?.message || "Internal server error during Gemini processing",
      });
    }
  };

  // Main proxy endpoint: Handles generation and parses output as JSON
  router.post("/proxy", requireGeminiAuth, handleProxyRequest);

  // Alias endpoint: /generate
  router.post("/generate", requireGeminiAuth, handleProxyRequest);

  return router;
}
