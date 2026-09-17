import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  FileCode,
  ArrowRight,
  Loader2,
  Copy,
} from 'lucide-react';
import { SAMPLE_RESUME_TEXT } from '../data/mockData';

interface ResumeUploadViewProps {
  onAnalyzeResume: (text: string, fileName?: string, fileBase64?: string, mimeType?: string) => Promise<void>;
  isLoading: boolean;
}

export const ResumeUploadView: React.FC<ResumeUploadViewProps> = ({
  onAnalyzeResume,
  isLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste'>('upload');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PROGRESS_STEPS = [
    'Reading your resume...',
    'Identifying your skills...',
    'Comparing your profile with career requirements...',
    'Building your personalized roadmap...',
    'Your AI roadmap is ready!',
  ];

  // Progressive loading animation step updates
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setFileError(null);

    // Validation: 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit. Please upload a smaller PDF, DOCX, or TXT document.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'docx', 'txt', 'md'];
    if (!extension || !validExtensions.includes(extension)) {
      setFileError('Unsupported file type. Please upload a PDF, DOCX, or TXT resume.');
      return;
    }

    setSelectedFile(file);

    // Convert to base64 for reliable binary transmission to Gemini server
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      setFileBase64(result);

      if (extension === 'txt' || extension === 'md') {
        const text = await file.text();
        setResumeText(text);
      } else {
        // For PDF/DOCX, provide an informative text preview
        setResumeText(`[Document Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\nGemini 3.8 Flash will inspect the full document structure and extract verified credentials.`);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read the selected file. Please try selecting it again or paste the text directly.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    setFileError(null);
    setResumeText(SAMPLE_RESUME_TEXT);
    setFileBase64('');
    setSelectedFile(new File([SAMPLE_RESUME_TEXT], 'Alex_Johnson_BTech_AIML_Resume.txt', { type: 'text/plain' }));
  };

  const handleStartAnalysis = () => {
    if (!resumeText.trim() && !fileBase64) return;
    onAnalyzeResume(
      resumeText,
      selectedFile?.name || 'Uploaded_Resume.txt',
      fileBase64,
      selectedFile?.type || 'text/plain'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Stage 1: AI Knowledge Ingestion</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze Your Resume with AI
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Upload your resume in PDF, DOCX, or TXT format. Gemini AI extracts your verified skills, projects, and coursework to benchmark you against industry demands.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Toggle Mode: Upload vs Paste */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveInputMode('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeInputMode === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveInputMode('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeInputMode === 'paste'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              Paste Text / Markdown
            </button>
          </div>

          <button
            onClick={handleLoadSample}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Use Alex’s Sample Resume</span>
          </button>
        </div>

        {/* Upload Mode */}
        {activeInputMode === 'upload' ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-950/10'
                : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-950/50 hover:bg-slate-900/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                Drag &amp; drop your resume here, or <span className="text-indigo-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Supported formats: PDF, DOCX, TXT
              </p>
            </div>

            {selectedFile && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
        ) : (
          /* Paste Mode */
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Paste your raw resume text, markdown, or profile summary:
            </label>
            <textarea
              rows={9}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste education, skills, projects, and work experience here..."
              className="w-full rounded-2xl bg-slate-950 border border-slate-700/80 p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
            />
          </div>
        )}

        {/* File Validation Error Banner */}
        {fileError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start justify-between gap-3 text-rose-200 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-semibold mb-0.5">Upload Error</strong>
                <span>{fileError}</span>
              </div>
            </div>
            <button
              onClick={() => setFileError(null)}
              className="text-xs text-rose-300 hover:text-white underline shrink-0 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Selected File Details & Trigger Button */}
        {resumeText && !isLoading && (
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Custom Resume Content Loaded'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB document ready` : `${resumeText.length} characters ready`} for Gemini AI analysis
                </p>
              </div>
            </div>

            <button
              id="analyze-with-gemini-btn"
              onClick={handleStartAnalysis}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze with Gemini AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading State with 5 Progressive Milestones */}
        {isLoading && (
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-8 text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-7 h-7 animate-spin text-cyan-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold text-white">
                Gemini AI is processing your resume
              </h3>
              <p className="text-sm font-semibold text-cyan-300">
                {PROGRESS_STEPS[loadingStepIndex]}
              </p>
            </div>

            {/* Stepped progress indicators */}
            <div className="grid grid-cols-5 gap-1.5 max-w-lg mx-auto pt-2">
              {PROGRESS_STEPS.map((step, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx <= loadingStepIndex
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-sm shadow-cyan-400/50'
                        : 'bg-slate-800'
                    }`}
                  />
                  <span className={`text-[10px] hidden sm:block ${idx === loadingStepIndex ? 'text-cyan-300 font-bold' : idx < loadingStepIndex ? 'text-slate-400' : 'text-slate-600'}`}>
                    Step {idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400">
              Synthesizing degree, technical skills, projects, and experience without hallucinating details.
            </p>
          </div>
        )}

        {/* Privacy notice banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Privacy Guarantee:</strong> Your resume is analyzed securely to generate personalized career recommendations and learning guidance. We do not expose uploaded resumes publicly.
          </span>
        </div>
      </div>
    </div>
  );
};
