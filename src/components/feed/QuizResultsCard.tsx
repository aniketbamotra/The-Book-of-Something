"use client";

import { motion } from "framer-motion";
import {
  Target,
  Brain,
  TrendingUp,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import type { ConfidenceResult } from "@/types";
import { colors } from "@/design-system/tokens";

interface Answer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

interface QuizResultsCardProps {
  checkpointIndex: number;
  answers: Answer[];
  confidence: ConfidenceResult | null;
  totalQuestions: number;
  isActive: boolean;
  onContinue: () => void;
  onReview: () => void;
}

// ─── Confidence display config ────────────────────────────────────────────────

const confidenceMap: Record<
  ConfidenceResult,
  { label: string; pct: number; color: string; barColor: string }
> = {
  got_it: {
    label: "I got this",
    pct: 100,
    color: colors.gotIt400,
    barColor: colors.gotIt500,
  },
  show_again: {
    label: "See it again",
    pct: 50,
    color: colors.showAgain400,
    barColor: colors.showAgain500,
  },
  need_help: {
    label: "Still fuzzy",
    pct: 20,
    color: colors.needHelp400,
    barColor: colors.needHelp500,
  },
};

// ─── Delta message ────────────────────────────────────────────────────────────

function getDeltaMessage(
  confidence: ConfidenceResult | null,
  accuracyPct: number
): { text: string; positive: boolean } | null {
  if (!confidence) return null;
  if (confidence === "got_it" && accuracyPct >= 60)
    return {
      text: "Your confidence matched your score — great self-awareness!",
      positive: true,
    };
  if (confidence === "got_it" && accuracyPct < 60)
    return {
      text: "You felt confident but there are some gaps. A quick review will help it stick.",
      positive: false,
    };
  if (confidence === "need_help" && accuracyPct >= 60)
    return {
      text: "You scored better than you expected! Trust yourself more.",
      positive: true,
    };
  if (confidence === "need_help" && accuracyPct < 60)
    return {
      text: "That's OK — reviewing this section will help it stick.",
      positive: false,
    };
  if (confidence === "show_again")
    return {
      text: "Reviewing before the quiz was a smart move.",
      positive: true,
    };
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QuizResultsCard({
  checkpointIndex,
  answers,
  confidence,
  totalQuestions,
  isActive,
  onContinue,
  onReview,
}: QuizResultsCardProps) {
  const correct = answers.filter((a) => a.correct).length;
  const accuracyPct =
    totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
  const confData = confidence ? confidenceMap[confidence] : null;
  const confidencePct = confData?.pct ?? 0;
  const passed = accuracyPct >= 60;

  const accuracyColor =
    accuracyPct >= 80
      ? colors.quizCorrect
      : accuracyPct >= 60
        ? colors.needHelp400
        : colors.quizIncorrect;

  const deltaMsg = getDeltaMessage(confidence, accuracyPct);

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full px-5 pt-16 pb-6 justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={
          isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }
        }
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-5"
      >
        {/* ── Title ──────────────────────────────────────────────────── */}
        <div className="text-center">
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: colors.primary400, letterSpacing: "0.08em" }}
          >
            Checkpoint {checkpointIndex + 1} · Results
          </div>
          <h2
            className="font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.4rem, 4vw, 1.875rem)",
              letterSpacing: "-0.02em",
              color: colors.textPrimary,
            }}
          >
            {passed ? "Nice work!" : "Keep practising"}
          </h2>
        </div>

        {/* ── Score cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Self-rating */}
          <div
            className="rounded-2xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: colors.borderDefault,
            }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Brain
                size={13}
                strokeWidth={2}
                style={{ color: colors.primary400 }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(250,250,250,0.45)" }}
              >
                You felt
              </span>
            </div>
            <div
              className="font-bold mb-0.5"
              style={{
                fontSize: "1.625rem",
                color: confData?.color ?? colors.textMuted,
              }}
            >
              {confidencePct}%
            </div>
            <div
              className="text-xs mb-3"
              style={{ color: "rgba(250,250,250,0.35)" }}
            >
              {confData?.label ?? "—"}
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: colors.borderSubtle }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={
                  isActive ? { width: `${confidencePct}%` } : { width: 0 }
                }
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                style={{
                  background: confData?.barColor ?? colors.borderDefault,
                }}
              />
            </div>
          </div>

          {/* Accuracy */}
          <div
            className="rounded-2xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: colors.borderDefault,
            }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Target
                size={13}
                strokeWidth={2}
                style={{ color: colors.primary400 }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(250,250,250,0.45)" }}
              >
                You scored
              </span>
            </div>
            <div
              className="font-bold mb-0.5"
              style={{ fontSize: "1.625rem", color: accuracyColor }}
            >
              {accuracyPct}%
            </div>
            <div
              className="text-xs mb-3"
              style={{ color: "rgba(250,250,250,0.35)" }}
            >
              {correct} / {totalQuestions} correct
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: colors.borderSubtle }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={isActive ? { width: `${accuracyPct}%` } : { width: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
                style={{ background: accuracyColor }}
              />
            </div>
          </div>
        </div>

        {/* ── Delta message ──────────────────────────────────────────── */}
        {deltaMsg && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.28 }}
            className="rounded-2xl px-4 py-3 border flex items-start gap-2.5"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: colors.borderSubtle,
            }}
          >
            {deltaMsg.positive && (
              <TrendingUp
                size={14}
                strokeWidth={2}
                style={{
                  color: colors.quizCorrect,
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
            )}
            <span
              style={{
                fontSize: "0.8125rem",
                color: colors.textMuted,
                lineHeight: "1.6",
              }}
            >
              {deltaMsg.text}
            </span>
          </motion.div>
        )}

        {/* ── CTAs ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2.5">
          {!passed && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onReview}
              className="flex items-center justify-center gap-2 rounded-2xl font-medium border cursor-pointer"
              style={{
                minHeight: "52px",
                background: "rgba(255,255,255,0.06)",
                borderColor: colors.borderDefault,
                color: colors.textSecondary,
                fontSize: "0.9375rem",
              }}
            >
              <RotateCcw size={15} strokeWidth={2} />
              Review this section
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="flex items-center justify-center gap-2 rounded-2xl font-semibold cursor-pointer border"
            style={{
              minHeight: "52px",
              background: colors.primary500,
              borderColor: colors.primary600,
              color: "#FAFAFA",
              fontSize: "0.9375rem",
              boxShadow: "0 0 20px rgba(99,102,241,0.22)",
            }}
          >
            Keep going
            <ChevronRight size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
