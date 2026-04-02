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
import { cn } from "@/lib/utils";

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

const confidenceMap: Record<
  ConfidenceResult,
  { label: string; pct: number; color: string }
> = {
  got_it: { label: "Got it ✅", pct: 100, color: "text-emerald-400" },
  show_again: { label: "Show again 🔄", pct: 50, color: "text-amber-400" },
  need_help: { label: "Need help 😅", pct: 20, color: "text-rose-400" },
};

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
      ? "text-emerald-400"
      : accuracyPct >= 60
        ? "text-amber-400"
        : "text-rose-400";
  const accuracyBarColor =
    accuracyPct >= 80
      ? "bg-emerald-500"
      : accuracyPct >= 60
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full px-4 pt-16 pb-6 justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={
          isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }
        }
        transition={{ duration: 0.35 }}
        className="space-y-5"
      >
        {/* Title */}
        <div className="text-center">
          <div className="text-xs text-indigo-400 font-medium tracking-wider uppercase mb-2">
            Checkpoint {checkpointIndex + 1} · Results
          </div>
          <h2 className="text-2xl font-bold text-white">
            {passed ? "Nice work! 🎉" : "Keep practising 💪"}
          </h2>
        </div>

        {/* Score comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={14} className="text-indigo-400" />
              <span className="text-xs text-white/50 font-medium">
                Self-rating
              </span>
            </div>
            <div
              className={cn(
                "text-2xl font-bold mb-0.5",
                confData?.color ?? "text-white/30"
              )}
            >
              {confidencePct}%
            </div>
            <div className="text-xs text-white/35">
              {confData?.label ?? "—"}
            </div>
            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={
                  isActive ? { width: `${confidencePct}%` } : { width: 0 }
                }
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-indigo-400" />
              <span className="text-xs text-white/50 font-medium">
                Accuracy
              </span>
            </div>
            <div className={cn("text-2xl font-bold mb-0.5", accuracyColor)}>
              {accuracyPct}%
            </div>
            <div className="text-xs text-white/35">
              {correct} / {totalQuestions} correct
            </div>
            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", accuracyBarColor)}
                initial={{ width: 0 }}
                animate={isActive ? { width: `${accuracyPct}%` } : { width: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Insight */}
        {confidence && (
          <div className="bg-white/4 border border-white/8 rounded-2xl px-4 py-3 text-sm text-white/55">
            {confidence === "got_it" && accuracyPct >= 60 && (
              <span className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400 shrink-0" />
                Your confidence matched your score — great self-awareness!
              </span>
            )}
            {confidence === "got_it" && accuracyPct < 60 && (
              <span>
                You felt confident but there are some gaps. A quick review will
                help it stick.
              </span>
            )}
            {confidence === "need_help" && accuracyPct >= 60 && (
              <span className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400 shrink-0" />
                You scored better than you expected! Keep going.
              </span>
            )}
            {confidence === "need_help" && accuracyPct < 60 && (
              <span>
                That&apos;s OK — reviewing this section will help it stick.
              </span>
            )}
            {confidence === "show_again" && (
              <span>Reviewing before the quiz was a smart move.</span>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {!passed && (
            <button
              onClick={onReview}
              className="flex items-center justify-center gap-2 py-3.5 bg-white/8 hover:bg-white/12 text-white border border-white/12 rounded-2xl font-medium transition-colors cursor-pointer text-sm"
            >
              <RotateCcw size={15} />
              Review this section
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-colors cursor-pointer"
          >
            Keep going
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
