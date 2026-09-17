import React from 'react';
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  CodeXml,
  HelpCircle,
} from 'lucide-react';
import {
  ResumeAnalysis,
  SkillGapAnalysisResult,
  Roadmap,
  ProjectRecommendation,
  QuizQuestion,
} from '../types';

interface DashboardViewProps {
  careerGoal: string;
  resumeAnalysis: ResumeAnalysis | null;
  skillGapResult: SkillGapAnalysisResult | null;
  roadmap: Roadmap | null;
  projects: ProjectRecommendation[];
  quizQuestions: QuizQuestion[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  careerGoal,
  resumeAnalysis,
  skillGapResult,
  roadmap,
  projects,
  quizQuestions,
  onNavigateTab,
}) => {
  // Compute roadmap metrics
  let totalRoadmapItems = 0;
  let completedRoadmapItems = 0;
  let currentActiveTopic = 'Foundational Setup & Bridge Gaps';

  if (roadmap && Array.isArray(roadmap.phases)) {
    roadmap.phases.forEach((p) => {
      if (Array.isArray(p.items)) {
        p.items.forEach((item) => {
          totalRoadmapItems++;
          const statusLower = (item.status || '').toLowerCase();
          if (statusLower === 'completed') {
            completedRoadmapItems++;
          } else if (
            (statusLower === 'in progress' || statusLower === 'in_progress') &&
            currentActiveTopic === 'Foundational Setup & Bridge Gaps'
          ) {
            currentActiveTopic = item.topic;
          }
        });
      }
    });
  }

  const roadmapProgress =
    totalRoadmapItems > 0
      ? Math.round((completedRoadmapItems / totalRoadmapItems) * 100)
      : 0;

  const matchScore = skillGapResult?.overallMatchScore || 45;
  const missingCount =
    skillGapResult?.skillGaps?.filter((s) => s.status === 'Missing').length || 0;
  const strongCount =
    skillGapResult?.skillGaps?.filter((s) => s.status === 'Strong').length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Mastery &amp; Analytics Command Center</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Career Progress Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time telemetry on your journey toward becoming a certified{' '}
            <strong className="text-cyan-400">{careerGoal}</strong>.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('roadmap')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Target Career */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Goal</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="font-display font-bold text-lg text-white truncate">
            {careerGoal}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300">
            <span>Market Demand: High</span>
          </div>
        </div>

        {/* Metric 2: Match Percentage */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Match Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-display font-bold text-2xl text-emerald-400">
            {matchScore}%
          </p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchScore}%` }} />
          </div>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Roadmap Done</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-display font-bold text-2xl text-cyan-400">
            {roadmapProgress}%
          </p>
          <p className="text-[11px] text-slate-400">
            {completedRoadmapItems} of {totalRoadmapItems} milestones completed
          </p>
        </div>

        {/* Metric 4: Gaps Remaining */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Gaps Remaining</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="font-display font-bold text-2xl text-rose-400">
            {missingCount} Critical
          </p>
          <p className="text-[11px] text-slate-400">
            {strongCount} skills already verified strong
          </p>
        </div>
      </div>

      {/* 2-Column Main Section: Focus Area & Skill Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Learning Focus & Roadmap Phase Progress */}
        <div className="lg:col-span-7 space-y-6">
          {/* Current Focus Banner */}
          <div className="p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Current Active Focus</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                In Progress
              </span>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {currentActiveTopic}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Allocated weekly pace: <strong className="text-cyan-300">{roadmap?.weeklyStudyHours || '5-10 hours/week'}</strong>. Focus on practical exercises and build mini-projects to reinforce recall.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5"
              >
                <span>Open in Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('quiz')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test with Quiz</span>
              </button>
            </div>
          </div>

          {/* Phase Completion Progress */}
          {roadmap && (
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Roadmap Phases Breakdown</span>
              </h3>

              <div className="space-y-3">
                {roadmap.phases.map((ph) => {
                  const itemsInPhase = ph.items.length;
                  const completedInPhase = ph.items.filter((i) => i.status === 'Completed').length;
                  const pct = itemsInPhase > 0 ? Math.round((completedInPhase / itemsInPhase) * 100) : 0;

                  return (
                    <div
                      key={ph.phaseNumber}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">
                          Phase 0{ph.phaseNumber}: {ph.title}
                        </span>
                        <span className="font-mono text-slate-400">
                          {completedInPhase} / {itemsInPhase} items ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Skill Health & Quick Jump Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skill Health Breakdown */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Skill Gap Health</span>
            </h3>

            <div className="space-y-2.5">
              {skillGapResult?.topSkillsToLearn.slice(0, 4).map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{skill.skill}</p>
                    <span className="text-[10px] text-slate-400">
                      Target: {skill.targetLevel} • Est: {skill.estimatedHours}h
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      skill.priority === 'Urgent'
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {skill.priority}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Full Skill Gap Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Action Matrix */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Shortcuts
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigateTab('projects')}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <CodeXml className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Capstone Projects</p>
                <span className="text-[10px] text-slate-400">{projects.length} Available</span>
              </button>

              <button
                onClick={() => onNavigateTab('quiz')}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Diagnostic Quiz</p>
                <span className="text-[10px] text-slate-400">Test Mastery</span>
              </button>

              <button
                onClick={() => onNavigateTab('assistant')}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
              >
                <Sparkles className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Ask AI Assistant</p>
                <span className="text-[10px] text-slate-400">24/7 Mentorship</span>
              </button>

              <button
                onClick={() => onNavigateTab('resume-result')}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <Award className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Student Profile</p>
                <span className="text-[10px] text-slate-400">Extracted Skills</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
