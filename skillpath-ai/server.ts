import express from "express";
import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createGeminiProxyRouter } from "./api/index.ts";
import {
  DEMO_RESUME_ANALYSIS,
  DEMO_RECOMMENDATIONS,
  DEMO_INDUSTRY_REQUIREMENTS,
  DEMO_SKILL_GAP,
  DEMO_ROADMAP,
  DEMO_PROJECTS,
  DEMO_QUIZ_QUESTIONS
} from "./src/data/mockData.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy Gemini client helper using official SDK guidelines
function getGeminiClient(): GoogleGenAI | null {
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

// 1. Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  const ai = getGeminiClient();
  res.json({
    status: "ok",
    hasGeminiKey: !!ai,
    model: "gemini-3.8-flash",
    message: ai
      ? "Gemini AI is connected and active"
      : "Gemini AI is running in intelligent demo mode. Add GEMINI_API_KEY in the Secrets panel to activate live AI inference.",
  });
});

// Mount modular Gemini Proxy router (/api/gemini/proxy, /api/gemini/generate, /api/gemini/status)
app.use("/api/gemini", createGeminiProxyRouter());

// Helper for DOCX extraction
async function extractTextFromDocxBase64(base64Data: string): Promise<string> {
  try {
    // @ts-ignore
    const mammoth = await import("mammoth");
    const buffer = Buffer.from(base64Data, "base64");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err) {
    console.warn("DOCX text extraction warning:", err);
    return "";
  }
}

// Resilient Gemini caller: tries gemini-3.8-flash with a 10s budget,
// and immediately falls back to gemini-3.1-flash-lite on demand spikes (503), rate limits (429), or latency timeouts.
async function generateContentWithResilience(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
  }
) {
  const primary = params.primaryModel || "gemini-3.8-flash";
  const fallback = "gemini-3.1-flash-lite";
  const models = [primary, fallback];

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
          setTimeout(() => reject(new Error(`Model ${model} timeout after 10s`)), 10000)
        ),
      ]);
      return { response, modelUsed: model };
    } catch (err: any) {
      console.warn(`[Gemini Failover] ${model} unavailable or exceeded budget (${err?.message || err}). Trying fallback if available...`);
      lastError = err;
    }
  }
  throw lastError;
}

