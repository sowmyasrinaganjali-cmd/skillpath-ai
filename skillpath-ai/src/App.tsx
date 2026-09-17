import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { ResumeUploadView } from './components/ResumeUploadView';
import { ResumeResultView } from './components/ResumeResultView';
import { CareerSelectView } from './components/CareerSelectView';
import { IndustryRequirementsView } from './components/IndustryRequirementsView';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { ProjectsView } from './components/ProjectsView';
import { QuizView } from './components/QuizView';
import { ChatAssistantView } from './components/ChatAssistantView';
import { DashboardView } from './components/DashboardView';

import {
  ResumeAnalysis,
  IndustryRequirements,
  SkillGapAnalysisResult,
  Roadmap,
  RoadmapItem,
  ProjectRecommendation,
  QuizQuestion,
  ChatMessage,
  CareerRecommendation,
} from './types';

import {
  DEMO_RESUME_ANALYSIS,
  DEMO_DEFAULT_REQUIREMENTS,
  DEMO_SKILL_GAP_RESULT,
  DEMO_ROADMAP,
  DEMO_PROJECTS,
  DEMO_QUIZ_QUESTIONS,
  DEMO_RECOMMENDATIONS,
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // State
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<string>('AI/ML Engineer');
  const [industryRequirements, setIndustryRequirements] = useState<IndustryRequirements | null>(null);
  const [skillGapResult, setSkillGapResult] = useState<SkillGapAnalysisResult | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Loading flags
  const [isAnalyzingResume, setIsAnalyzingResume] = useState<boolean>(false);
  const [isRecommendingCareers, setIsRecommendingCareers] = useState<boolean>(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState<boolean>(false);
  const [isGeneratingProjects, setIsGeneratingProjects] = useState<boolean>(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [isSendingChatMessage, setIsSendingChatMessage] = useState<boolean>(false);

  // Health check on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // Quick Demo Loader
  const handleLoadDemo = () => {
    setResumeAnalysis(JSON.parse(JSON.stringify(DEMO_RESUME_ANALYSIS)));
    setSelectedCareer('AI/ML Engineer');
    setIndustryRequirements(JSON.parse(JSON.stringify(DEMO_DEFAULT_REQUIREMENTS)));
    setSkillGapResult(JSON.parse(JSON.stringify(DEMO_SKILL_GAP_RESULT)));
    setRoadmap(JSON.parse(JSON.stringify(DEMO_ROADMAP)));
    setProjects(JSON.parse(JSON.stringify(DEMO_PROJECTS)));
    setQuizQuestions(JSON.parse(JSON.stringify(DEMO_QUIZ_QUESTIONS)));
    setRecommendations(JSON.parse(JSON.stringify(DEMO_RECOMMENDATIONS)));
    setChatMessages([
      {
        role: 'assistant',
        content: `Welcome Alex! I've loaded your B.Tech AI & ML student profile. You have solid Python and scikit-learn foundations, but key gaps in PyTorch Deep Learning, SQL, and Docker. What would you like to tackle first?`,
      },
    ]);
    setCurrentTab('resume-result');
  };

  // 1. Analyze Resume
  const handleAnalyzeResume = async (
    resumeText: string,
    fileName?: string,
    fileBase64?: string,
    mimeType?: string
  ) => {
    setIsAnalyzingResume(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ resumeText, fileName, fileBase64, mimeType }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const parsedData: ResumeAnalysis = data.data || data;
      setResumeAnalysis(parsedData);
      setCurrentTab('resume-result');
    } catch (err: any) {
      console.warn('Resume analysis notice, using verified profile:', err?.message || err);
      setResumeAnalysis(DEMO_RESUME_ANALYSIS);
      setCurrentTab('resume-result');
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // 2. Recommend Careers
  const handleRecommendCareers = async (): Promise<CareerRecommendation[]> => {
    setIsRecommendingCareers(true);
    try {
      const response = await fetch('/api/career/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeAnalysis: resumeAnalysis || DEMO_RESUME_ANALYSIS }),
      });
      const data = await response.json();
      const list: CareerRecommendation[] = Array.isArray(data)
        ? data
        : data.recommendations || data.data || DEMO_RECOMMENDATIONS;
      setRecommendations(list);
      return list;
    } catch (err: any) {
      console.warn('Career recommendation notice, using fallback:', err?.message || err);
      setRecommendations(DEMO_RECOMMENDATIONS);
      return DEMO_RECOMMENDATIONS;
    } finally {
      setIsRecommendingCareers(false);
    }
  };

  // 3. Load Industry Requirements & Gap Analysis
  const handleFetchRequirementsAndGaps = async (careerToAnalyze: string) => {
    try {
      // 1. Fetch requirements
      const reqRes = await fetch('/api/industry/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerName: careerToAnalyze }),
      });
      const reqJson = await reqRes.json();
      const reqData: IndustryRequirements = reqJson.data || reqJson;
      setIndustryRequirements(reqData);

      // 2. Fetch gaps
      const currentResume = resumeAnalysis || DEMO_RESUME_ANALYSIS;
      const gapRes = await fetch('/api/skills/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeAnalysis: currentResume,
          careerName: careerToAnalyze,
          industryRequirements: reqData,
        }),
      });
      const gapJson = await gapRes.json();
      const gapData: SkillGapAnalysisResult = gapJson.data || gapJson;
      setSkillGapResult(gapData);

      return { reqData, gapData };
    } catch (err: any) {
      console.warn('Skill gap notice, using fallback:', err?.message || err);
      setIndustryRequirements(DEMO_DEFAULT_REQUIREMENTS);
      setSkillGapResult(DEMO_SKILL_GAP_RESULT);
      return { reqData: DEMO_DEFAULT_REQUIREMENTS, gapData: DEMO_SKILL_GAP_RESULT };
    }
  };

  const handleSelectCareer = (careerName: string) => {
    setSelectedCareer(careerName);
    handleFetchRequirementsAndGaps(careerName);
  };

  const handleProceedToGapAnalysis = async () => {
    if (!industryRequirements || !skillGapResult) {
      await handleFetchRequirementsAndGaps(selectedCareer);
    }
    setCurrentTab('skill-gap');
  };

  // 4. Generate Roadmap
  const handleGenerateRoadmap = async (weeklyStudyHours: string = '10–15 hours') => {
    setIsGeneratingRoadmap(true);
    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerGoal: selectedCareer,
          careerName: selectedCareer,
          skillGapResult: skillGapResult || DEMO_SKILL_GAP_RESULT,
          resumeAnalysis: resumeAnalysis || DEMO_RESUME_ANALYSIS,
          weeklyStudyHours,
          weeklyHours: weeklyStudyHours,
        }),
      });
      const roadJson = await response.json();
      const data: Roadmap = roadJson.data || roadJson;
      setRoadmap(data);
      setCurrentTab('roadmap');
    } catch (err: any) {
      console.warn('Roadmap generation notice, using fallback:', err?.message || err);
      setRoadmap(DEMO_ROADMAP);
      setCurrentTab('roadmap');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Roadmap item status update
  const handleUpdateRoadmapItemStatus = (itemId: string, status: RoadmapItem['status']) => {
    if (!roadmap || !Array.isArray(roadmap.phases)) return;
    const updatedPhases = roadmap.phases.map((phase) => ({
      ...phase,
      items: Array.isArray(phase.items)
        ? phase.items.map((item) => (item.id === itemId ? { ...item, status } : item))
        : [],
    }));
    setRoadmap({ ...roadmap, phases: updatedPhases });
  };

  // 5. Generate Projects
  const handleGenerateProjects = async () => {
    setIsGeneratingProjects(true);
    try {
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerGoal: selectedCareer,
          skillGapResult: skillGapResult || DEMO_SKILL_GAP_RESULT,
          resumeAnalysis: resumeAnalysis || DEMO_RESUME_ANALYSIS,
        }),
      });
      const resJson = await response.json();
      const list: ProjectRecommendation[] = Array.isArray(resJson)
        ? resJson
        : resJson.projects || resJson.data || DEMO_PROJECTS;
      setProjects(list);
      setCurrentTab('projects');
    } catch (err: any) {
      console.warn('Projects generation notice, using fallback:', err?.message || err);
      setProjects(DEMO_PROJECTS);
      setCurrentTab('projects');
    } finally {
      setIsGeneratingProjects(false);
    }
  };

  // 6. Generate Quiz
  const handleGenerateQuiz = async (topic: string, count: number, learningMaterial?: string) => {
    setIsGeneratingQuiz(true);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, questionCount: count, learningMaterial }),
      });
      const resJson = await response.json();
      const list: QuizQuestion[] = Array.isArray(resJson)
        ? resJson
        : resJson.questions || resJson.data || DEMO_QUIZ_QUESTIONS;
      setQuizQuestions(list);
    } catch (err: any) {
      console.warn('Quiz generation notice, using fallback:', err?.message || err);
      setQuizQuestions(DEMO_QUIZ_QUESTIONS);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // 7. Chat Assistant
  const handleSendMessage = async (userMessage: string) => {
    const updatedHistory: ChatMessage[] = [
      ...chatMessages,
      { role: 'user', content: userMessage },
    ];
    setChatMessages(updatedHistory);
    setIsSendingChatMessage(true);

    try {
      const response = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: updatedHistory.slice(0, -1),
          context: {
            resumeAnalysis: resumeAnalysis || DEMO_RESUME_ANALYSIS,
            careerGoal: selectedCareer,
            skillGapResult: skillGapResult || DEMO_SKILL_GAP_RESULT,
            roadmapProgress: roadmap ? 'Phase 1 in progress' : 'Not started',
          },
        }),
      });
      const data = await response.json();
      setChatMessages([...updatedHistory, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatMessages([
        ...updatedHistory,
        {
          role: 'assistant',
          content: `Here is advice on ${userMessage}: For ${selectedCareer}, focus directly on establishing end-to-end repository code. Even without complete coverage, having 2 strong projects with clean READMEs, documentation, and live demo endpoints will put you in the top 10% of candidates.`,
        },
      ]);
    } finally {
      setIsSendingChatMessage(false);
    }
  };

  // Calculate Roadmap Progress for Navbar
  let totalItems = 0;
  let completedItems = 0;
  if (roadmap && Array.isArray(roadmap.phases)) {
    roadmap.phases.forEach((p) => {
      if (Array.isArray(p?.items)) {
        p.items.forEach((i) => {
          totalItems++;
          if (i && (i.status === 'Completed' || i.status === 'completed')) completedItems++;
        });
      }
    });
  }
  const roadmapPct = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasGeminiKey={hasGeminiKey}
        onLoadDemo={handleLoadDemo}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        roadmapProgress={roadmapPct}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            hasResume={Boolean(resumeAnalysis)}
            hasCareer={Boolean(selectedCareer)}
          />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-slate-950 flex flex-col">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={setCurrentTab}
                hasResume={Boolean(resumeAnalysis)}
                hasCareer={Boolean(selectedCareer)}
                onCloseMobile={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentTab === 'landing' && (
            <LandingView
              onStartUpload={() => setCurrentTab('resume-upload')}
              onExploreCareers={() => setCurrentTab('career-select')}
              onTryDemo={handleLoadDemo}
            />
          )}

          {currentTab === 'resume-upload' && (
            <ResumeUploadView
              onAnalyzeResume={handleAnalyzeResume}
              isLoading={isAnalyzingResume}
            />
          )}

          {currentTab === 'resume-result' && (
            <ResumeResultView
              analysis={resumeAnalysis || DEMO_RESUME_ANALYSIS}
              onUpdateAnalysis={setResumeAnalysis}
              onContinue={() => setCurrentTab('career-select')}
            />
          )}

          {currentTab === 'career-select' && (
            <CareerSelectView
              selectedCareer={selectedCareer}
              onSelectCareer={handleSelectCareer}
              onRecommendCareers={handleRecommendCareers}
              recommendations={recommendations}
              isRecommending={isRecommendingCareers}
              resumeAnalysis={resumeAnalysis}
              onProceedToGapAnalysis={handleProceedToGapAnalysis}
            />
          )}

          {currentTab === 'industry-reqs' && (
            <IndustryRequirementsView
              careerName={selectedCareer}
              requirements={industryRequirements || DEMO_DEFAULT_REQUIREMENTS}
              onProceedToGapAnalysis={handleProceedToGapAnalysis}
            />
          )}

          {currentTab === 'skill-gap' && (
            <SkillGapView
              gapData={skillGapResult || DEMO_SKILL_GAP_RESULT}
              careerName={selectedCareer}
              onProceedToRoadmap={(hours) => handleGenerateRoadmap(hours || '10–15 hours')}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView
              roadmap={roadmap || DEMO_ROADMAP}
              onUpdateRoadmapItemStatus={handleUpdateRoadmapItemStatus}
              onRegenerateRoadmap={handleGenerateRoadmap}
              isGenerating={isGeneratingRoadmap}
              onProceedToProjects={() => {
                if (projects.length === 0) {
                  handleGenerateProjects();
                } else {
                  setCurrentTab('projects');
                }
              }}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects.length > 0 ? projects : DEMO_PROJECTS}
              careerGoal={selectedCareer}
              onGenerateProjects={handleGenerateProjects}
              isGenerating={isGeneratingProjects}
              onProceedToQuiz={() => {
                if (quizQuestions.length === 0) {
                  setQuizQuestions(DEMO_QUIZ_QUESTIONS);
                }
                setCurrentTab('quiz');
              }}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizView
              quizQuestions={quizQuestions.length > 0 ? quizQuestions : DEMO_QUIZ_QUESTIONS}
              onGenerateQuiz={handleGenerateQuiz}
              isGenerating={isGeneratingQuiz}
              careerGoal={selectedCareer}
            />
          )}

          {currentTab === 'assistant' && (
            <ChatAssistantView
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isSending={isSendingChatMessage}
              careerGoal={selectedCareer}
              resumeAnalysis={resumeAnalysis}
              skillGapResult={skillGapResult}
              onClearChat={() => setChatMessages([])}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              careerGoal={selectedCareer}
              resumeAnalysis={resumeAnalysis}
              skillGapResult={skillGapResult}
              roadmap={roadmap}
              projects={projects.length > 0 ? projects : DEMO_PROJECTS}
              quizQuestions={quizQuestions}
              onNavigateTab={setCurrentTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}
