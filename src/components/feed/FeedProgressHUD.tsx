"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Flame } from "lucide-react";
import type { DifficultyLevel } from "@/types";
import { getDifficultyLabel, getDiffTokens } from "@/lib/difficultyEngine";
import { colors } from "@/design-system/tokens";

interface FeedProgressHUDProps {
  current: number;
  total: number;
  difficulty: DifficultyLevel;
  courseTitle: string;
  combo: number;
  onBack: () => void;
}

export function FeedProgressHUD({
  current,
  total,
  difficulty,
  courseTitle,
  combo,
  onBack,
}: FeedProgressHUDProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const diff = getDiffTokens(difficulty);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{
        background: "rgba(255,249,245,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #EDE5DE",
      }}
    >
      {/* Progress bar */}
      <div className="relative h-0.5" style={{ background: "#EDE5DE" }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            background: "#6366F1",
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 pointer-events-auto gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 transition-colors cursor-pointer flex-shrink-0"
          style={{ color: "#374151", background: "rgba(0,0,0,0.04)" }}
          aria-label="Back to course"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back
        </button>

        <span
          className="text-xs font-medium truncate flex-1 text-center"
          style={{ color: "#6B7280" }}
        >
          {courseTitle}
        </span>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          {combo >= 2 && (
            <motion.div
              key={combo}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full border"
              style={{
                background: colors.achievementBg,
                borderColor: "rgba(217,119,6,0.28)",
              }}
            >
              <Flame
                size={11}
                strokeWidth={2.5}
                style={{ color: colors.achievement }}
              />
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: colors.achievement }}
              >
                {combo}x
              </span>
            </motion.div>
          )}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border capitalize"
            style={{
              color: diff.color,
              background: diff.bg,
              borderColor: diff.border,
            }}
          >
            {getDifficultyLabel(difficulty)}
          </span>
          <motion.span
            key={current}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tabular-nums font-medium"
            style={{ color: "#9CA3AF" }}
          >
            {current} / {total}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