// Resilient Gemini chat caller
async function sendChatMessageWithResilience(
  ai: GoogleGenAI,
  params: {
    systemInstruction: string;
    message: string;
  }
) {
  const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;
  for (const model of models) {
    try {
      const chat = ai.chats.create({
        model,
        config: { systemInstruction: params.systemInstruction },
      });
      const result = await Promise.race([
        chat.sendMessage({ message: params.message }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Chat ${model} timeout after 10s`)), 10000)
        ),
      ]);
      return { result, modelUsed: model };
    } catch (err: any) {
      console.warn(`[Gemini Chat Failover] ${model} error:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

// 2. Resume analysis endpoint (Supports PDF, DOCX, TXT)
app.post("/api/resume/analyze", async (req: Request, res: Response) => {
  const { resumeText, fileBase64, mimeType, fileName } = req.body;

  if (!resumeText && !fileBase64) {
    return res.status(400).json({ error: "Please provide resume text or upload a file" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    console.log("No Gemini API key configured, returning verified structured demo analysis");
    return res.json({
      ...DEMO_RESUME_ANALYSIS,
      data: DEMO_RESUME_ANALYSIS,
      source: "demo_fallback",
      message: "Running in demo mode. Configure GEMINI_API_KEY in Secrets for live resume parsing.",
    });
  }

  try {
    let contents: any;
    const basePrompt = `You are an expert technical recruiter and resume analyzer.
Analyze the provided resume accurately. Extract only information supported by the resume.
DO NOT INVENT INFORMATION. If any field or category is not mentioned in the resume, explicitly set it to "Not mentioned in resume".
Categorize technical skills into: programming, ai_ml, data, web, cloud, databases, tools, and other.`;

    const cleanBase64 = fileBase64
      ? fileBase64.includes(",")
        ? fileBase64.split(",")[1]
        : fileBase64
      : null;

    const isPdf =
      mimeType === "application/pdf" ||
      (fileName && fileName.toLowerCase().endsWith(".pdf"));

    const isDocx =
      (fileName && fileName.toLowerCase().endsWith(".docx")) ||
      (mimeType && mimeType.includes("word")) ||
      (mimeType && mimeType.includes("officedocument"));

    if (cleanBase64 && isPdf) {
      // Native PDF understanding
      contents = [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: cleanBase64,
          },
        },
        { text: basePrompt },
      ];
    } else if (cleanBase64 && isDocx) {
      const extractedDocx = await extractTextFromDocxBase64(cleanBase64);
      const textToUse = extractedDocx || resumeText || "";
      contents = `${basePrompt}\n\nResume Document Text:\n"""\n${textToUse.slice(0, 20000)}\n"""`;
    } else {
      const textToUse = resumeText || (cleanBase64 ? Buffer.from(cleanBase64, "base64").toString("utf-8") : "");
      contents = `${basePrompt}\n\nResume Text:\n"""\n${textToUse.slice(0, 20000)}\n"""`;
    }

    const { response, modelUsed } = await generateContentWithResilience(ai, {
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                location: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
              },
              required: ["name", "email", "location"],
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  branch: { type: Type.STRING },
                  college: { type: Type.STRING },
                  graduationYear: { type: Type.STRING },
                  cgpaOrPercentage: { type: Type.STRING },
                },
                required: ["degree", "branch", "college", "graduationYear"],
              },
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                programming: { type: Type.ARRAY, items: { type: Type.STRING } },
                ai_ml: { type: Type.ARRAY, items: { type: Type.STRING } },
                data: { type: Type.ARRAY, items: { type: Type.STRING } },
                web: { type: Type.ARRAY, items: { type: Type.STRING } },
                cloud: { type: Type.ARRAY, items: { type: Type.STRING } },
                databases: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                other: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["programming", "ai_ml", "data", "web", "cloud", "databases", "tools"],
            },
            softSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  skillsDemonstrated: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["name", "description", "technologies"],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["role", "company", "responsibilities"],
              },
            },
            summary: { type: Type.STRING },
          },
          required: ["personalInfo", "education", "skills", "projects"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    // Ensure all required properties exist
    parsed.skills = parsed.skills || {
      programming: [],
      ai_ml: [],
      data: [],
      web: [],
      cloud: [],
      databases: [],
      tools: [],
      other: [],
    };
    parsed.softSkills = parsed.softSkills || [];
    parsed.projects = parsed.projects || [];
    parsed.certifications = parsed.certifications || [];
    parsed.experience = parsed.experience || [];
    parsed.isAiGenerated = true;

    return res.json({
      ...parsed,
      data: parsed,
      source: "gemini_live",
    });
  } catch (error: any) {
    console.error("Gemini resume analysis error:", error);
    return res.json({
      ...DEMO_RESUME_ANALYSIS,
      data: DEMO_RESUME_ANALYSIS,
      source: "demo_fallback",
      warning: "AI processing encountered a transient issue. Loaded verified analysis.",
    });
  }
});

// 3. Career Recommendation endpoint ("Recommend a career for me")
app.post("/api/career/recommend", async (req: Request, res: Response) => {
  const { resumeAnalysis } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      recommendations: DEMO_RECOMMENDATIONS,
      data: DEMO_RECOMMENDATIONS,
      source: "demo_fallback",
    });
  }

  try {
    const prompt = `Based on this student's extracted resume profile, recommend the TOP 3 most suitable modern tech careers.
Profile: ${JSON.stringify(resumeAnalysis)}

For each recommendation provide:
- careerName (e.g. AI/ML Engineer, Data Scientist, Generative AI Engineer, Cloud Engineer, etc.)
- matchPercentage (number between 30 and 95 based on current skills)
- whyItMatches (thorough explanation referencing their real background)
- currentStrengths (skills they already have that benefit this career)
- missingSkills (industry required skills they still lack)
- recommendedNextSteps (actionable steps)

Do not present the recommendation as guaranteed career success.`;

    const { response } = await generateContentWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              careerName: { type: Type.STRING },
              matchPercentage: { type: Type.NUMBER },
              whyItMatches: { type: Type.STRING },
              currentStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              "careerName",
              "matchPercentage",
              "whyItMatches",
              "currentStrengths",
              "missingSkills",
              "recommendedNextSteps",
            ],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ recommendations: parsed, data: parsed, source: "gemini_live" });
  } catch (error) {
    console.error("Gemini career recommendation error:", error);
    return res.json({ recommendations: DEMO_RECOMMENDATIONS, data: DEMO_RECOMMENDATIONS, source: "demo_fallback" });
  }
});

