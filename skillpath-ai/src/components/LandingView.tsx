import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  Brain,
  GitCompare,
  TrendingUp,
  MapPin,
  Code,
  ShieldCheck,
  CheckCircle,
  Play,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';
import { ThreeCanvas } from './ThreeCanvas';

interface LandingViewProps {
  onStartUpload: () => void;
  onExploreCareers: () => void;
  onTryDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartUpload,
  onExploreCareers,
  onTryDemo,
}) => {
  const steps = [
    {
      num: '1',
      title: 'Upload Resume',
      desc: 'Upload PDF, DOCX, or TXT. Our parser extracts your authentic academic and project record.',
      icon: FileCheck,
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      num: '2',
      title: 'AI Analyzes Skills',
      desc: 'Gemini 3.8 extracts and classifies core programming, frameworks, tools, and soft competencies.',
      icon: Brain,
      color: 'from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      num: '3',
      title: 'Identify Skill Gaps',
      desc: 'Detailed comparison against real-world benchmarks identifies missing and intermediate skills.',
      icon: GitCompare,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      num: '4',
      title: 'Choose Career',
      desc: 'Select your target dream role or let Gemini recommend the highest match for your background.',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      num: '5',
      title: 'Personalized Roadmap',
      desc: 'Receive a multi-phase learning plan tailored to your weekly study hours without relearning what you know.',
      icon: MapPin,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
    {
      num: '6',
      title: 'Build Projects & Track Progress',
      desc: 'Build portfolio projects designed to close skill gaps, take adaptive diagnostic quizzes, and track mastery.',
      icon: Code,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    },
  ];

  const features = [
    {
      title: 'AI Resume Analysis',
      desc: 'Extracts degree, projects, technical categories, certifications, and experience without inventing details.',
      icon: Brain,
      badge: 'Gemini 3.8',
    },
    {
      title: 'Career Recommendations',
      desc: 'Intelligent match percentage calculation with strength assessment and actionable next steps.',
      icon: TrendingUp,
      badge: 'Contextual',
    },
    {
      title: 'Skill Gap Analysis',
      desc: 'Four-tier categorization (Strong, Intermediate, Beginner, Missing) with ranked Top 5 priorities.',
      icon: GitCompare,
      badge: 'Diagnostic',
    },
    {
      title: 'Industry Skill Mapping',
      desc: 'Distinguishes essential baseline competencies from emerging competitive advantages (RAG, MLOps, Agents).',
      icon: Layers,
      badge: 'Benchmarked',
    },
    {
      title: 'Personalized Roadmaps',
      desc: 'Adaptive study timeline scaled to your weekly bandwidth (3-5h up to 15+h), preserving existing mastery.',
      icon: MapPin,
      badge: 'Dynamic',
    },
    {
      title: 'AI Project Recommendations',
      desc: 'Tailored Beginner, Intermediate, and Advanced project blueprints designed to close specific skill deficits.',
      icon: Code,
      badge: 'Actionable',
    },
    {
      title: 'Learning Progress Tracking',
      desc: 'Interactive checklist, diagnostic quiz generation, and smart roadmap updates reflecting verified performance.',
      icon: Award,
      badge: 'Real-time',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with 3D Canvas */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow background accents */}
        <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Smart AI Career Navigation for Students &amp; Graduates</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Bridge the Gap Between Your Skills and Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                Dream Career.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              AI-powered career guidance that analyzes your resume, identifies skill gaps, understands industry requirements, and creates a personalized learning roadmap.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-analyze-resume-btn"
                onClick={onStartUpload}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-careers-btn"
                onClick={onExploreCareers}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all hover:scale-[1.02] active:scale-95"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Explore Careers</span>
              </button>

              <button
                id="hero-try-demo-btn"
                onClick={onTryDemo}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 hover:border-indigo-600 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                <span>Try Demo (Alex)</span>
              </button>
            </div>

            {/* Privacy notice banner */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Your resume is analyzed to generate personalized career recommendations and learning guidance.
              </span>
            </div>
          </div>

          {/* Hero Right: 3D Interactive Three.js Canvas */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <div className="w-full aspect-square max-w-[440px] rounded-3xl border border-indigo-500/20 bg-slate-900/40 backdrop-blur-md p-2 shadow-2xl relative overflow-hidden group">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Interactive 3D Skill Nexus</span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                Drag to rotate constellation
              </div>

              <ThreeCanvas interactive={true} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A comprehensive, 6-step AI workflow turning your resume into an achievable roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900/80 p-6 transition-all hover:border-slate-700 hover:shadow-xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border bg-gradient-to-br ${step.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-display text-3xl font-black text-slate-700 group-hover:text-indigo-400/40 transition-colors">
                    0{step.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-white mb-2 group-hover:text-indigo-200 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Key Features
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Engineered specifically for engineering students, hackathon judges, and early professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition-all hover:border-indigo-500/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-sm text-white mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sample Demo Fast-Track Card */}
      <section className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-cyan-950/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Judge Evaluation / Instant Preview</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Experience Alex’s Profile in 1 Click
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Pre-loaded with a real B.Tech AI &amp; ML 2nd-year resume, complete skill gap breakdown, AI-generated roadmap, projects, and diagnostic quiz.
          </p>
        </div>

        <button
          onClick={onTryDemo}
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Demo Workflow</span>
        </button>
      </section>
    </div>
  );
};
