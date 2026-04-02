"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type {
  CourseData,
  DifficultyLevel,
  ConfidenceResult,
  Quiz,
  LessonPost,
  QuizAttempt,
} from "@/types";
import { PostCard } from "@/components/feed/PostCard";
import { ConfidenceCard } from "@/components/feed/ConfidenceCard";
import { QuizCard } from "@/components/feed/QuizCard";
import { QuizResultsCard } from "@/components/feed/QuizResultsCard";
import { CompletionScreen } from "@/components/feed/CompletionScreen";
import { FeedProgressHUD } from "@/components/feed/FeedProgressHUD";
import { useUserProgress } from "@/hooks/useUserProgress";
import { adjustDifficulty } from "@/lib/difficultyEngine";

// ─── Feed item types ──────────────────────────────────────────────────────────

type PostItem = { kind: "post"; post: LessonPost; postIndex: number };
type ConfidenceItem = { kind: "confidence"; quiz: Quiz; quizIndex: number };
type QuizQuestionItem = {
  kind: "quiz-question";
  quiz: Quiz;
  quizIndex: number;
  questionIndex: number;
};
type ResultsItem = { kind: "results"; quiz: Quiz; quizIndex: number };
type CompletionItem = { kind: "completion" };

type FeedItem =
  | PostItem
  | ConfidenceItem
  | QuizQuestionItem
  | ResultsItem
  | CompletionItem;

interface Answer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function buildFeedItems(posts: LessonPost[], quizzes: Quiz[]): FeedItem[] {
  const items: FeedItem[] = [];
  let quizIndex = 0;
  posts.forEach((post, postIndex) => {
    items.push({ kind: "post", post, postIndex });
    const quiz = quizzes.find((q) => q.afterPostOrder === post.order);
    if (quiz) {
      const qIdx = quizIndex++;
      items.push({ kind: "confidence", quiz, quizIndex: qIdx });
      quiz.questions.forEach((_, questionIndex) => {
        items.push({
          kind: "quiz-question",
          quiz,
          quizIndex: qIdx,
          questionIndex,
        });
      });
      items.push({ kind: "results", quiz, quizIndex: qIdx });
    }
  });
  items.push({ kind: "completion" });
  return items;
}

function saveFeedIndex(courseId: string, index: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`tbos_feed_${courseId}`, String(index));
  } catch {}
}

