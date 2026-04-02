"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { DifficultyLevel } from "@/types";
import { getDifficultyLabel } from "@/lib/difficultyEngine";
import { colors } from "@/design-system/tokens";

interface FeedProgressHUDProps {
  current: number;
  total: number;
  difficulty: DifficultyLevel;
  courseTitle: string;
  onBack: () => void;
}

function getDiffTokens(diff: DifficultyLevel) {
  if (diff === "beginner")
    return {
      color: colors.diffBeginner,
      border: colors.diffBeginnerBorder,
      bg: colors.diffBeginnerBg,
    };
  if (diff === "intermediate")
    return {
      color: colors.diffIntermediate,
      border: colors.diffIntermediateBorder,
      bg: colors.diffIntermediateBg,
    };
  return {
    color: colors.diffAdvanced,
    border: colors.diffAdvancedBorder,
    bg: colors.diffAdvancedBg,
  };
}

export function FeedProgressHUD({
  current,
  total,
  difficulty,
  courseTitle: _courseTitle,
  onBack,
}: FeedProgressHUDProps) {
  const pct = Math.round((current / total) * 100);
  const diff = getDiffTokens(difficulty);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div style={{ height: "2px", background: colors.borderSubtle }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            height: "100%",
            background: colors.primary500,
            boxShadow: "0 0 8px rgba(99,102,241,0.55)",
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 pointer-events-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 transition-colors cursor-pointer"
          style={{ color: "rgba(250,250,250,0.40)", fontSize: "0.875rem" }}
          aria-label="Back to course"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back
        </button>

        <div className="flex items-center gap-2.5">
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize"
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
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="tabular-nums text-xs"
            style={{ color: "rgba(250,250,250,0.35)" }}
          >
            {current} / {total}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
