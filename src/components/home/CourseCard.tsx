"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Course, CourseProgress } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { fadeUp } from "@/lib/animations";
import { getDifficultyLabel } from "@/lib/difficultyEngine";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress | null;
  totalPosts?: number;
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

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.22 }}
    >
      <Link
        href={`/course/${course.id}`}
        className="block group cursor-pointer"
      >
        <div className="relative bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:bg-white/6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-950/50">
          {/* gradient header */}
          <div
            className={`h-28 bg-gradient-to-br ${course.coverGradient} flex items-center justify-center`}
          >
            <span className="text-5xl" role="img" aria-label={course.title}>
              {course.emoji}
            </span>
          </div>

          {/* body */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white text-lg leading-tight">
                {course.title}
              </h3>
              <Badge
                variant={
                  course.difficulty as "beginner" | "intermediate" | "advanced"
                }
              >
                {getDifficultyLabel(course.difficulty)}
              </Badge>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2} />
                {course.estimatedMinutes} min
              </span>
              <span className="text-white/30">{course.category}</span>
            </div>

            {/* in-progress bar with card count */}
            {progress && !progress.completedAt && completedCount > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>In progress</span>
                  <span>
                    {completedCount}/{totalPosts > 0 ? totalPosts : "?"} lessons
                  </span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {progress?.completedAt && (
              <div className="mt-4 text-xs text-emerald-400 font-medium flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
