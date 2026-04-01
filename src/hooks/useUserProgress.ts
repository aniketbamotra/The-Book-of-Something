"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DifficultyLevel, QuizAttempt, CourseProgress } from "@/types";
import * as storage from "@/lib/progressStorage";

export function useUserProgress(
  courseId: string,
  defaultDifficulty: DifficultyLevel
) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cp = storage.initCourseProgress(courseId, defaultDifficulty);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(cp);
  }, [courseId, defaultDifficulty]);

  const updatePost = useCallback(
    (postId: string, postOrder: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        storage.updatePostProgress(courseId, postId, postOrder);
        setProgress(storage.getCourseProgress(courseId));
      }, 500);
    },
    [courseId]
  );

  const recordQuiz = useCallback(
    (attempt: QuizAttempt) => {
      storage.recordQuizAttempt(courseId, attempt);
      setProgress(storage.getCourseProgress(courseId));
    },
    [courseId]
  );

  const markComplete = useCallback(() => {
    storage.markCourseComplete(courseId);
    setProgress(storage.getCourseProgress(courseId));
  }, [courseId]);

  const reset = useCallback(() => {
    storage.resetCourseProgress(courseId, defaultDifficulty);
    setProgress(storage.getCourseProgress(courseId));
  }, [courseId, defaultDifficulty]);

  return { progress, updatePost, recordQuiz, markComplete, reset };
}
