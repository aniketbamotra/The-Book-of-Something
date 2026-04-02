"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trophy, Share2, Brain, Target, Check } from "lucide-react";
import type { Course } from "@/types";
import { Button } from "@/components/ui/Button";
import { useConfetti } from "@/hooks/useConfetti";
import { cn } from "@/lib/utils";

interface CompletionScreenProps {
  course: Course;
  quizCount: number;
  avgScore: number;
  avgConfidencePct?: number;
  avgAccuracyPct?: number;
}

export function CompletionScreen({
  course,
  quizCount,
  avgScore,
  avgConfidencePct,
  avgAccuracyPct,
}: CompletionScreenProps) {
  const { triggerConfetti } = useConfetti();
  const [toastVisible, setToastVisible] = useState(false);

  const accuracyPct = avgAccuracyPct ?? Math.round(avgScore * 100);
  const confidencePct = avgConfidencePct ?? 0;

  const accuracyColor =
    accuracyPct >= 80
      ? "text-emerald-400"
      : accuracyPct >= 60
        ? "text-amber-400"
        : "text-rose-400";

  const confidenceColor =
    confidencePct >= 80
      ? "text-emerald-400"
      : confidencePct >= 50
        ? "text-amber-400"
        : "text-rose-400";

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  async function handleShare() {
    const shareText = `I just learned ${course.title} in ${course.estimatedMinutes} mins on The Book of Something 🧠 Try it: https://the-book-of-something.vercel.app`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "The Book of Something",
          text: shareText,
          url: "https://the-book-of-something.vercel.app",
        });
      } catch {
        // User cancelled or error — no-op
      }
    } else {
      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(shareText);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
      } catch {}
    }
  }

  return (
    <div className="h-full flex items-center justify-center px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="max-w-md w-full text-center"
      >
        {/* Trophy */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
            <Trophy
              size={68}
              className="text-yellow-400 relative"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">Course Complete!</h1>
        <p className="text-white/50 mb-6">
          You finished{" "}
          <span className="text-white font-medium">{course.title}</span>
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={13} className="text-indigo-400" />
              <span className="text-xs text-white/40 font-medium">
                Confidence
              </span>
            </div>
            <div className={cn("text-2xl font-bold", confidenceColor)}>
              {confidencePct}%
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${confidencePct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Target size={13} className="text-indigo-400" />
              <span className="text-xs text-white/40 font-medium">
                Accuracy
              </span>
            </div>
            <div className={cn("text-2xl font-bold", accuracyColor)}>
              {accuracyPct}%
            </div>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  accuracyPct >= 80
                    ? "bg-emerald-500"
                    : accuracyPct >= 60
                      ? "bg-amber-500"
                      : "bg-rose-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${accuracyPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="bg-white/4 border border-white/8 rounded-2xl px-4 py-3 mb-6 flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs text-white/30 mb-0.5">
              Quizzes completed
            </div>
            <div className="text-lg font-bold text-white">{quizCount}</div>
          </div>
          <div className="text-3xl">{course.emoji}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-colors cursor-pointer"
          >
            <Share2 size={16} />
            Share your result
          </button>

          <Link href="/">
            <Button variant="primary" className="w-full" size="lg">
              Browse More Courses
            </Button>
          </Link>

          <Link href={`/course/${course.id}`}>
            <Button variant="secondary" className="w-full">
              Restart Course
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Clipboard toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-800 border border-white/10 text-white text-sm px-4 py-2.5 rounded-full shadow-lg"
          >
            <Check size={14} className="text-emerald-400" />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
