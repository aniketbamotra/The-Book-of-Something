"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BrainCircuit } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { cn } from "@/lib/utils";

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

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full px-4 pt-16 pb-6 justify-center">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-indigo-400 text-sm font-medium flex items-center gap-1.5">
          <BrainCircuit size={15} strokeWidth={2} />
          Quiz · {checkpointIndex + 1}
        </span>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/40 text-sm tabular-nums">
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < questionIndex
                ? "bg-indigo-500"
                : i === questionIndex
                  ? "bg-white/60"
                  : "bg-white/15"
            )}
          />
        ))}
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        <p className="text-white font-semibold text-lg leading-snug mb-5">
          {question.questionText}
        </p>

        <div className="space-y-2.5 mb-4">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correctIndex;
            let style =
              "bg-white/5 border-white/12 text-white/80 hover:bg-indigo-500/10 hover:border-indigo-500/30";
            if (isReviewing) {
              if (isCorrect)
                style = "bg-emerald-500/20 border-emerald-400 text-emerald-200";
              else if (isSelected)
                style = "bg-rose-500/20 border-rose-400 text-rose-200";
              else style = "bg-white/4 border-white/8 text-white/30";
            } else if (isSelected) {
              style = "bg-indigo-500/20 border-indigo-400 text-white";
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                animate={
                  isReviewing && isSelected && !isCorrect
                    ? { x: [0, -8, 8, -8, 8, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
                disabled={isReviewing}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-2xl border text-sm transition-all duration-200 cursor-pointer disabled:cursor-default",
                  style
                )}
              >
                <span className="font-mono text-xs mr-2.5 opacity-50">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isReviewing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl px-4 py-3 mb-4 text-white/70 text-sm overflow-hidden"
            >
              <span className="font-medium text-white/90">Explanation: </span>
              {question.explanation}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReviewing && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-colors cursor-pointer"
            >
              {questionIndex === totalQuestions - 1
                ? "See results"
                : "Next question"}
              <ChevronRight size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
