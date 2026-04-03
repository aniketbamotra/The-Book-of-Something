"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Share2,
  Brain,
  Target,
  Check,
  RotateCcw,
  Home,
} from "lucide-react";
import type { Course } from "@/types";
import { useConfetti } from "@/hooks/useConfetti";
import { colors, springs } from "@/design-system/tokens";

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const accuracyPct = avgAccuracyPct ?? Math.round(avgScore * 100);
  const confidencePct = avgConfidencePct ?? 0;

  const accuracyColor =
    accuracyPct >= 80
      ? colors.quizCorrect
      : accuracyPct >= 60
        ? colors.needHelp400
        : colors.quizIncorrect;

  const confidenceColor =
    confidencePct >= 80
      ? colors.gotIt400
      : confidencePct >= 50
        ? colors.needHelp400
        : colors.showAgain400;

  const accuracyBarColor =
    accuracyPct >= 80
      ? colors.quizCorrect
      : accuracyPct >= 60
        ? colors.needHelp500
        : colors.quizIncorrect;

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }

  async function handleShare() {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://the-book-of-something.vercel.app";
    const shareText = `I just learned ${course.title} in ${course.estimatedMinutes} mins on The Book of Something — Try it: ${siteUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "The Book of Something",
          text: shareText,
          url: siteUrl,
        });
      } catch {
        // User cancelled — no-op
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("Copied to clipboard!");
      } catch {
        showToast("Couldn't copy — try manually sharing the link.");
      }
    }
  }

  return (
    <div className="ds-completion-bg h-full flex items-center justify-center px-5 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springs.bouncy}
        className="max-w-md w-full text-center"
      >
        {/* ── Achievement icon ──────────────────────────────────────────── */}
        <motion.div
          className="flex justify-center mb-5"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...springs.bouncy, delay: 0.1 }}
        >
          <div className="relative">
            <div
              className="absolute inset-0 blur-2xl rounded-full"
              style={{ background: colors.achievementGlow }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center border"
              style={{
                background: colors.achievementBg,
                borderColor: "rgba(234,179,8,0.30)",
              }}
            >
              <Trophy
                size={36}
                strokeWidth={1.5}
                style={{ color: colors.achievement }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Headline ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.32 }}
        >
          <h1
            className="font-bold leading-tight mb-1"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 5vw, 2.25rem)",
              letterSpacing: "-0.025em",
              color: colors.textPrimary,
            }}
          >
            Course Complete!
          </h1>
          <p
            style={{
              color: colors.textMuted,
              fontSize: "0.9375rem",
              marginBottom: "1.5rem",
            }}
          >
            You finished{" "}
            <span style={{ color: colors.textPrimary, fontWeight: 600 }}>
              {course.title}
            </span>
          </p>
        </motion.div>

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          {/* Confidence */}
          <div
            className="rounded-2xl p-4 text-left border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: colors.borderDefault,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Brain
                size={13}
                strokeWidth={2}
                style={{ color: colors.primary400 }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: colors.textMuted }}
              >
                Confidence
              </span>
            </div>
            <div
              className="font-bold mb-2"
              style={{ fontSize: "1.625rem", color: confidenceColor }}
            >
              {confidencePct}%
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: colors.borderSubtle }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${confidencePct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                style={{ background: confidenceColor }}
              />
            </div>
          </div>

          {/* Accuracy */}
          <div
            className="rounded-2xl p-4 text-left border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: colors.borderDefault,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Target
                size={13}
                strokeWidth={2}
                style={{ color: colors.primary400 }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: colors.textMuted }}
              >
                Accuracy
              </span>
            </div>
            <div
              className="font-bold mb-2"
              style={{ fontSize: "1.625rem", color: accuracyColor }}
            >
              {accuracyPct}%
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: colors.borderSubtle }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${accuracyPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                style={{ background: accuracyBarColor }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Badge strip ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.28 }}
          className="rounded-2xl px-4 py-3 mb-6 flex items-center justify-between border"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: colors.borderSubtle,
          }}
        >
          <div className="text-left">
            <div
              className="text-xs mb-0.5"
              style={{ color: "rgba(250,250,250,0.30)" }}
            >
              Quizzes completed
            </div>
            <div
              className="font-bold"
              style={{ fontSize: "1.125rem", color: colors.textPrimary }}
            >
              {quizCount}
            </div>
          </div>
          <span style={{ fontSize: "2rem" }}>{course.emoji}</span>
        </motion.div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46, duration: 0.28 }}
          className="flex flex-col gap-2.5"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-2xl font-semibold cursor-pointer border"
            style={{
              minHeight: "52px",
              background: colors.achievement,
              borderColor: "rgba(234,179,8,0.50)",
              color: "#09090B",
              fontSize: "0.9375rem",
              boxShadow: "0 0 24px rgba(234,179,8,0.22)",
            }}
          >
            <Share2 size={16} strokeWidth={2.5} />
            Share your result
          </motion.button>

          <Link href="/" className="block">
            <motion.div
              whileTap={{ scale: 0.97 }}
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
              <Home size={16} strokeWidth={2} />
              Browse more courses
            </motion.div>
          </Link>

          <Link href={`/course/${course.id}`} className="block">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 rounded-2xl font-medium cursor-pointer border"
              style={{
                minHeight: "48px",
                background: "rgba(255,255,255,0.05)",
                borderColor: colors.borderDefault,
                color: colors.textSecondary,
                fontSize: "0.9375rem",
              }}
            >
              <RotateCcw size={15} strokeWidth={2} />
              Restart course
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Clipboard toast ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border"
            style={{
              background: colors.bgElevated,
              borderColor: colors.borderDefault,
              color: colors.textPrimary,
              boxShadow: "0 8px 32px rgba(0,0,0,0.50)",
              whiteSpace: "nowrap",
            }}
          >
            <Check size={14} style={{ color: colors.quizCorrect }} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