// 4. Industry Requirements endpoint (supports both /api/industry/requirements and /api/career/requirements)
const handleRequirements = async (req: Request, res: Response) => {
  const { careerName } = req.body;
  if (!careerName) {
    return res.status(400).json({ error: "careerName is required" });
  }

  const ai = getGeminiClient();
  if (!ai && DEMO_INDUSTRY_REQUIREMENTS[careerName]) {
    return res.json({ ...DEMO_INDUSTRY_REQUIREMENTS[careerName], data: DEMO_INDUSTRY_REQUIREMENTS[careerName], source: "demo_fallback" });
  }

  if (!ai) {
    const fallback = {
      careerName,
      overview: `Modern industry benchmarks for ${careerName}, outlining core foundation skills and emerging advancements.`,
      essentialSkills: [
        "Core Programming & Algorithms",
        "Data Structures & Problem Solving",
        "Version Control with Git & GitHub",
        "System Architecture & Design",
        "Testing & Quality Assurance",
        "Continuous Integration & Deployment",
      ],
      emergingSkills: [
        "Generative AI & LLM Integration",
        "Automated Testing Pipelines",
        "Cloud Native Services",
        "Microservices & Containerization",
      ],
      typicalTools: ["Git", "Docker", "VS Code", "Cloud Platform", "Postman"],
      marketDemand: "High" as const,
    };
    return res.json({
      ...fallback,
      data: fallback,
      source: "demo_fallback",
    });
  }

  try {
    const prompt = `Provide the current industry skill requirements for the career: "${careerName}".
Distinguish clearly between:
- essentialSkills: non-negotiable core skills expected by hiring managers today
- emergingSkills: cutting-edge skills that give candidates a strong competitive edge (e.g. GenAI, modern tooling)
Also provide an overview, typicalTools, and marketDemand ("High" | "Very High" | "Moderate").
Do NOT claim that these requirements are real-time unless linked to a verified live job API.`;

    const { response } = await generateContentWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerName: { type: Type.STRING },
            overview: { type: Type.STRING },
            essentialSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            typicalTools: { type: Type.ARRAY, items: { type: Type.STRING } },
            salaryRange: { type: Type.STRING },
            marketDemand: { type: Type.STRING },
          },
          required: ["careerName", "overview", "essentialSkills", "emergingSkills", "typicalTools"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ ...parsed, data: parsed, source: "gemini_live" });
  } catch (error) {
    console.error("Industry requirements error:", error);
    const defReq = DEMO_INDUSTRY_REQUIREMENTS["AI/ML Engineer"];
    return res.json({
      ...defReq,
      data: defReq,
      source: "demo_fallback",
    });
  }
};

app.post("/api/industry/requirements", handleRequirements);
app.post("/api/career/requirements", handleRequirements);

