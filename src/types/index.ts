export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type InteractionType =
  | "fill-blank"
  | "true-false"
  | "spot-bug"
  | "predict"
  | "order";

// ─── Challenge union ──────────────────────────────────────────────────────────

export interface FillBlankChallenge {
  type: "fill-blank";
  /** Code or text prompt; every `___` is one blank in order. */
  prompt: string;
  blanks: { position: number; answer: string }[];
  explanation: string;
}

export interface TrueFalseChallenge {
  type: "true-false";
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export type Challenge = FillBlankChallenge | TrueFalseChallenge;

// ─── Course data ──────────────────────────────────────────────────────────────

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
  /** Which section this post belongs to (1-indexed). Drives section-complete cards. */
  section?: number;
  /** Which interaction card type follows this post. */
  interactionType?: InteractionType;
  /** Base XP awarded for answering correctly. */
  xpReward?: number;
  /** Links a learn post to its paired interaction post. */
  conceptId?: string;
  /** If present, an interaction card is inserted after this post. */
  challenge?: Challenge;
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
  /** Total XP earned in this course. */
  xp: number;
}

export interface UserProgress {
  version: number;
  courses: Record<string, CourseProgress>;
}

export type ConfidenceResult = "got_it" | "need_help" | "show_again";
