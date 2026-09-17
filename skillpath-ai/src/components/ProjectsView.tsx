import React, { useState } from 'react';
import {
  CodeXml,
  Sparkles,
  Layers,
  CheckCircle2,
  ListOrdered,
  Award,
  ArrowRight,
  Terminal,
  Cpu,
  FolderGit2,
  RefreshCw,
} from 'lucide-react';
import { ProjectRecommendation } from '../types';

interface ProjectsViewProps {
  projects: ProjectRecommendation[];
  careerGoal: string;
  onGenerateProjects: () => Promise<void>;
  isGenerating: boolean;
  onProceedToQuiz: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  careerGoal,
  onGenerateProjects,
  isGenerating,
  onProceedToQuiz,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const safeProjects = Array.isArray(projects) ? projects : [];

  const filteredProjects = safeProjects.filter((p) => {
    if (selectedDifficulty === 'all') return true;
    const diff = (p.difficulty || p.level || 'Intermediate').toLowerCase();
    return diff === selectedDifficulty.toLowerCase();
  });

  const getDifficultyBadge = (difficulty?: string) => {
    const norm = (difficulty || 'Intermediate').toLowerCase();
    if (norm === 'beginner') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          Beginner — Builds Core Confidence
        </span>
      );
    }
    if (norm === 'intermediate') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          Intermediate — Multi-Skill Integration
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
        Advanced — Production Portfolio Capstone
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <CodeXml className="w-3.5 h-3.5" />
            <span>Stage 6: Portfolio Engineering</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            AI Project Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Targeted project blueprints tailored for <span className="text-indigo-300 font-semibold">{careerGoal}</span> specifically designed to eliminate your identified skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="regenerate-projects-btn"
            onClick={onGenerateProjects}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate New Projects'}</span>
          </button>

          <button
            id="proceed-quiz-btn"
            onClick={onProceedToQuiz}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <span>Test Skills with Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedDifficulty === lvl
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredProjects.length} portfolio blueprints
        </span>
      </div>

      {/* Project Cards */}
      <div className="space-y-8">
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
            <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No projects found for "{selectedDifficulty}" difficulty</h3>
              <p className="text-xs text-slate-400">Switch filter to "all" or generate new projects to build your portfolio.</p>
            </div>
            <button
              onClick={() => setSelectedDifficulty('all')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
            >
              Reset Filter to All
            </button>
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const features = Array.isArray(project.features) ? project.features : [];
            const techStack = Array.isArray(project.recommendedTechStack)
              ? project.recommendedTechStack
              : Array.isArray((project as any).technologies)
              ? (project as any).technologies
              : [];
            const skillsPracticed = Array.isArray(project.skillsPracticed) ? project.skillsPracticed : [];
            const steps = Array.isArray(project.implementationSteps) ? project.implementationSteps : [];

            return (
              <div
                key={project.id || idx}
                className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl hover:border-slate-700 transition-all"
              >
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                        {project.title}
                      </h3>
                    </div>
                    {project.objective && (
                      <p className="text-xs text-indigo-300 font-medium">
                        Objective: {project.objective}
                      </p>
                    )}
                  </div>

                  {getDifficultyBadge(project.difficulty || project.level)}
                </div>

                {/* Problem Statement */}
                {project.problemStatement && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Problem Statement:
                    </span>
                    <p className="text-slate-300 leading-relaxed pl-6">
                      {project.problemStatement}
                    </p>
                  </div>
                )}

                {/* Key Features & Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key Features */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Key Architectural Features</span>
                    </h4>
                    {features.length > 0 ? (
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Core project modules and components</p>
                    )}
                  </div>

                  {/* Recommended Stack & Skills Practiced */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>Recommended Tech Stack</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-cyan-300 border border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Skills Practiced (Bridging Your Gaps)</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsPracticed.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Implementation Plan */}
                {steps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-emerald-400" />
                      <span>Step-by-Step Implementation Plan</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs"
                        >
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Step 0{sIdx + 1}
                          </span>
                          <p className="text-slate-300">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected Resume Outcome */}
                {project.expectedOutcome && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950 border border-indigo-500/30 flex items-start gap-3">
                    <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-xs">
                      <span className="font-bold text-indigo-300">Why this makes your resume stand out:</span>
                      <p className="text-slate-300 leading-relaxed">{project.expectedOutcome}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
