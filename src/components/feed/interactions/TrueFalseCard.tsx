"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, ToggleLeft } from "lucide-react";
import type { TrueFalseChallenge } from "@/types";
import { colors } from "@/design-system/tokens";

interface TrueFalseCardProps {
  challenge: TrueFalseChallenge;
  xpReward: number;
  isActive: boolean;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

type Selection = "true" | "false" | null;

export function TrueFalseCard({
  challenge,
  xpReward,
  isActive,
  onAnswer,
  onNext,
}: TrueFalseCardProps) {
  const shouldReduce = useReducedMotion();
  const [selected, setSelected] = useState<Selection>(null);
  const submitted = selected !== null;

  const isCorrect =
    selected === "true"
      ? challenge.isTrue
      : selected === "false"
        ? !challenge.isTrue
        : false;

  function handleSelect(choice: "true" | "false") {
    if (submitted) return;
    setSelected(choice);
    const correct = choice === "true" ? challenge.isTrue : !challenge.isTrue;
    onAnswer(correct);
  }

  function getButtonStyle(choice: "true" | "false") {
    const isSelected = selected === choice;
    const isThisCorrect =
      choice === "true" ? challenge.isTrue : !challenge.isTrue;

    if (!submitted) {
      return {
        background: colors.bgCard,
        borderColor: colors.borderDefault,
        color: colors.textPrimary,
        boxShadow: "none",
      };
    }
    if (isThisCorrect) {
      return {
        background: colors.quizCorrectBg,
        borderColor: colors.quizCorrectBorder,
        color: colors.quizCorrect,
        boxShadow: `0 0 16px ${colors.quizCorrectGlow}`,
      };
    }
    if (isSelected) {
      return {
        background: colors.quizIncorrectBg,
        borderColor: colors.quizIncorrectBorder,
        color: colors.quizIncorrect,
        boxShadow: "none",
      };
    }
    return {
      background: "rgba(0,0,0,0.02)",
      borderColor: colors.borderSubtle,
      color: colors.textSubtle,
      boxShadow: "none",
    };
  }

  function getStatusIcon(choice: "true" | "false") {
    if (!submitted) return null;
    const isSelected = selected === choice;
    const isThisCorrect =
      choice === "true" ? challenge.isTrue : !challenge.isTrue;
    if (isThisCorrect) {
      return (
        <CheckCircle2
          size={20}
          strokeWidth={2}
          style={{ color: colors.quizCorrect, flexShrink: 0 }}
        />
      );
    }
    if (isSelected) {
      return (
        <XCircle
          size={20}
          strokeWidth={2}
          style={{ color: colors.quizIncorrect, flexShrink: 0 }}
        />
      );
    }
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
      animate={
        isActive
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: shouldReduce ? 0 : 24 }
      }
      transition={
        shouldReduce
          ? { duration: 0 }
          : isActive
            ? { type: "spring", stiffness: 300, damping: 26, delay: 0.04 }
            : { duration: 0.18 }
      }
      className="h-full flex flex-col max-w-2xl mx-auto w-full px-5"
      style={{ paddingTop: "72px", paddingBottom: "24px" }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{
            color: colors.primary400,
            background: colors.primaryMuted,
            borderColor: colors.primaryBorder,
          }}
        >
          <ToggleLeft size={13} strokeWidth={2} />
          True or False?
        </span>
        {submitted && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              color: isCorrect ? colors.quizCorrect : colors.quizIncorrect,
              background: isCorrect
                ? colors.quizCorrectBg
                : colors.quizIncorrectBg,
              borderColor: isCorrect
                ? colors.quizCorrectBorder
                : colors.quizIncorrectBorder,
            }}
          >
            {isCorrect ? `+${xpReward} XP` : "Try again next time"}
          </motion.span>
        )}
      </div>

      {/* ── Centered content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center min-h-0 gap-6">
        {/* Statement */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={
            shouldReduce ? { duration: 0 } : { delay: 0.1, duration: 0.3 }
          }
          className="font-semibold leading-snug flex-shrink-0"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.1rem, 3.5vw, 1.375rem)",
            letterSpacing: "-0.015em",
            color: colors.textPrimary,
          }}
        >
          {challenge.statement}
        </motion.p>

        {/* True / False buttons */}
        <div className="flex gap-3 flex-shrink-0">
          {(["true", "false"] as const).map((choice) => {
            const btnStyle = getButtonStyle(choice);
            const icon = getStatusIcon(choice);
            const label = choice === "true" ? "True" : "False";

            return (
              <motion.button
                key={choice}
                onClick={() => handleSelect(choice)}
                animate={
                  submitted && selected === choice && !isCorrect
                    ? { x: [0, -6, 6, -6, 6, 0] }
                    : {}
                }
                transition={shouldReduce ? { duration: 0 } : { duration: 0.38 }}
                whileTap={!submitted ? { scale: 0.96 } : {}}
                disabled={submitted}
                aria-pressed={selected === choice}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl font-semibold border transition-colors duration-200 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                style={{
                  minHeight: "72px",
                  fontSize: "1rem",
                  cursor: submitted ? "default" : "pointer",
                  ...btnStyle,
                }}
              >
                {icon}
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation + Next */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={shouldReduce ? { duration: 0 } : { duration: 0.28 }}
              className="overflow-hidden flex flex-col gap-3 flex-shrink-0"
            >
              {/* Explanation */}
              <div
                className="rounded-2xl px-4 py-3 border"
                style={{
                  background: isCorrect
                    ? colors.quizCorrectBg
                    : colors.quizIncorrectBg,
                  borderColor: isCorrect
                    ? colors.quizCorrectBorder
                    : colors.quizIncorrectBorder,
                }}
              >
                <p
                  className="font-semibold text-xs mb-1"
                  style={{
                    color: isCorrect
                      ? colors.quizCorrect
                      : colors.quizIncorrect,
                  }}
                >
                  {isCorrect
                    ? "Correct!"
                    : `That's false — the correct answer is ${challenge.isTrue ? "True" : "False"}`}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: colors.textSecondary,
                    lineHeight: "1.6",
                  }}
                >
                  {challenge.explanation}
                </p>
              </div>

              {/* Next button */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldReduce
                    ? { duration: 0 }
                    : { delay: 0.1, duration: 0.22 }
                }
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
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
                Next
                <ChevronRight size={16} strokeWidth={2.5} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
