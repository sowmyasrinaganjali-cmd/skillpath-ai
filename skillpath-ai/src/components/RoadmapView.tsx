import React, { useState } from 'react';
import {
  Map,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  ExternalLink,
  Sparkles,
  BookOpen,
  CodeXml,
  Printer,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Roadmap, RoadmapItem, RoadmapPhase } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap | null;
  onUpdateRoadmapItemStatus: (itemId: string, status: RoadmapItem['status']) => void;
  onRegenerateRoadmap: (weeklyHours: string) => Promise<void>;
  isGenerating: boolean;
  onProceedToProjects: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  onUpdateRoadmapItemStatus,
  onRegenerateRoadmap,
  isGenerating,
  onProceedToProjects,
}) => {
  const [selectedHours, setSelectedHours] = useState<string>(
    roadmap?.weeklyStudyHours || '5-10 hours/week'
  );
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (!roadmap) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-sm text-slate-400">Loading personalized roadmap...</p>
      </div>
    );
  }

  // Calculate overall completion %
  let totalItems = 0;
  let completedItems = 0;

  if (Array.isArray(roadmap.phases)) {
    roadmap.phases.forEach((phase) => {
      if (Array.isArray(phase.items)) {
        phase.items.forEach((item) => {
          totalItems++;
          const statusLower = (item.status || '').toLowerCase();
          if (statusLower === 'completed') {
            completedItems++;
          }
        });
      }
    });
  }

  const completionPercentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleStatusChange = (itemId: string, currentStatus: RoadmapItem['status']) => {
    const norm = (currentStatus || '').toLowerCase();
    let nextStatus: RoadmapItem['status'] = 'Not Started';
    if (norm === 'not started' || norm === 'not_started') {
      nextStatus = 'In Progress';
    } else if (norm === 'in progress' || norm === 'in_progress') {
      nextStatus = 'Completed';
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        // no-op if confetti fails in iframe
      }
    } else {
      nextStatus = 'Not Started';
    }

    onUpdateRoadmapItemStatus(itemId, nextStatus);
  };

  const handlePaceChange = async (newHours: string) => {
    setSelectedHours(newHours);
    await onRegenerateRoadmap(newHours);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stage 5: Personalized Execution Plan</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Your Personalized Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Targeting: <strong className="text-indigo-300">{roadmap.careerGoal || roadmap.careerName || 'Target Career'}</strong> • Total Estimated Time: <strong className="text-cyan-300">{roadmap.estimatedTotalWeeks || roadmap.totalEstimatedWeeks || 12} Weeks</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all"
            title="Export / Print Roadmap"
          >
            <Printer className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            id="proceed-projects-btn"
            onClick={onProceedToProjects}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>View Capstone Projects</span>
            <CodeXml className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Bar: Weekly Hours Selector & Overall Progress */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Study Pace Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Weekly Study Bandwidth:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['3-5 hours', '5-10 hours', '10-15 hours', '15+ hours'].map((pace) => {
                const isSelected = selectedHours.includes(pace);
                return (
                  <button
                    key={pace}
                    disabled={isGenerating}
                    onClick={() => handlePaceChange(`${pace}/week`)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {pace}/week
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="w-full md:w-64 space-y-1.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Roadmap Completion</span>
              <span className="font-mono font-bold text-indigo-400">
                {completionPercentage}% ({completedItems}/{totalItems})
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-2 text-xs text-indigo-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Gemini AI is recalibrating your roadmap milestones...</span>
          </div>
        )}
      </div>

      {/* Timeline Phases */}
      <div className="space-y-8 relative">
        {/* Timeline connector line */}
        <div className="absolute top-6 bottom-6 left-5 sm:left-6 w-0.5 bg-slate-800 -z-0 hidden md:block" />

        {(roadmap.phases || []).map((phase, pIdx) => {
          const items = Array.isArray(phase.items) ? phase.items : [];
          const phaseCompleted = items.length > 0 && items.every((i) => {
            const s = (i.status || '').toLowerCase();
            return s === 'completed';
          });
          const phaseInProgress = items.some((i) => {
            const s = (i.status || '').toLowerCase();
            return s === 'in progress' || s === 'in_progress' || s === 'completed';
          });

          return (
            <div key={phase.phaseNumber} className="relative z-10 space-y-4">
              {/* Phase Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-display font-black text-sm border shadow-lg ${
                    phaseCompleted
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : phaseInProgress
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  0{phase.phaseNumber}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                      {phase.title}
                    </h2>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {phase.estimatedWeeks}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{phase.goal}</p>
                </div>
              </div>

              {/* Phase Items */}
              <div className="space-y-3 pl-2 sm:pl-8">
                {items.map((item) => {
                  const isExpanded = !!expandedItems[item.id];
                  const s = (item.status || '').toLowerCase();
                  const isCompleted = s === 'completed';
                  const isInProgress = s === 'in progress' || s === 'in_progress';

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-emerald-950/10'
                          : isInProgress
                          ? 'border-indigo-500/40 bg-indigo-950/15 shadow-md shadow-indigo-600/10'
                          : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
                      }`}
                    >
                      {/* Item Main Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Interactive Status Checkbox */}
                          <button
                            onClick={() => handleStatusChange(item.id, item.status)}
                            className="mt-0.5 shrink-0 focus:outline-none"
                            title={`Status: ${item.status}. Click to cycle status.`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                            ) : isInProgress ? (
                              <PlayCircle className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4
                                className={`text-sm font-bold ${
                                  isCompleted
                                    ? 'line-through text-slate-400'
                                    : 'text-white'
                                }`}
                              >
                                {item.topic}
                              </h4>

                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                  item.difficulty === 'Beginner'
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : item.difficulty === 'Intermediate'
                                    ? 'bg-indigo-500/15 text-indigo-300'
                                    : 'bg-purple-500/15 text-purple-300'
                                }`}
                              >
                                {item.difficulty}
                              </span>

                              {item.priority === 'High' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                                  High Priority
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-none">
                              {Array.isArray(item.whatToLearn) ? item.whatToLearn.join(' • ') : item.whatToLearn}
                            </p>
                          </div>
                        </div>

                        {/* Right Details & Accordion Toggle */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{item.estimatedHours}h</span>
                          </div>

                          <button
                            onClick={() => handleStatusChange(item.id, item.status)}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : isInProgress
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {item.status}
                          </button>

                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            aria-label="Expand roadmap item details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Deep Details */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/70 space-y-4 rounded-b-2xl">
                          {/* Prerequisites */}
                          {item.prerequisites && item.prerequisites.length > 0 && (
                            <div className="text-xs space-y-1">
                              <span className="font-semibold text-slate-300 block">Prerequisites:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {item.prerequisites.map((pre, preIdx) => (
                                  <span
                                    key={preIdx}
                                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]"
                                  >
                                    {pre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Practice Task */}
                          {item.practiceTask && (
                            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                                <CodeXml className="w-3.5 h-3.5" />
                                <span>Hands-on Practice Task:</span>
                              </div>
                              <p className="text-slate-300">{item.practiceTask}</p>
                            </div>
                          )}

                          {/* Project Suggestion */}
                          {item.projectSuggestion && (
                            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Suggested Mini Project:</span>
                              </div>
                              <p className="text-slate-300">{item.projectSuggestion}</p>
                            </div>
                          )}

                          {/* Resources */}
                          {item.learningResources && item.learningResources.length > 0 && (
                            <div className="space-y-1.5 text-xs">
                              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                Recommended Learning Resources:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.learningResources.map((res, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="font-semibold text-slate-200 text-xs">{res.title}</p>
                                      <span className="text-[10px] text-slate-400 uppercase">
                                        {res.type}
                                      </span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-slate-500" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
