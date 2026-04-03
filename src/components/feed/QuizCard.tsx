"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  BrainCircuit,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { QuizQuestion } from "@/types";
import { colors } from "@/design-system/tokens";

interface QuizCardProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  checkpointIndex: number;
  isActive: boolean;
  onAnswer: (answer: {
    questionId: string;
    selectedIndex: number;
    correct: boolean;
  }) => void;
  onNext: () => void;
}

export function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  checkpointIndex,
  isActive,
  onAnswer,
  onNext,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const isReviewing = selected !== null;

  function handleSelect(idx: number) {
    if (isReviewing) return;
    const correct = idx === question.correctIndex;
    setSelected(idx);
    onAnswer({ questionId: question.id, selectedIndex: idx, correct });
  }

  const isLastQuestion = questionIndex === totalQuestions - 1;

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full px-5 pt-16 pb-6 justify-center">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{
            color: colors.primary400,
            background: colors.primaryMuted,
            borderColor: colors.primaryBorder,
          }}
        >
          <BrainCircuit size={13} strokeWidth={2} />
          Quiz · {checkpointIndex + 1}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: colors.borderSubtle }}
        />
        <span
          className="text-xs tabular-nums font-medium px-2.5 py-1 rounded-full border"
          style={{
            color: "rgba(250,250,250,0.35)",
            background: "rgba(255,255,255,0.04)",
            borderColor: colors.borderSubtle,
          }}
        >
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{
              background:
                i < questionIndex
                  ? colors.primary500
                  : i === questionIndex
                    ? "rgba(250,250,250,0.55)"
                    : colors.borderSubtle,
            }}
          />
        ))}
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        {/* ── Question ─────────────────────────────────────────────────── */}
        <p
          className="font-semibold leading-snug mb-6"
          style={{
            fontSize: "clamp(1.05rem, 3.5vw, 1.25rem)",
            color: colors.textPrimary,
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.015em",
          }}
        >
          {question.questionText}
        </p>

        {/* ── Options ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2.5 mb-4">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correctIndex;

            let bgColor: string = "rgba(255,255,255,0.04)";
            let borderColor: string = colors.borderDefault;
            let textColor: string = colors.textSecondary;
            let statusIcon: React.ReactNode = null;

            if (isReviewing) {
              if (isCorrect) {
                bgColor = colors.quizCorrectBg;
                borderColor = colors.quizCorrect;
                textColor = colors.quizCorrect;
                statusIcon = (
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    style={{ color: colors.quizCorrect, flexShrink: 0 }}
                  />
                );
              } else if (isSelected) {
                bgColor = colors.quizIncorrectBg;
                borderColor = colors.quizIncorrect;
                textColor = colors.quizIncorrect;
                statusIcon = (
                  <XCircle
                    size={16}
                    strokeWidth={2}
                    style={{ color: colors.quizIncorrect, flexShrink: 0 }}
                  />
                );
              } else {
                bgColor = "rgba(255,255,255,0.02)";
                borderColor = "rgba(255,255,255,0.06)";
                textColor = "rgba(250,250,250,0.28)";
              }
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                animate={
                  isReviewing && isSelected && !isCorrect
                    ? { x: [0, -7, 7, -7, 7, 0] }
                    : {}
                }
                transition={{ duration: 0.38 }}
                whileTap={!isReviewing ? { scale: 0.98 } : {}}
                disabled={isReviewing}
                aria-label={`Option ${String.fromCharCode(65 + i)}: ${option}`}
                aria-pressed={isSelected}
                className="w-full text-left rounded-2xl border transition-colors duration-200 cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                style={{
                  minHeight: "56px",
                  padding: "14px 16px",
                  background: bgColor,
                  borderColor: borderColor,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  className="font-mono flex-shrink-0"
                  style={{
                    fontSize: "0.6875rem",
                    color: "rgba(250,250,250,0.35)",
                    minWidth: "16px",
                  }}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: textColor,
                    lineHeight: "1.45",
                    flex: 1,
                  }}
                >
                  {option}
                </span>
                {statusIcon}
              </motion.button>
            );
          })}
        </div>

        {/* ── Explanation ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isReviewing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden mb-4"
            >
              <div
                className="rounded-2xl px-4 py-3 border"
                style={{
                  background: colors.primaryMuted,
                  borderColor: colors.primaryBorder,
                }}
              >
                <span
                  className="font-semibold mr-1"
                  style={{ fontSize: "0.8125rem", color: colors.primary300 }}
                >
                  Explanation:
                </span>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: colors.textSecondary,
                    lineHeight: "1.6",
                  }}
                >
                  {question.explanation}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Next CTA ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isReviewing && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.22 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 rounded-2xl font-semibold cursor-pointer border"
              style={{
                minHeight: "52px",
                background: colors.primary500,
                borderColor: colors.primary600,
                color: "#FAFAFA",
                fontSize: "0.9375rem",
                boxShadow: "0 0 20px rgba(99,102,241,0.22)",
              }}
            >
              {isLastQuestion ? "See results" : "Next question"}
              <ChevronRight size={16} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
