export interface PersonalInfo {
  name: string;
  email: string;
  location: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

export interface EducationItem {
  degree: string;
  branch: string;
  college: string;
  graduationYear: string;
  cgpaOrPercentage?: string;
}

export interface CategorizedSkills {
  programming: string[];
  ai_ml: string[];
  data: string[];
  web: string[];
  cloud: string[];
  databases: string[];
  tools: string[];
  other: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  skillsDemonstrated: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
}

export interface ResumeAnalysis {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  skills: CategorizedSkills;
  softSkills: string[];
  projects: ProjectItem[];
  certifications: string[];
  experience: ExperienceItem[];
  summary?: string;
  isAiGenerated?: boolean;
}

export interface CareerRecommendation {
  careerName: string;
  matchPercentage: number;
  whyItMatches: string;
  currentStrengths: string[];
  missingSkills: string[];
  recommendedNextSteps: string[];
}

export interface IndustryRequirements {
  careerName: string;
  overview: string;
  essentialSkills: string[];
  emergingSkills: string[];
  typicalTools: string[];
  salaryRange?: string;
  marketDemand: 'High' | 'Very High' | 'Moderate';
}

export type SkillLevel = 'Strong' | 'Intermediate' | 'Beginner' | 'Missing';

export interface SkillGapItem {
  skill: string;
  category: string;
  score: number; // 0 to 100
  status: SkillLevel;
  importance: 'Critical' | 'High' | 'Medium';
  notes?: string;
}

export interface PrioritySkillToLearn {
  skill: string;
  whyYouNeedIt: string;
  currentLevel: string;
  targetLevel: string;
  priority: 'High' | 'Urgent' | 'Medium';
  estimatedHours: number;
}

export interface SkillGapAnalysisResult {
  overallMatchScore: number;
  careerName: string;
  skillGaps: SkillGapItem[];
  topSkillsToLearn: PrioritySkillToLearn[];
  readinessSummary: string;
}

export type RoadmapItemStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'Not Started'
  | 'In Progress'
  | 'Completed';

export interface RoadmapItem {
  id: string;
  phaseNumber: number;
  phaseName: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  priority: 'Critical' | 'High' | 'Medium';
  estimatedHours: number;
  prerequisites: string[];
  whatToLearn: string[] | string;
  practiceTask: string;
  projectSuggestion: string;
  learningResources: {
    title: string;
    type: 'Documentation' | 'Course' | 'Tutorial' | 'Practice';
    url?: string;
  }[];
  status: RoadmapItemStatus;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  title?: string;
  description: string;
  goal?: string;
  estimatedWeeks: number | string;
  items: RoadmapItem[];
}

export interface PersonalizedRoadmap {
  careerName: string;
  careerGoal?: string;
  weeklyHours: string;
  weeklyStudyHours?: string;
  totalEstimatedWeeks: number;
  estimatedTotalWeeks?: number;
  totalEstimatedHours: number;
  phases: RoadmapPhase[];
  generatedAt: string;
}

export type Roadmap = PersonalizedRoadmap;

export interface GeneratedProject {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  problemStatement: string;
  objective: string;
  features: string[];
  techStack: string[];
  recommendedTechStack?: string[];
  skillsPracticed: string[];
  implementationSteps: string[];
  expectedOutcome: string;
}

export type ProjectRecommendation = GeneratedProject;

export interface ChatMessage {
  id?: string;
  sender?: 'user' | 'assistant';
  role?: 'user' | 'assistant';
  text?: string;
  content?: string;
  timestamp?: string;
  suggestedAction?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface QuizResult {
  totalQuestions: number;
  score: number;
  percentage: number;
  correctAnswersCount: number;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>;
  weakTopics: string[];
  recommendations: string[];
}