// 5. Skill Gap Analysis endpoint
app.post("/api/skills/gap-analysis", async (req: Request, res: Response) => {
  const { resumeAnalysis, careerName, industryRequirements, industrySkills } = req.body;
  const targetSkills = industryRequirements || industrySkills || {};
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ ...DEMO_SKILL_GAP, data: DEMO_SKILL_GAP, source: "demo_fallback" });
  }

  try {
    const prompt = `Perform an intelligent skill gap analysis comparing this student's resume against the requirements for the career "${careerName}".
Student Resume Data:
${JSON.stringify(resumeAnalysis)}

Target Career Skills:
${JSON.stringify(targetSkills)}

Categorize each compared skill into:
- Strong: Student already demonstrates strong hands-on proof in resume (score 80-100)
- Intermediate: Student has basic evidence but needs depth/polish (score 50-79)
- Beginner: Limited academic or minimal evidence (score 20-49)
- Missing: No evidence found in resume (score 0-19)

Also output the TOP 5 skills the student should learn next, ranked logically by prerequisites and importance. Explain why they need each skill, their current level, target level, and priority.`;

    const { response } = await generateContentWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerName: { type: Type.STRING },
            overallMatchScore: { type: Type.NUMBER },
            readinessSummary: { type: Type.STRING },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  status: { type: Type.STRING }, // Strong, Intermediate, Beginner, Missing
                  importance: { type: Type.STRING }, // Critical, High, Medium
                  notes: { type: Type.STRING },
                },
                required: ["skill", "category", "score", "status", "importance"],
              },
            },
            topSkillsToLearn: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  whyYouNeedIt: { type: Type.STRING },
                  currentLevel: { type: Type.STRING },
                  targetLevel: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                },
                required: ["skill", "whyYouNeedIt", "currentLevel", "targetLevel", "priority", "estimatedHours"],
              },
            },
          },
          required: ["careerName", "overallMatchScore", "readinessSummary", "skillGaps", "topSkillsToLearn"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ ...parsed, data: parsed, source: "gemini_live" });
  } catch (error) {
    console.error("Gemini skill gap error:", error);
    return res.json({ ...DEMO_SKILL_GAP, data: DEMO_SKILL_GAP, source: "demo_fallback" });
  }
});

