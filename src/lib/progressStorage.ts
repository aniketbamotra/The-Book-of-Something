import type {
  UserProgress,
  CourseProgress,
  QuizAttempt,
  DifficultyLevel,
} from "@/types";

const STORAGE_KEY = "tbos_progress";
const SCHEMA_VERSION = 1;

function getDefault(): UserProgress {
  return { version: SCHEMA_VERSION, courses: {} };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    const parsed = JSON.parse(raw) as UserProgress;
    if (parsed.version !== SCHEMA_VERSION) return getDefault();
    return parsed;
  } catch {
    return getDefault();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // quota exceeded or private mode
  }
}

export function getCourseProgress(courseId: string): CourseProgress | null {
  const progress = loadProgress();
  return progress.courses[courseId] ?? null;
}

export function initCourseProgress(
  courseId: string,
  difficulty: DifficultyLevel
): CourseProgress {
  const existing = getCourseProgress(courseId);
  if (existing) return existing;

  const progress = loadProgress();
  const now = new Date().toISOString();
  const cp: CourseProgress = {
    courseId,
    currentPostOrder: 1,
    completedPostIds: [],
    currentDifficulty: difficulty,
    quizHistory: [],
    consecutiveHoldCount: 0,
    xp: 0,
    startedAt: now,
    lastActiveAt: now,
  };
  progress.courses[courseId] = cp;
  saveProgress(progress);
  return cp;
}

export function updatePostProgress(
  courseId: string,
  postId: string,
  postOrder: number
): void {
  const progress = loadProgress();
  const cp = progress.courses[courseId];
  if (!cp) return;
  if (!cp.completedPostIds.includes(postId)) {
    cp.completedPostIds.push(postId);
  }
  cp.currentPostOrder = Math.max(cp.currentPostOrder, postOrder);
  cp.lastActiveAt = new Date().toISOString();
  saveProgress(progress);
}

export function recordQuizAttempt(
  courseId: string,
  attempt: QuizAttempt
): void {
  const progress = loadProgress();
  const cp = progress.courses[courseId];
  if (!cp) return;
  cp.quizHistory.push(attempt);
  cp.currentDifficulty = attempt.difficultyAfter;
  cp.lastActiveAt = new Date().toISOString();
  saveProgress(progress);
}

export function markCourseComplete(courseId: string): void {
  const progress = loadProgress();
  const cp = progress.courses[courseId];
  if (!cp) return;
  cp.completedAt = new Date().toISOString();
  saveProgress(progress);
}

export function addXP(courseId: string, amount: number): number {
  const progress = loadProgress();
  const cp = progress.courses[courseId];
  if (!cp) return 0;
  cp.xp = (cp.xp ?? 0) + amount;
  cp.lastActiveAt = new Date().toISOString();
  saveProgress(progress);
  return cp.xp;
}

export function updateDifficulty(
  courseId: string,
  difficulty: DifficultyLevel,
  consecutiveHoldCount: number
): void {
  const progress = loadProgress();
  const cp = progress.courses[courseId];
  if (!cp) return;
  cp.currentDifficulty = difficulty;
  cp.consecutiveHoldCount = consecutiveHoldCount;
  cp.lastActiveAt = new Date().toISOString();
  saveProgress(progress);
}

export function resetCourseProgress(
  courseId: string,
  difficulty: DifficultyLevel
): void {
  const progress = loadProgress();
  const now = new Date().toISOString();
  progress.courses[courseId] = {
    courseId,
    currentPostOrder: 1,
    completedPostIds: [],
    currentDifficulty: difficulty,
    quizHistory: [],
    consecutiveHoldCount: 0,
    xp: 0,
    startedAt: now,
    lastActiveAt: now,
  };
  saveProgress(progress);
}
