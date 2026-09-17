import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Bot,
  LineChart,
  BarChart3,
  Code2,
  Cloud,
  ShieldCheck,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { CAREER_OPTIONS, DEMO_RECOMMENDATIONS } from '../data/mockData';
import { CareerRecommendation, ResumeAnalysis } from '../types';

interface CareerSelectViewProps {
  selectedCareer: string;
  onSelectCareer: (careerName: string) => void;
  onRecommendCareers: () => Promise<CareerRecommendation[]>;
  recommendations: CareerRecommendation[];
  isRecommending: boolean;
  resumeAnalysis: ResumeAnalysis | null;
  onProceedToGapAnalysis: () => void;
}

export const CareerSelectView: React.FC<CareerSelectViewProps> = ({
  selectedCareer,
  onSelectCareer,
  onRecommendCareers,
  recommendations,
  isRecommending,
  resumeAnalysis,
  onProceedToGapAnalysis,
}) => {
  const [showRecommendations, setShowRecommendations] = useState(recommendations.length > 0);
  const [customCareer, setCustomCareer] = useState('');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return Brain;
      case 'Sparkles':
        return Sparkles;
      case 'LineChart':
        return LineChart;
      case 'BarChart3':
        return BarChart3;
      case 'Code2':
        return Code2;
      case 'Cloud':
        return Cloud;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Bot':
        return Bot;
      case 'Briefcase':
      default:
        return Briefcase;
    }
  };

  const handleRecommendClick = async () => {
    setShowRecommendations(true);
    await onRecommendCareers();
  };

  const handleSelectRecommendation = (rec: CareerRecommendation) => {
    onSelectCareer(rec.careerName);
  };

  const handleAddCustomCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCareer.trim()) {
      onSelectCareer(customCareer.trim());
      setCustomCareer('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Stage 2: Goal Alignment</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What Career Do You Want?
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Choose the role you want to conquer. We will map industry requirements against your resume to uncover your exact learning path.
        </p>
      </div>

      {/* AI Recommender Hero Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Bot className="w-4 h-4" />
            <span>Unsure which field suits your skills?</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            "I'm not sure — Recommend a career for me"
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Gemini AI will cross-reference your specific programming knowledge, academic branch, and projects to pinpoint your top 3 matching industry careers.
          </p>
        </div>

        <button
          id="recommend-careers-btn"
          onClick={handleRecommendClick}
          disabled={isRecommending}
          className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {isRecommending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Match Factors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Recommend for Me</span>
            </>
          )}
        </button>
      </div>

      {/* Recommended Careers Display */}
      {showRecommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Top 3 AI Recommended Careers For You</span>
            </h3>
            <span className="text-xs text-slate-400">
              Ranked by background synergy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(recommendations.length > 0 ? recommendations : DEMO_RECOMMENDATIONS).map(
              (rec, idx) => {
                const isSelected = selectedCareer === rec.careerName;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectRecommendation(rec)}
                    className={`rounded-3xl border p-5 sm:p-6 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-600/20 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Rank #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <span>{rec.matchPercentage}% Match</span>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-lg text-white">
                        {rec.careerName}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rec.whyItMatches}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <p className="text-[10px] font-semibold uppercase text-emerald-400">
                          Current Strengths
                        </p>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {(rec.currentStrengths || []).slice(0, 2).map((st, sIdx) => (
                            <li key={sIdx} className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-semibold uppercase text-rose-400">
                          Key Missing Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(rec.missingSkills || []).slice(0, 3).map((ms, mIdx) => (
                            <span
                              key={mIdx}
                              className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20"
                            >
                              {ms}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span>{isSelected ? 'Selected Goal' : 'Select Career'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }
            )}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Disclaimer: AI career recommendations provide strategic learning guidance and do not guarantee hiring outcomes.
          </p>
        </div>
      )}

      {/* Full Catalog of Target Careers */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-white">
            Or Choose from High-Demand Tech Career Tracks
          </h3>
          <span className="text-xs text-slate-400">
            Click any career to set as your primary goal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAREER_OPTIONS.map((c) => {
            const Icon = getIconComponent(c.icon);
            const isSelected = selectedCareer === c.name;

            return (
              <div
                key={c.id}
                id={`career-option-${c.id}`}
                onClick={() => onSelectCareer(c.name)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 group ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-600/20 ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      {c.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-cyan-400 font-medium">Demand: {c.demand}</span>
                      <span>•</span>
                      <span>{c.salary}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-700 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Career Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white">Looking for a niche career role?</h4>
          <p className="text-[11px] text-slate-400">
            Type any specific job title (e.g. "Computer Vision Engineer", "DevOps Specialist", "NLP Researcher")
          </p>
        </div>
        <form onSubmit={handleAddCustomCareer} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Type custom role..."
            value={customCareer}
            onChange={(e) => setCustomCareer(e.target.value)}
            className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
          >
            Set Goal
          </button>
        </form>
      </div>

      {/* Selected Career Action Banner */}
      {selectedCareer && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-300">Selected Target Career</span>
              <h3 className="font-display text-lg font-bold text-white">{selectedCareer}</h3>
            </div>
          </div>

          <button
            id="proceed-gap-analysis-btn"
            onClick={onProceedToGapAnalysis}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <span>Run Skill Gap Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
