"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
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
      whileHover={{
        y: -4,
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(99,102,241,0.18)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/course/${course.id}`} className="block cursor-pointer">
        <div
          className="rounded-2xl overflow-hidden transition-colors duration-200"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Cover */}
          <div
            className={`h-32 bg-gradient-to-br ${course.coverGradient} flex items-center justify-center relative`}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-3xl" role="img" aria-label={course.title}>
                {course.emoji}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className="font-semibold leading-tight"
                style={{ fontSize: "1rem", color: colors.textPrimary }}
              >
                {course.title}
              </h3>
              <span
                className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border capitalize"
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

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    color: "#374151",
                    background: "#F3F4F6",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta row */}
            <div
              className="flex items-center justify-between text-xs"
              style={{ color: colors.textMuted }}
            >
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2} />
                {course.estimatedMinutes} min
              </span>
              <span
                className="flex items-center gap-1 font-medium"
                style={{ color: "#9CA3AF" }}
              >
                View course
                <ArrowRight size={12} strokeWidth={2.5} />
              </span>
            </div>

            {/* Progress bar */}
            {isInProgress && (
              <div className="mt-4">
                <div
                  className="flex justify-between text-xs mb-1.5"
                  style={{ color: "#9CA3AF" }}
                >
                  <span>In progress</span>
                  <span>
                    {completedCount}/{totalPosts > 0 ? totalPosts : "?"} lessons
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#E5E7EB" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ background: "#6366F1" }}
                  />
                </div>
              </div>
            )}

            {isCompleted && (
              <div
                className="mt-4 flex items-center gap-1 text-xs font-medium"
                style={{ color: colors.gotIt500 }}
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