function loadFeedIndex(courseId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const val = localStorage.getItem(`tbos_feed_${courseId}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

function saveConfidence(
  courseId: string,
  quizIndex: number,
  result: ConfidenceResult
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`tbos_confidence_${courseId}_${quizIndex}`, result);
  } catch {}
}

function loadConfidences(
  courseId: string,
  quizCount: number
): Record<number, ConfidenceResult> {
  if (typeof window === "undefined") return {};
  const out: Record<number, ConfidenceResult> = {};
  try {
    for (let i = 0; i < quizCount; i++) {
      const val = localStorage.getItem(`tbos_confidence_${courseId}_${i}`);
      if (val === "got_it" || val === "need_help" || val === "show_again") {
        out[i] = val;
      }
    }
  } catch {}
  return out;
}

function getConceptTitle(quiz: Quiz, posts: LessonPost[]): string {
  const post = posts.find((p) => p.order === quiz.afterPostOrder);
  return post?.title ?? "this concept";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FeedContainerProps {
  data: CourseData;
}

export function FeedContainer({ data }: FeedContainerProps) {
  const { course, posts, quizzes } = data;
  const router = useRouter();

  const feedItems = useMemo(
    () => buildFeedItems(posts, quizzes),
    [posts, quizzes]
  );

  const { progress, updatePost, recordQuiz, markComplete } = useUserProgress(
    course.id,
    course.difficulty
  );

  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    course.difficulty
  );
  const [holdCount, setHoldCount] = useState(0);

  // Confidence results keyed by quizIndex
  const [confidenceResults, setConfidenceResults] = useState<
    Record<number, ConfidenceResult>
  >({});
  // Quiz answers: [quizIndex][questionIndex] → Answer
  const [quizAnswersMap, setQuizAnswersMap] = useState<
    Record<number, Record<number, Answer>>
  >({});
  // Reset counter per quiz — increment to force QuizCards to remount (reset state)
  const [quizResetKeys, setQuizResetKeys] = useState<Record<number, number>>(
    {}
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync difficulty and holdCount from saved progress on first load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (progress?.currentDifficulty) setDifficulty(progress.currentDifficulty);

    if (progress?.consecutiveHoldCount != null)
      setHoldCount(progress.consecutiveHoldCount);
  }, [progress]);

  // Load persisted confidence results on mount
  useEffect(() => {
    const loaded = loadConfidences(course.id, quizzes.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Object.keys(loaded).length > 0) setConfidenceResults(loaded);
  }, [course.id, quizzes.length]);

  // Scroll helper
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const card = cardRefs.current[index];
      if (card) card.scrollIntoView({ behavior });
    },
    []
  );

  // Intersection observer — tracks which snap card is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            const index = cardRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index === -1) return;
            setActiveFeedIndex(index);
            saveFeedIndex(course.id, index);
            const item = feedItems[index];
            if (item?.kind === "post") {
              updatePost(item.post.id, item.post.order);
            }
            if (item?.kind === "completion") {
              markComplete();
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [feedItems, course.id, updatePost, markComplete]);

  // Restore scroll position on mount (instant, no animation)
  useEffect(() => {
    const saved = loadFeedIndex(course.id);
    if (saved > 0 && saved < feedItems.length) {
      setTimeout(() => scrollToIndex(saved, "instant"), 150);
    }
  }, [course.id, feedItems.length, scrollToIndex]);

  // ─── Computed values ────────────────────────────────────────────────────────

  // Count only lesson cards for the HUD (confidence/quiz/results don't count)
  const currentPostNumber = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= activeFeedIndex; i++) {
      if (feedItems[i]?.kind === "post") count++;
    }
    return count;
  }, [activeFeedIndex, feedItems]);

  const overallConfidencePct = useMemo(() => {
    const vals = Object.values(confidenceResults);
    if (vals.length === 0) return 0;
    const sum = vals.reduce(
      (s, c) => s + (c === "got_it" ? 100 : c === "show_again" ? 50 : 20),
      0
    );
    return Math.round(sum / vals.length);
  }, [confidenceResults]);

  const overallAccuracyPct = useMemo(() => {
    const allAnswers = Object.values(quizAnswersMap).flatMap((qMap) =>
      Object.values(qMap)
    );
    if (
      allAnswers.length === 0 &&
      progress &&
      progress.quizHistory.length > 0
    ) {
      const avg =
        progress.quizHistory.reduce((s, q) => s + q.score, 0) /
        progress.quizHistory.length;
      return Math.round(avg * 100);
    }
    if (allAnswers.length === 0) return 0;
    const correct = allAnswers.filter((a) => a.correct).length;
    return Math.round((correct / allAnswers.length) * 100);
  }, [quizAnswersMap, progress]);

  // ─── Event handlers ──────────────────────────────────────────────────────────

  const handleConfidence = useCallback(
    (
      quizIndex: number,
      quiz: Quiz,
      feedItemIndex: number,
      result: ConfidenceResult
    ) => {
      saveConfidence(course.id, quizIndex, result);
      setConfidenceResults((prev) => ({ ...prev, [quizIndex]: result }));

      if (result === "show_again") {
        // Replay the lesson block: find start of this block (after previous results card)
        let blockStart = 0;
        for (let i = feedItemIndex - 1; i >= 0; i--) {
          if (feedItems[i]?.kind === "results") {
            blockStart = i + 1;
            break;
          }
        }
        setTimeout(() => scrollToIndex(blockStart, "smooth"), 400);
      } else {
        // Advance into quiz questions
        setTimeout(() => scrollToIndex(feedItemIndex + 1, "smooth"), 400);
      }
    },
    [course.id, feedItems, scrollToIndex]
  );

  const handleQuizAnswer = useCallback(
    (quizIndex: number, questionIndex: number, answer: Answer) => {
      setQuizAnswersMap((prev) => ({
        ...prev,
        [quizIndex]: {
          ...(prev[quizIndex] ?? {}),
          [questionIndex]: answer,
        },
      }));
    },
    []
  );

  const handleResultsContinue = useCallback(
    (quizIndex: number, quiz: Quiz, resultsIndex: number) => {
      const answersMap = quizAnswersMap[quizIndex] ?? {};
      const answers = Object.values(answersMap);
      const correct = answers.filter((a) => a.correct).length;
      const score = answers.length > 0 ? correct / answers.length : 0;

      const { difficulty: newDiff, consecutiveHoldCount: newHold } =
        adjustDifficulty(difficulty, score, holdCount);
      setDifficulty(newDiff);
      setHoldCount(newHold);

      const attempt: QuizAttempt = {
        quizId: quiz.id,
        completedAt: new Date().toISOString(),
        score,
        difficultyBefore: difficulty,
        difficultyAfter: newDiff,
        answers: answers.map((a) => ({
          questionId: a.questionId,
          selectedIndex: a.selectedIndex,
          correct: a.correct,
        })),
      };
      recordQuiz(attempt);
      scrollToIndex(resultsIndex + 1, "smooth");
    },
    [quizAnswersMap, difficulty, holdCount, recordQuiz, scrollToIndex]
  );

  const handleResultsReview = useCallback(
    (quizIndex: number, confFeedIndex: number) => {
      setQuizAnswersMap((prev) => {
        const next = { ...prev };
        delete next[quizIndex];
        return next;
      });
      setConfidenceResults((prev) => {
        const next = { ...prev };
        delete next[quizIndex];
        return next;
      });
      // Bump reset key so QuizCards for this checkpoint remount with fresh state
      setQuizResetKeys((prev) => ({
        ...prev,
        [quizIndex]: (prev[quizIndex] ?? 0) + 1,
      }));
      try {
        localStorage.removeItem(`tbos_confidence_${course.id}_${quizIndex}`);
      } catch {}
      scrollToIndex(confFeedIndex, "smooth");
    },
    [course.id, scrollToIndex]
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative bg-background" style={{ height: "100dvh" }}>
      <FeedProgressHUD
        current={currentPostNumber}
        total={posts.length}
        difficulty={difficulty}
        courseTitle={course.title}
        onBack={() => router.push(`/course/${course.id}`)}
      />

      <div ref={containerRef} className="feed-container">
        {feedItems.map((item, index) => {
          const isActive = activeFeedIndex === index;

          return (
            <div
              key={`feeditem-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="feed-item"
            >
              {item.kind === "post" && (
                <PostCard
                  post={item.post}
                  difficulty={difficulty}
                  isActive={isActive}
                  totalPosts={posts.length}
                />
              )}

              {item.kind === "confidence" && (
                <ConfidenceCard
                  conceptTitle={getConceptTitle(item.quiz, posts)}
                  checkpointIndex={item.quizIndex}
                  onChoice={(result) =>
                    handleConfidence(item.quizIndex, item.quiz, index, result)
                  }
                />
              )}

              {item.kind === "quiz-question" && (
                <div
                  key={`qreset-${item.quizIndex}-${item.questionIndex}-${quizResetKeys[item.quizIndex] ?? 0}`}
                  className="h-full"
                >
                  <QuizCard
                    question={item.quiz.questions[item.questionIndex]}
                    questionIndex={item.questionIndex}
                    totalQuestions={item.quiz.questions.length}
                    checkpointIndex={item.quizIndex}
                    isActive={isActive}
                    onAnswer={(answer) =>
                      handleQuizAnswer(
                        item.quizIndex,
                        item.questionIndex,
                        answer
                      )
                    }
                    onNext={() => scrollToIndex(index + 1, "smooth")}
                  />
                </div>
              )}

              {item.kind === "results" &&
                (() => {
                  const answersMap = quizAnswersMap[item.quizIndex] ?? {};
                  const answers = Object.values(answersMap);
                  const confFeedIndex = feedItems.findIndex(
                    (fi) =>
                      fi.kind === "confidence" &&
                      fi.quizIndex === item.quizIndex
                  );
                  return (
                    <QuizResultsCard
                      checkpointIndex={item.quizIndex}
                      answers={answers}
                      confidence={confidenceResults[item.quizIndex] ?? null}
                      totalQuestions={item.quiz.questions.length}
                      isActive={isActive}
                      onContinue={() =>
                        handleResultsContinue(item.quizIndex, item.quiz, index)
                      }
                      onReview={() =>
                        handleResultsReview(item.quizIndex, confFeedIndex)
                      }
                    />
                  );
                })()}

              {item.kind === "completion" && (
                <CompletionScreen
                  course={course}
                  quizCount={quizzes.length}
                  avgScore={overallAccuracyPct / 100}
                  avgConfidencePct={overallConfidencePct}
                  avgAccuracyPct={overallAccuracyPct}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
