"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { CourseData, DifficultyLevel, LessonPost } from "@/types";
import { PostCard } from "@/components/feed/PostCard";
import { FillBlankCard } from "@/components/feed/interactions/FillBlankCard";
import { TrueFalseCard } from "@/components/feed/interactions/TrueFalseCard";
import { SectionCompleteCard } from "@/components/feed/SectionCompleteCard";
import { CompletionScreen } from "@/components/feed/CompletionScreen";
import { FeedProgressHUD } from "@/components/feed/FeedProgressHUD";
import { useUserProgress } from "@/hooks/useUserProgress";
import { adjustDifficulty } from "@/lib/difficultyEngine";

// ─── Feed item types ──────────────────────────────────────────────────────────

type PostItem = { kind: "post"; post: LessonPost; postIndex: number };
type InteractionItem = {
  kind: "interaction";
  post: LessonPost;
  postIndex: number;
};
type SectionCompleteItem = { kind: "section-complete"; section: number };
type CompletionItem = { kind: "completion" };

type FeedItem =
  | PostItem
  | InteractionItem
  | SectionCompleteItem
  | CompletionItem;

// ─── Build feed ───────────────────────────────────────────────────────────────

function buildFeedItems(posts: LessonPost[]): FeedItem[] {
  const items: FeedItem[] = [];

  posts.forEach((post, postIndex) => {
    items.push({ kind: "post", post, postIndex });

    // Insert interaction card only when challenge data is present
    if (post.challenge) {
      items.push({ kind: "interaction", post, postIndex });
    }

    // Insert section-complete card at the boundary between sections
    const nextPost = posts[postIndex + 1];
    if (
      post.section != null &&
      (nextPost == null || nextPost.section !== post.section)
    ) {
      items.push({ kind: "section-complete", section: post.section });
    }
  });

  items.push({ kind: "completion" });
  return items;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

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

// ─── XP helpers ───────────────────────────────────────────────────────────────

const DEFAULT_XP: Record<string, number> = {
  "fill-blank": 20,
  "true-false": 10,
  "spot-bug": 20,
  predict: 25,
  order: 20,
};

function comboMultiplier(combo: number): number {
  if (combo >= 5) return 2;
  if (combo >= 3) return 1.5;
  return 1;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FeedContainerProps {
  data: CourseData;
}

export function FeedContainer({ data }: FeedContainerProps) {
  const { course, posts } = data;
  const router = useRouter();
  const shouldReduce = useReducedMotion();

  const feedItems = useMemo(() => buildFeedItems(posts), [posts]);

  const { progress, updatePost, markComplete, addXP, updateDifficulty } =
    useUserProgress(course.id, course.difficulty);

  // ── Core scroll state ──────────────────────────────────────────────────────
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  // ── Adaptive difficulty state ──────────────────────────────────────────────
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    course.difficulty
  );
  const [holdCount, setHoldCount] = useState(0);

  // ── XP + combo state ───────────────────────────────────────────────────────
  const [combo, setCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  // XP earned per section number (for SectionCompleteCard display)
  const [sectionXP, setSectionXP] = useState<Record<number, number>>({});
  // Correct/total answers per section (for difficulty adjustment)
  const [sectionAnswers, setSectionAnswers] = useState<
    Record<number, { correct: number; total: number }>
  >({});

  // ── Refs ───────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const totalSections = useMemo(() => {
    const sections = posts
      .map((p) => p.section)
      .filter((s): s is number => s != null);
    return sections.length > 0 ? Math.max(...sections) : 0;
  }, [posts]);

  const currentPostNumber = useMemo(() => {
    let count = 0;
    for (let i = 0; i <= activeFeedIndex; i++) {
      if (feedItems[i]?.kind === "post") count++;
    }
    return count;
  }, [activeFeedIndex, feedItems]);

  const overallAccuracyPct = useMemo(() => {
    const allSections = Object.values(sectionAnswers);
    const totalCorrect = allSections.reduce((s, a) => s + a.correct, 0);
    const totalAnswered = allSections.reduce((s, a) => s + a.total, 0);
    return totalAnswered > 0
      ? Math.round((totalCorrect / totalAnswered) * 100)
      : 0;
  }, [sectionAnswers]);

  // ── Sync saved progress on first load ─────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (progress?.currentDifficulty) setDifficulty(progress.currentDifficulty);
    if (progress?.consecutiveHoldCount != null)
      setHoldCount(progress.consecutiveHoldCount);
    if (progress?.xp != null) setTotalXP(progress.xp);
  }, [progress]);

  // ── Scroll helpers ─────────────────────────────────────────────────────────
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const card = cardRefs.current[index];
      if (card)
        card.scrollIntoView({
          behavior: shouldReduce ? "instant" : behavior,
        });
    },
    [shouldReduce]
  );

  // ── Intersection observer — tracks active snap card ───────────────────────
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

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (activeFeedIndex < feedItems.length - 1)
          scrollToIndex(activeFeedIndex + 1, "smooth");
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (activeFeedIndex > 0) scrollToIndex(activeFeedIndex - 1, "smooth");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeFeedIndex, feedItems.length, scrollToIndex]);

  // ── Restore scroll position on mount ──────────────────────────────────────
  useEffect(() => {
    const saved = loadFeedIndex(course.id);
    if (saved > 0 && saved < feedItems.length) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToIndex(saved, "instant"));
      });
    }
  }, [course.id, feedItems.length, scrollToIndex]);

  // ── Event handlers ─────────────────────────────────────────────────────────

  const handleInteractionAnswer = useCallback(
    (post: LessonPost, correct: boolean) => {
      const base =
        post.xpReward ?? DEFAULT_XP[post.interactionType ?? "fill-blank"] ?? 20;

      const newCombo = correct ? combo + 1 : 0;
      const earned = correct ? Math.round(base * comboMultiplier(newCombo)) : 0;

      setCombo(newCombo);

      if (post.section != null) {
        setSectionAnswers((prev) => ({
          ...prev,
          [post.section!]: {
            correct: (prev[post.section!]?.correct ?? 0) + (correct ? 1 : 0),
            total: (prev[post.section!]?.total ?? 0) + 1,
          },
        }));
      }

      if (earned > 0) {
        const newTotal = addXP(earned);
        setTotalXP(newTotal);
        if (post.section != null) {
          setSectionXP((prev) => ({
            ...prev,
            [post.section!]: (prev[post.section!] ?? 0) + earned,
          }));
        }
      }
    },
    [combo, addXP]
  );

  const handleSectionContinue = useCallback(
    (section: number, itemIndex: number) => {
      const answers = sectionAnswers[section];
      if (answers && answers.total > 0) {
        const score = answers.correct / answers.total;
        const { difficulty: newDiff, consecutiveHoldCount: newHold } =
          adjustDifficulty(difficulty, score, holdCount);
        setDifficulty(newDiff);
        setHoldCount(newHold);
        updateDifficulty(newDiff, newHold);
      }
      scrollToIndex(itemIndex + 1, "smooth");
    },
    [sectionAnswers, difficulty, holdCount, updateDifficulty, scrollToIndex]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="relative"
      style={{ height: "100dvh", background: "#FFF9F5" }}
    >
      <FeedProgressHUD
        current={currentPostNumber}
        total={posts.length}
        difficulty={difficulty}
        courseTitle={course.title}
        combo={combo}
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

              {item.kind === "interaction" &&
                (() => {
                  const { post } = item;
                  const { challenge } = post;
                  if (!challenge) return null;

                  const xpReward =
                    post.xpReward ??
                    DEFAULT_XP[post.interactionType ?? "fill-blank"] ??
                    20;

                  if (challenge.type === "fill-blank") {
                    return (
                      <FillBlankCard
                        key={`fb-${post.id}`}
                        challenge={challenge}
                        xpReward={xpReward}
                        isActive={isActive}
                        onAnswer={(correct) =>
                          handleInteractionAnswer(post, correct)
                        }
                        onNext={() => scrollToIndex(index + 1, "smooth")}
                      />
                    );
                  }

                  if (challenge.type === "true-false") {
                    return (
                      <TrueFalseCard
                        key={`tf-${post.id}`}
                        challenge={challenge}
                        xpReward={xpReward}
                        isActive={isActive}
                        onAnswer={(correct) =>
                          handleInteractionAnswer(post, correct)
                        }
                        onNext={() => scrollToIndex(index + 1, "smooth")}
                      />
                    );
                  }

                  return null;
                })()}

              {item.kind === "section-complete" && (
                <SectionCompleteCard
                  section={item.section}
                  totalSections={totalSections}
                  xpEarned={sectionXP[item.section] ?? 0}
                  correctCount={sectionAnswers[item.section]?.correct ?? 0}
                  totalCount={sectionAnswers[item.section]?.total ?? 0}
                  combo={combo}
                  isActive={isActive}
                  onContinue={() => handleSectionContinue(item.section, index)}
                />
              )}

              {item.kind === "completion" && (
                <CompletionScreen
                  course={course}
                  totalXP={totalXP}
                  interactionCount={
                    feedItems.filter((fi) => fi.kind === "interaction").length
                  }
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
