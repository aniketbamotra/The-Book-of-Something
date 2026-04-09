"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, PenLine } from "lucide-react";
import type { FillBlankChallenge } from "@/types";
import { colors } from "@/design-system/tokens";

interface FillBlankCardProps {
  challenge: FillBlankChallenge;
  xpReward: number;
  isActive: boolean;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

/** Renders the prompt string, replacing each `___` with a highlighted placeholder. */
function PromptWithBlanks({ prompt }: { prompt: string }) {
  const segments = prompt.split("___");
  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {seg}
          {i < segments.length - 1 && (
            <span
              style={{
                color: colors.primary300,
                background: "rgba(99,102,241,0.15)",
                borderRadius: "3px",
                padding: "0 5px",
                border: "1px solid rgba(99,102,241,0.28)",
                fontStyle: "italic",
              }}
            >
              ___
            </span>
          )}
        </Fragment>
      ))}
    </>
  );
}

export function FillBlankCard({
  challenge,
  xpReward,
  isActive,
  onAnswer,
  onNext,
}: FillBlankCardProps) {
  const shouldReduce = useReducedMotion();
  const [answers, setAnswers] = useState<string[]>(() =>
    challenge.blanks.map(() => "")
  );
  const [submitted, setSubmitted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset when challenge changes (e.g. user scrolls back)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(challenge.blanks.map(() => ""));
    setSubmitted(false);
  }, [challenge]);

  // Auto-focus first input when card becomes active
  useEffect(() => {
    if (isActive && !submitted) {
      const timer = setTimeout(() => inputRefs.current[0]?.focus(), 320);
      return () => clearTimeout(timer);
    }
  }, [isActive, submitted]);

  const results: boolean[] = submitted
    ? challenge.blanks.map(
        (blank, i) =>
          (answers[i] ?? "").trim().toLowerCase() ===
          blank.answer.trim().toLowerCase()
      )
    : [];

  const allFilled = answers.every((a) => a.trim().length > 0);
  const allCorrect = submitted && results.every(Boolean);

  function handleSubmit() {
    if (!allFilled || submitted) return;
    const correct = challenge.blanks.every(
      (blank, i) =>
        (answers[i] ?? "").trim().toLowerCase() ===
        blank.answer.trim().toLowerCase()
    );
    setSubmitted(true);
    onAnswer(correct);
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (i < challenge.blanks.length - 1) {
        inputRefs.current[i + 1]?.focus();
      } else if (allFilled) {
        handleSubmit();
      }
    }
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
          <PenLine size={13} strokeWidth={2} />
          Fill in the blank
        </span>
        {submitted && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              color: allCorrect ? colors.quizCorrect : colors.quizIncorrect,
              background: allCorrect
                ? colors.quizCorrectBg
                : colors.quizIncorrectBg,
              borderColor: allCorrect
                ? colors.quizCorrectBorder
                : colors.quizIncorrectBorder,
            }}
          >
            {allCorrect ? `+${xpReward} XP` : "Try again next time"}
          </motion.span>
        )}
      </div>

      {/* ── Centered content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center min-h-0 gap-4">
        {/* Prompt label */}
        <p
          className="text-sm font-medium flex-shrink-0"
          style={{ color: colors.textMuted }}
        >
          Complete the code:
        </p>

        {/* Code block */}
        <pre
          className="rounded-xl p-4 flex-shrink-0 overflow-x-auto"
          style={{
            background: colors.codeBlockBg,
            fontSize: "0.875rem",
            lineHeight: "1.75",
            fontFamily: "var(--font-mono), monospace",
            border: `1px solid ${colors.codeBlockBorder}`,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <code style={{ color: colors.codeText }}>
            <PromptWithBlanks prompt={challenge.prompt} />
          </code>
        </pre>

        {/* Input fields */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          {challenge.blanks.map((blank, i) => (
            <div key={i}>
              {challenge.blanks.length > 1 && (
                <label
                  className="block text-xs font-medium mb-1.5"
                  htmlFor={`blank-input-${i}`}
                  style={{ color: colors.textMuted }}
                >
                  Blank {i + 1}
                </label>
              )}
              <div className="relative">
                <input
                  id={`blank-input-${i}`}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  value={answers[i] ?? ""}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  disabled={submitted}
                  placeholder="Type your answer…"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="w-full rounded-xl px-4 py-3 text-sm font-mono border outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-default"
                  style={{
                    background: submitted
                      ? results[i]
                        ? colors.quizCorrectBg
                        : colors.quizIncorrectBg
                      : colors.bgCard,
                    borderColor: submitted
                      ? results[i]
                        ? colors.quizCorrectBorder
                        : colors.quizIncorrectBorder
                      : colors.borderDefault,
                    color: submitted
                      ? results[i]
                        ? colors.quizCorrect
                        : colors.quizIncorrect
                      : colors.textPrimary,
                    paddingRight: submitted ? "2.5rem" : "1rem",
                  }}
                />
                {submitted && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {results[i] ? (
                      <CheckCircle2
                        size={16}
                        style={{ color: colors.quizCorrect }}
                      />
                    ) : (
                      <XCircle
                        size={16}
                        style={{ color: colors.quizIncorrect }}
                      />
                    )}
                  </div>
                )}
              </div>
              {submitted && !results[i] && (
                <p
                  className="mt-1.5 text-xs font-medium"
                  style={{ color: colors.quizCorrect }}
                >
                  Correct:{" "}
                  <span
                    className="font-mono"
                    style={{ color: colors.quizCorrect }}
                  >
                    {blank.answer}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit / feedback / next */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: allFilled ? 1 : 0.45 }}
              whileTap={allFilled ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              disabled={!allFilled}
              className="w-full flex items-center justify-center gap-2 rounded-2xl font-semibold border transition-shadow duration-200 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              style={{
                minHeight: "52px",
                background: colors.primary500,
                borderColor: colors.primary600,
                color: "#FAFAFA",
                fontSize: "0.9375rem",
                boxShadow: allFilled
                  ? "0 0 20px rgba(99,102,241,0.22)"
                  : "none",
                cursor: allFilled ? "pointer" : "not-allowed",
              }}
            >
              Check answer
              <ChevronRight size={16} strokeWidth={2.5} />
            </motion.button>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduce ? { duration: 0 } : { duration: 0.25 }}
              className="flex flex-col gap-3 flex-shrink-0"
            >
              {/* Explanation */}
              <div
                className="rounded-2xl px-4 py-3 border"
                style={{
                  background: allCorrect
                    ? colors.quizCorrectBg
                    : colors.quizIncorrectBg,
                  borderColor: allCorrect
                    ? colors.quizCorrectBorder
                    : colors.quizIncorrectBorder,
                }}
              >
                <p
                  className="font-semibold text-xs mb-1"
                  style={{
                    color: allCorrect
                      ? colors.quizCorrect
                      : colors.quizIncorrect,
                  }}
                >
                  {allCorrect ? "Correct!" : "Not quite —"}
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
