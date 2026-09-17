import React from 'react';
import { Sparkles, Compass, CheckCircle2, Cpu, Menu, X, Play, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  hasGeminiKey: boolean;
  onLoadDemo: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  overallMatchScore?: number;
  roadmapProgress?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  hasGeminiKey,
  onLoadDemo,
  mobileMenuOpen,
  setMobileMenuOpen,
  overallMatchScore,
  roadmapProgress = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          id="nav-logo"
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                SkillPath
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Career & Skill Roadmap Generator
            </p>
          </div>
        </div>

        {/* Center Pill: Status & Live Metrics */}
        <div className="hidden md:flex items-center gap-3">
          {/* AI Connection Status */}
          <div
            id="nav-ai-status"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs"
            title={
              hasGeminiKey
                ? "Connected to Gemini 3.8 Live API"
                : "Active with verified demo dataset & offline fallback intelligence"
            }
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  hasGeminiKey ? "bg-emerald-400" : "bg-cyan-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  hasGeminiKey ? "bg-emerald-500" : "bg-cyan-500"
                }`}
              />
            </span>
            <span className="text-slate-300 font-medium">
              {hasGeminiKey ? "Gemini 3.8 Active" : "Demo Engine Ready"}
            </span>
          </div>

          {roadmapProgress > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Roadmap: {Math.round(roadmapProgress)}% Done</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-try-demo-btn"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 hover:border-indigo-500 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span>Try Demo (Alex)</span>
          </button>

          <button
            id="nav-analyze-resume-btn"
            onClick={() => onSelectTab('resume-upload')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-lg shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Resume</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
