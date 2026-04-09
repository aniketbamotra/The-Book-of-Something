"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Target, ChevronRight, Flame } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { colors, springs } from "@/design-system/tokens";

interface SectionCompleteCardProps {
  section: number;
  totalSections: number;
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  combo: number;
  isActive: boolean;
  onContinue: () => void;
}

export function SectionCompleteCard({
  section,
  totalSections,
  xpEarned,
  correctCount,
  totalCount,
  combo,
  isActive,
  onContinue,
}: SectionCompleteCardProps) {
  const shouldReduce = useReducedMotion();
  const accuracyPct =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const accuracyColor =
    accuracyPct >= 80
      ? colors.quizCorrect
      : accuracyPct >= 60
        ? colors.needHelp400
        : colors.quizIncorrect;

  const isFinalSection = section === totalSections;

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.96 }}
      animate={
        isActive
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: shouldReduce ? 1 : 0.96 }
      }
      transition={shouldReduce ? { duration: 0 } : springs.bouncy}
      className="h-full flex flex-col items-center justify-center max-w-sm mx-auto w-full px-5 text-center"
      style={{ paddingTop: "72px", paddingBottom: "24px" }}
    >
      {/* ── Trophy icon ─────────────────────────────────────────────── */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{
          scale: shouldReduce ? 1 : 0,
          rotate: shouldReduce ? 0 : -12,
        }}
        animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0 }}
        transition={
          shouldReduce ? { duration: 0 } : { ...springs.bouncy, delay: 0.1 }
        }
      >
        <div className="relative">
          <div
            className="absolute inset-0 blur-2xl rounded-full"
            style={{ background: colors.achievementGlow }}
          />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center border"
            style={{
              background: colors.achievementBg,
              borderColor: "rgba(217,119,6,0.28)",
            }}
          >
            <Trophy
              size={28}
              strokeWidth={1.5}
              style={{ color: colors.achievement }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Headline ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={
          shouldReduce ? { duration: 0 } : { delay: 0.18, duration: 0.3 }
        }
        className="mb-6"
      >
        <h2
          className="font-bold leading-tight mb-1.5"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            letterSpacing: "-0.025em",
            color: colors.textPrimary,
          }}
        >
          Section {section} complete!
        </h2>
        <p style={{ color: colors.textMuted, fontSize: "0.9375rem" }}>
          {isFinalSection
            ? "Last section done — finish strong."
            : `${totalSections - section} section${totalSections - section > 1 ? "s" : ""} to go.`}
        </p>
      </motion.div>

      {/* ── Stat pills ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={
          shouldReduce ? { duration: 0 } : { delay: 0.28, duration: 0.28 }
        }
        className="flex gap-3 mb-8 w-full"
      >
        {/* XP earned */}
        <div
          className="flex-1 flex flex-col items-center gap-1 rounded-2xl p-4 border"
          style={{
            background: colors.achievementBg,
            borderColor: "rgba(217,119,6,0.22)",
          }}
        >
          <Zap
            size={16}
            strokeWidth={2}
            style={{ color: colors.achievement }}
          />
          <span
            className="font-bold tabular-nums"
            style={{ fontSize: "1.375rem", color: colors.achievement }}
          >
            +{xpEarned}
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: colors.textMuted }}
          >
            XP earned
          </span>
        </div>

        {/* Accuracy */}
        <div
          className="flex-1 flex flex-col items-center gap-1 rounded-2xl p-4 border"
          style={{
            background: colors.bgSurface,
            borderColor: colors.borderDefault,
          }}
        >
          <Target size={16} strokeWidth={2} style={{ color: accuracyColor }} />
          <span
            className="font-bold tabular-nums"
            style={{ fontSize: "1.375rem", color: accuracyColor }}
          >
            {accuracyPct}%
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: colors.textMuted }}
          >
            Accuracy
          </span>
        </div>

        {/* Combo (only shown when meaningful) */}
        {combo >= 2 && (
          <div
            className="flex-1 flex flex-col items-center gap-1 rounded-2xl p-4 border"
            style={{
              background: "rgba(99,102,241,0.06)",
              borderColor: colors.primaryBorder,
            }}
          >
            <Flame
              size={16}
              strokeWidth={2}
              style={{ color: colors.primary400 }}
            />
            <span
              className="font-bold tabular-nums"
              style={{ fontSize: "1.375rem", color: colors.primary500 }}
            >
              {combo}x
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: colors.textMuted }}
            >
              Combo
            </span>
          </div>
        )}
      </motion.div>

      {/* ── Continue button ──────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={
          shouldReduce ? { duration: 0 } : { delay: 0.36, duration: 0.26 }
        }
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 rounded-2xl font-semibold cursor-pointer border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        style={{
          minHeight: "52px",
          background: colors.primary500,
          borderColor: colors.primary600,
          color: "#FAFAFA",
          fontSize: "0.9375rem",
          boxShadow: "0 0 20px rgba(99,102,241,0.22)",
        }}
      >
        {isFinalSection ? "Final stretch" : "Keep going"}
        <ChevronRight size={16} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}
