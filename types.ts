
export enum AppMode {
  EXPLAIN = 'EXPLAIN',
  QUIZ = 'QUIZ',
  STUDY_PLAN = 'STUDY_PLAN',
  SUMMARIZE = 'SUMMARIZE'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'quiz' | 'plan' | 'summary';
  quizData?: Quiz;
  planData?: StudyPlan;
  summaryData?: Summary;
  sources?: Array<{ title: string; uri: string }>;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface StudyPlanItem {
  topic: string;
  duration: string;
  description: string;
  resources: string[];
}

export interface StudyPlan {
  title: string;
  items: StudyPlanItem[];
}

export interface Summary {
  mainPoint: string;
  takeaways: string[];
  context?: string;
}
