import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Award,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  quizQuestions: QuizQuestion[];
  onGenerateQuiz: (topic: string, count: number, material?: string) => Promise<void>;
  isGenerating: boolean;
  careerGoal: string;
  onSyncWeakTopicsToRoadmap?: (weakTopics: string[]) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizQuestions,
  onGenerateQuiz,
  isGenerating,
  careerGoal,
  onSyncWeakTopicsToRoadmap,
}) => {
  const [topicInput, setTopicInput] = useState<string>('Deep Learning & PyTorch Fundamentals');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [learningNotes, setLearningNotes] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const suggestedTopics = [
    'Deep Learning & PyTorch Fundamentals',
    'SQL Joins, Aggregations & Query Optimization',
    'Machine Learning Pipelines & Scikit-Learn',
    'Vector Databases, Embeddings & RAG Architecture',
    'Docker, FastAPI & Production MLOps',
  ];

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleGenerate = async () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    await onGenerateQuiz(topicInput, questionCount, learningNotes || undefined);
  };

  const safeQuestions = Array.isArray(quizQuestions) ? quizQuestions : [];

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    // calculate score
    let correct = 0;
    safeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });

    if (safeQuestions.length > 0 && correct / safeQuestions.length >= 0.7) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (err) {}
    }
  };

  const handleResetQuiz = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
  };

  // Score calculation
  let correctCount = 0;
  const wrongQuestions: QuizQuestion[] = [];

  safeQuestions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    } else {
      wrongQuestions.push(q);
    }
  });

  const scorePercentage =
    safeQuestions.length > 0 ? Math.round((correctCount / safeQuestions.length) * 100) : 0;

  // Identify weak areas
  const weakTopics = Array.from(
    new Set(
      wrongQuestions.map((q) => {
        if (q.topic) return q.topic;
        if (q.question) {
          const words = q.question.split(' ');
          return words.slice(0, 3).join(' ');
        }
        return 'General Technical Topic';
      })
    )
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Stage 7: Adaptive Knowledge Testing</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Quiz &amp; Concept Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Generate realistic technical diagnostic questions directly from your roadmap topics or paste notes to evaluate comprehension.
        </p>
      </div>

      {/* Generator Control Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="space-y-3">
          <label className="block text-xs font-bold text-white">Select Topic or Skill to Test</label>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. PyTorch Tensor operations, SQL indexing, Docker containers..."
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />

          {/* Suggested Topic Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 mr-1 self-center">Quick Presets:</span>
            {suggestedTopics.map((top, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopicInput(top)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  topicInput === top
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
              >
                {top}
              </button>
            ))}
          </div>
        </div>

        {/* Optional notes paste */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Optional: Paste Study Notes / Article Excerpt
            </span>
            <span className="text-slate-500">Gemini creates questions specifically from this text</span>
          </div>
          <textarea
            rows={3}
            value={learningNotes}
            onChange={(e) => setLearningNotes(e.target.value)}
            placeholder="Paste your lecture notes, textbook summary, or documentation snippet here..."
            className="w-full rounded-xl bg-slate-950 border border-slate-700/80 p-3 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Question Count & Trigger */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Number of Questions:</span>
            {[5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  questionCount === num
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {num} MCQs
              </button>
            ))}
          </div>

          <button
            id="generate-quiz-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Crafting Diagnostic Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Quiz with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quiz Runner Area */}
      {quizQuestions.length > 0 && (
        <div className="space-y-6">
          {/* Result Score Card if submitted */}
          {isSubmitted && (
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400">
                    Diagnostic Outcome
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Score: {correctCount} / {quizQuestions.length} ({scorePercentage}%)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {scorePercentage >= 80
                      ? 'Exceptional mastery! You demonstrate deep conceptual clarity.'
                      : scorePercentage >= 60
                      ? 'Good baseline knowledge with room to tighten up subtle edge cases.'
                      : 'Skill gaps detected in foundational concepts. Review the detailed explanations below.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>

              {/* Weak Topics Analysis */}
              {wrongQuestions.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Concept Gaps Identified ({wrongQuestions.length} questions missed):</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Focus on reinforcing these topics before proceeding to advanced portfolio projects.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Question List */}
          <div className="space-y-5">
            {safeQuestions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isSubmitted && selectedOpt === q.correctAnswerIndex;
              const isWrong = isSubmitted && isAnswered && selectedOpt !== q.correctAnswerIndex;
              const options = Array.isArray(q.options) ? q.options : [];

              return (
                <div
                  key={q.id || qIdx}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : isWrong
                        ? 'border-rose-500/40 bg-rose-950/10'
                        : 'border-slate-800 bg-slate-900/50'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-display font-semibold text-sm sm:text-base text-white leading-snug">
                      <span className="text-indigo-400 font-bold mr-2">Q{qIdx + 1}.</span>
                      {q.question}
                    </h4>

                    {q.difficulty && (
                      <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {q.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isOptionCorrect = optIdx === q.correctAnswerIndex;

                      let optStyle =
                        'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900';

                      if (isSubmitted) {
                        if (isOptionCorrect) {
                          optStyle =
                            'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500';
                        } else if (isChosen && !isOptionCorrect) {
                          optStyle =
                            'border-rose-500 bg-rose-950/40 text-rose-300 line-through';
                        } else {
                          optStyle = 'border-slate-800/40 opacity-50 text-slate-500';
                        }
                      } else if (isChosen) {
                        optStyle =
                          'border-indigo-500 bg-indigo-950/50 text-white font-medium ring-1 ring-indigo-500';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${optStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isSubmitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isChosen && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation upon submit */}
                  {isSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs text-slate-300">
                      <span className="font-bold text-indigo-300 block">Explanation:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action Button */}
          {!isSubmitted && (
            <div className="flex justify-end">
              <button
                id="submit-quiz-answers-btn"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>Submit Answers &amp; View Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
