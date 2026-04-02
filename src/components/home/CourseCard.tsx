"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import type { Course, CourseProgress } from "@/types";
import { fadeUp } from "@/lib/animations";
import { getDifficultyLabel } from "@/lib/difficultyEngine";
import { colors } from "@/design-system/tokens";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress | null;
  totalPosts?: number;
}

function getDiffTokens(diff: string) {
  if (diff === "beginner")
    return {
      color: colors.diffBeginner,
      bg: colors.diffBeginnerBg,
      border: colors.diffBeginnerBorder,
    };
  if (diff === "intermediate")
    return {
      color: colors.diffIntermediate,
      bg: colors.diffIntermediateBg,
      border: colors.diffIntermediateBorder,
    };
  return {
    color: colors.diffAdvanced,
    bg: colors.diffAdvancedBg,
    border: colors.diffAdvancedBorder,
  };
}

export function CourseCard({
  course,
  progress,
  totalPosts = 0,
}: CourseCardProps) {
  const completedCount = progress?.completedPostIds.length ?? 0;
  const total = totalPosts > 0 ? totalPosts : 1;
  const progressPct = progress
    ? Math.min(100, Math.round((completedCount / total) * 100))
    : 0;
  const diff = getDiffTokens(course.difficulty);
  const isCompleted = !!progress?.completedAt;
  const isInProgress = progress && !isCompleted && completedCount > 0;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/course/${course.id}`}
        className="block group cursor-pointer"
      >
        <div
          className="rounded-2xl overflow-hidden border transition-colors duration-300"
          style={{
            background: colors.bgCard,
            borderColor: colors.borderSubtle,
          }}
        >
          {/* ── Cover gradient ──────────────────────────────────────── */}
          <div
            className={`h-28 bg-gradient-to-br ${course.coverGradient} flex items-center justify-center`}
          >
            <span className="text-5xl" role="img" aria-label={course.title}>
              {course.emoji}
            </span>
          </div>

          {/* ── Body ───────────────────────────────────────────────── */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className="font-semibold leading-tight"
                style={{ fontSize: "1.0625rem", color: colors.textPrimary }}
              >
                {course.title}
              </h3>
              <span
                className="flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize"
                style={{
                  color: diff.color,
                  background: diff.bg,
                  borderColor: diff.border,
                }}
              >
                {getDifficultyLabel(course.difficulty)}
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-4 line-clamp-2"
              style={{ color: colors.textMuted }}
            >
              {course.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    color: "rgba(250,250,250,0.40)",
                    background: "rgba(255,255,255,0.04)",
                    borderColor: colors.borderSubtle,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              className="flex items-center justify-between text-xs"
              style={{ color: "rgba(250,250,250,0.35)" }}
            >
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2} />
                {course.estimatedMinutes} min
              </span>
              <span>{course.category}</span>
            </div>

            {/* ── In-progress bar ─────────────────────────────────── */}
            {isInProgress && (
              <div className="mt-4">
                <div
                  className="flex justify-between text-xs mb-1.5"
                  style={{ color: "rgba(250,250,250,0.35)" }}
                >
                  <span>In progress</span>
                  <span>
                    {completedCount}/{totalPosts > 0 ? totalPosts : "?"} lessons
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: colors.borderSubtle }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ background: colors.primary500 }}
                  />
                </div>
              </div>
            )}

            {/* ── Completed badge ─────────────────────────────────── */}
            {isCompleted && (
              <div
                className="mt-4 flex items-center gap-1 text-xs font-medium"
                style={{ color: colors.gotIt400 }}
              >
                <CheckCircle2 size={12} strokeWidth={2.5} />
                Completed
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
