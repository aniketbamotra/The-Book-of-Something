export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverGradient: string;
  emoji: string;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
}

export interface LessonPost {
  id: string;
  courseId: string;
  order: number;
  title: string;
  content: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  type: "text" | "code" | "tip" | "analogy" | "fact";
  codeLanguage?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  afterPostOrder: number;
  questions: QuizQuestion[];
}

export interface CourseData {
  course: Course;
  posts: LessonPost[];
  quizzes: Quiz[];
}

export interface QuizAttempt {
  quizId: string;
  completedAt: string;
  score: number;
  difficultyBefore: DifficultyLevel;
  difficultyAfter: DifficultyLevel;
  answers: { questionId: string; selectedIndex: number; correct: boolean }[];
}

export interface CourseProgress {
  courseId: string;
  currentPostOrder: number;
  completedPostIds: string[];
  currentDifficulty: DifficultyLevel;
  quizHistory: QuizAttempt[];
  consecutiveHoldCount: number;
  startedAt: string;
  lastActiveAt: string;
  completedAt?: string;
}

export interface UserProgress {
  version: number;
  courses: Record<string, CourseProgress>;
}
