import React from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Cpu,
  Wrench,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { IndustryRequirements } from '../types';

interface IndustryRequirementsViewProps {
  careerName: string;
  requirements: IndustryRequirements | null;
  onProceedToGapAnalysis: () => void;
}

export const IndustryRequirementsView: React.FC<IndustryRequirementsViewProps> = ({
  careerName,
  requirements,
  onProceedToGapAnalysis,
}) => {
  if (!requirements) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-sm text-slate-400">Loading industry requirements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stage 3: Market Benchmark Mapping</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Industry Skill Requirements
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Comprehensive competency framework for <span className="text-cyan-400 font-semibold">{careerName}</span>. Clearly distinguishing between non-negotiable core foundations and emerging competitive edges.
        </p>
      </div>

      {/* Role Overview Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Industry Profile</span>
            <h2 className="font-display text-2xl font-bold text-white">{careerName}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Demand: {requirements.marketDemand}
            </span>
            {requirements.salaryRange && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {requirements.salaryRange}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {requirements.overview}
        </p>

        {requirements.typicalTools && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              Standard Tools:
            </span>
            {(Array.isArray(requirements.typicalTools)
              ? requirements.typicalTools
              : typeof requirements.typicalTools === 'string'
              ? (requirements.typicalTools as string).split(',').map((s) => s.trim())
              : []
            ).map((tool, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Distinction Cards: Essential Skills vs Emerging Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Essential Skills Card */}
        <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/50 p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Essential Skills
                </h3>
                <p className="text-[11px] text-slate-400">Non-negotiable baseline competencies</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/50">
              {(requirements.essentialSkills || []).length} Requirements
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(requirements.essentialSkills || []).map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2.5 hover:border-slate-700 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Skills Card */}
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/50 p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Emerging Skills
                </h3>
                <p className="text-[11px] text-slate-400">Modern differentiator &amp; cutting-edge advantages</p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/50">
              {(requirements.emergingSkills || []).length} High-Impact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(requirements.emergingSkills || []).map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2.5 hover:border-cyan-500/30 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Benchmark Disclosure Notice */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300 block mb-0.5">Industry Benchmark Methodology</span>
          <span>
            These skill standards are modeled after 2025–2026 tech hiring profiles for leading tier-1 technology companies. Do not interpret these as guaranteed hiring criteria without verifying current employer job descriptions.
          </span>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/60 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white">
            See How Your Resume Measures Up
          </h3>
          <p className="text-xs text-slate-300">
            Compare your extracted resume against these industry requirements to generate your custom gap score.
          </p>
        </div>

        <button
          id="proceed-gap-from-reqs-btn"
          onClick={onProceedToGapAnalysis}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <span>Analyze My Skill Gap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