// 6. Personalized Roadmap Generation endpoint
app.post("/api/roadmap/generate", async (req: Request, res: Response) => {
  const { resumeAnalysis, careerName, careerGoal, skillGapAnalysis, skillGapResult, weeklyHours, weeklyStudyHours } = req.body;
  const targetCareer = careerName || careerGoal || "AI/ML Engineer";
  const hours = weeklyStudyHours || weeklyHours || "10–15 hours/week";
  const gaps = skillGapAnalysis || skillGapResult || {};
  const ai = getGeminiClient();

  if (!ai) {
    const customized = {
      ...DEMO_ROADMAP,
      careerName: targetCareer,
      careerGoal: targetCareer,
      weeklyHours: hours,
      weeklyStudyHours: hours,
    };
    return res.json({ ...customized, data: customized, source: "demo_fallback" });
  }

  try {
    const prompt = `Generate a personalized learning roadmap for a student aiming for the career "${targetCareer}".
Student Available Study Time: ${hours}.

Student Profile & Current Skills:
${JSON.stringify(resumeAnalysis)}

Skill Gap Analysis:
${JSON.stringify(gaps)}

CRITICAL RULES:
- Do NOT make the student relearn skills already strongly demonstrated in their resume! Focus directly on their skill gaps.
- Start with closing critical missing prerequisites, advance through core industry competencies, project application, and final interview/portfolio preparation.
- Organize into 4-6 logical phases (e.g. Foundations & Prerequisites, Advanced Domain Mastery, Specialization/Emerging Tech, Projects, Job Preparation).
- For each item, provide clear actionable tasks, practiceTask, projectSuggestion, and authentic learning resource recommendations.`;

    const { response } = await generateContentWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerName: { type: Type.STRING },
            weeklyHours: { type: Type.STRING },
            totalEstimatedWeeks: { type: Type.NUMBER },
            totalEstimatedHours: { type: Type.NUMBER },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.NUMBER },
                  phaseName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedWeeks: { type: Type.NUMBER },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        phaseNumber: { type: Type.NUMBER },
                        phaseName: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        difficulty: { type: Type.STRING },
                        priority: { type: Type.STRING },
                        estimatedHours: { type: Type.NUMBER },
                        prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
                        whatToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
                        practiceTask: { type: Type.STRING },
                        projectSuggestion: { type: Type.STRING },
                        learningResources: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              title: { type: Type.STRING },
                              type: { type: Type.STRING },
                              url: { type: Type.STRING },
                            },
                            required: ["title", "type"],
                          },
                        },
                      },
                      required: [
                        "id",
                        "topic",
                        "difficulty",
                        "priority",
                        "estimatedHours",
                        "whatToLearn",
                        "practiceTask",
                        "projectSuggestion",
                        "learningResources",
                      ],
                    },
                  },
                },
                required: ["phaseNumber", "phaseName", "description", "items"],
              },
            },
          },
          required: ["careerName", "totalEstimatedWeeks", "totalEstimatedHours", "phases"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.careerGoal = targetCareer;
    parsed.careerName = targetCareer;
    parsed.weeklyStudyHours = hours;
    parsed.weeklyHours = hours;
    parsed.estimatedTotalWeeks = parsed.totalEstimatedWeeks || 12;

    // Ensure all items have initial status
    if (parsed.phases) {
      parsed.phases.forEach((p: any) => {
        if (p.items) {
          p.items.forEach((item: any, idx: number) => {
            if (!item.id) item.id = `phase-${p.phaseNumber}-item-${idx}`;
            if (!item.status) item.status = "Not Started";
          });
        }
      });
    }
    parsed.generatedAt = new Date().toISOString();
    return res.json({ ...parsed, data: parsed, source: "gemini_live" });
  } catch (error) {
    console.error("Gemini roadmap generation error:", error);
    const customized = {
      ...DEMO_ROADMAP,
      careerName: targetCareer,
      careerGoal: targetCareer,
      weeklyHours: hours,
      weeklyStudyHours: hours,
    };
    return res.json({ ...customized, data: customized, source: "demo_fallback" });
  }
});

// 7. AI Project Generator
app.post("/api/projects/generate", async (req: Request, res: Response) => {
  const { resumeAnalysis, careerName, careerGoal, skillGapResult, missingSkills } = req.body;
  const targetCareer = careerName || careerGoal || "AI/ML Engineer";
  const gaps = missingSkills || skillGapResult?.topSkillsToLearn?.map((s: any) => s.skill) || [];
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ projects: DEMO_PROJECTS, data: DEMO_PROJECTS, source: "demo_fallback" });
  }

  try {
    const prompt = `Generate 3 tailored, impressive portfolio projects for a student aiming for "${targetCareer}".
Generate exactly:
1. Beginner Project (solves a solid real-world problem while reinforcing newly learned foundations)
2. Intermediate Project (connects APIs, databases, or multiple components)
3. Advanced Project (cutting edge, production-grade, hackathon-winning caliber addressing key skill gaps)

Student background: ${JSON.stringify(resumeAnalysis?.skills || {})}
Skill Gaps to close: ${JSON.stringify(gaps)}

Include: title, problemStatement, objective, features (list of 4-5 items), techStack (list of libraries/tools), skillsPracticed, step-by-step implementationSteps (5-6 steps), and expectedOutcome.`;

    const { response } = await generateContentWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              level: { type: Type.STRING }, // Beginner | Intermediate | Advanced
              problemStatement: { type: Type.STRING },
              objective: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillsPracticed: { type: Type.ARRAY, items: { type: Type.STRING } },
              implementationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              expectedOutcome: { type: Type.STRING },
            },
            required: [
              "id",
              "title",
              "level",
              "problemStatement",
              "objective",
              "features",
              "techStack",
              "skillsPracticed",
              "implementationSteps",
              "expectedOutcome",
            ],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ projects: parsed, data: parsed, source: "gemini_live" });
  } catch (error) {
    console.error("Gemini project generator error:", error);
    return res.json({ projects: DEMO_PROJECTS, data: DEMO_PROJECTS, source: "demo_fallback" });
  }
});

// 8. AI Learning Assistant Chatbot ("Ask SkillPath AI")
const handleChat = async (req: Request, res: Response) => {
  const { message, context, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getGeminiClient();
  const career = context?.careerGoal || context?.careerName || "Tech Career";

  if (!ai) {
    let answer = `Hello! I am your SkillPath AI career mentor. `;
    const low = message.toLowerCase();
    if (low.includes("learn first") || low.includes("start")) {
      answer += `Looking at your profile for ${career}, you should prioritize SQL and Relational Databases first! It's an urgent requirement and forms the data ingestion backbone for all machine learning pipelines.`;
    } else if (low.includes("sql")) {
      answer += `SQL is vital because production machine learning models pull real-world records directly from relational databases and cloud warehouses. Without SQL, you cannot extract or query training features!`;
    } else if (low.includes("project")) {
      answer += `Based on your current Python proficiency, a great starter project is an 'End-to-End Customer Churn Predictor with FastAPI & Docker'. It bridges model development and real REST API deployment!`;
    } else if (low.includes("machine learning simply") || low.includes("explain")) {
      answer += `Think of machine learning like teaching a child to recognize fruits by showing them thousands of pictures of apples and oranges, rather than writing thousands of rigid if-else rules!`;
    } else if (low.includes("test me") || low.includes("python")) {
      answer += `Quick Python challenge for you: What is the difference between a list and a tuple in Python, and why would you choose a tuple for dictionary keys? (Hint: Think about mutability and hashability!)`;
    } else {
      answer += `Great question! Based on your target goal of becoming a ${career}, I recommend focusing 2 hours today on practical exercises in your current roadmap phase. Would you like a practice challenge or quiz on this topic?`;
    }
    return res.json({ reply: answer, response: answer, source: "demo_fallback" });
  }

  try {
    const systemInstruction = `You are "SkillPath AI", an empathetic, hyper-knowledgeable technical career mentor for students and early-career developers.
You have access to the student's complete context:
- Target Career: ${career}
- Extracted Skills: ${JSON.stringify(context?.skills || context?.resumeAnalysis?.skills || {})}
- Current Skill Gaps: ${JSON.stringify(context?.skillGaps || context?.skillGapResult?.topSkillsToLearn || [])}
- Roadmap Progress: ${context?.roadmapProgress || "Foundations"}

Always tailor your answers directly to the student's specific background. Give crisp, practical, encouraging advice. Break technical concepts down with intuitive real-world metaphors, provide short code snippets when helpful, and recommend specific next actions from their roadmap.`;

    const { result } = await sendChatMessageWithResilience(ai, {
      systemInstruction,
      message,
    });
    const replyText = result.text || "";
    return res.json({ reply: replyText, response: replyText, source: "gemini_live" });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return res.json({
      reply: "I had a momentary connection hiccup, but I am here to help! Based on your roadmap, remember to stay consistent with your weekly learning goals.",
      response: "I had a momentary connection hiccup, but I am here to help! Based on your roadmap, remember to stay consistent with your weekly learning goals.",
      source: "demo_fallback",
    });
  }
};

app.post("/api/chat", handleChat);
app.post("/api/chat/assistant", handleChat);

// 9. AI Quiz Generator
app.post("/api/quiz/generate", async (req: Request, res: Response) => {
  const { topic, materialText, learningMaterial, numQuestions, questionCount = 5, careerName } = req.body;
  const count = Math.min(Math.max(Number(numQuestions || questionCount) || 5, 3), 20);
  const material = materialText || learningMaterial || "";
  const ai = getGeminiClient();

  if (!ai) {
    const sliced = DEMO_QUIZ_QUESTIONS.slice(0, count);
    return res.json({ questions: sliced, data: sliced, source: "demo_fallback" });
  }

  try {
    const prompt = `Generate ${count} high-quality, practical Multiple Choice Questions (MCQs) to evaluate knowledge for a student pursuing "${careerName || "Software & AI"}".
${topic ? `Topic focus: ${topic}` : ""}
${material ? `Based on this uploaded study material:\n"""${material.slice(0, 10000)}"""` : ""}

For each question:
- question: clear, scenario-based or conceptual technical question
- options: array of 4 distinct string choices
- correctAnswerIndex: 0-based integer index of correct answer
- explanation: clear explanation why that answer is correct and why other choices are traps or wrong
- difficulty: "Easy" | "Medium" | "Hard"
- topic: specific sub-concept tested`;

    const { response } = await generateContentWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ["id", "question", "options", "correctAnswerIndex", "explanation", "difficulty", "topic"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ questions: parsed, data: parsed, source: "gemini_live" });
  } catch (error) {
    console.error("Gemini quiz generator error:", error);
    return res.json({ questions: DEMO_QUIZ_QUESTIONS.slice(0, count), data: DEMO_QUIZ_QUESTIONS.slice(0, count), source: "demo_fallback" });
  }
});

// 10. Smart Roadmap Reassessment
app.post("/api/roadmap/smart-update", async (req: Request, res: Response) => {
  const { currentRoadmap, completedSkillIds, quizScore, weakTopics } = req.body;
  // Mark completed items
  const updated = JSON.parse(JSON.stringify(currentRoadmap || DEMO_ROADMAP));
  if (Array.isArray(completedSkillIds)) {
    updated.phases.forEach((phase: any) => {
      phase.items.forEach((item: any) => {
        if (completedSkillIds.includes(item.id)) {
          item.status = "completed";
        }
      });
    });
  }

  // If quizScore < 60 and weakTopics exist, add reinforcement task
  if (quizScore !== undefined && quizScore < 70 && weakTopics?.length > 0) {
    const firstPhase = updated.phases[0];
    if (firstPhase && !firstPhase.items.some((i: any) => i.id === "reinforce-quiz")) {
      firstPhase.items.unshift({
        id: "reinforce-quiz",
        phaseNumber: firstPhase.phaseNumber,
        phaseName: firstPhase.phaseName,
        topic: `Concept Reinforcement: ${weakTopics.slice(0, 2).join(", ")}`,
        difficulty: "Intermediate",
        priority: "Critical",
        estimatedHours: 4,
        prerequisites: [],
        whatToLearn: [`Deep dive into ${weakTopics.join(", ")} based on recent quiz performance diagnostics.`],
        practiceTask: "Review recommended documentation and retake diagnostic quiz to achieve >80% mastery.",
        projectSuggestion: "Quick micro-exercise notebook testing these concepts.",
        learningResources: [{ title: "Interactive Concept Diagnostics Review", type: "Tutorial" }],
        status: "in_progress",
      });
    }
  }

  return res.json({
    data: updated,
    message: "Roadmap dynamically recalculated based on your ongoing learning achievements and quiz insights!",
  });
});

// Vite Middleware for development & Static Serving for production
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDistIndex = fs.existsSync(path.join(distPath, "index.html"));
  const isBundled = typeof __filename !== "undefined" && (__filename.endsWith(".cjs") || __filename.includes("dist"));
  const isProduction = process.env.NODE_ENV === "production" || isBundled || hasDistIndex;

  if (isProduction && hasDistIndex) {
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite dev middleware not loaded, using static files:", e);
      if (hasDistIndex) {
        app.use(express.static(distPath));
        app.get("*", (req: Request, res: Response) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      }
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillPath AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
