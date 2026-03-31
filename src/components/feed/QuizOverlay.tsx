'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, Trophy, ThumbsUp, BookMarked } from 'lucide-react'
import type { QuizQuestion } from '@/types'
import { Button } from '@/components/ui/Button'
import { scaleIn } from '@/constants/animations'
import { cn } from '@/lib/utils'

interface QuizOverlayProps {
  question: QuizQuestion | null
  questionIndex: number
  totalQuestions: number
  selectedOption: number | null
  isReviewing: boolean
  isComplete: boolean
  score?: number
  difficultyChanged?: boolean
  newDifficulty?: string
  onSelect: (index: number) => void
  onNext: () => void
  onFinish: () => void
}

export function QuizOverlay({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  isReviewing,
  isComplete,
  score = 0,
  difficultyChanged,
  newDifficulty,
  onSelect,
  onNext,
  onFinish,
}: QuizOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden glow-indigo"
      >
        {isComplete ? (
          <CompletionView
            score={score}
            totalQuestions={totalQuestions}
            difficultyChanged={difficultyChanged}
            newDifficulty={newDifficulty}
            onFinish={onFinish}
          />
        ) : (
          <QuestionView
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            isReviewing={isReviewing}
            onSelect={onSelect}
            onNext={onNext}
          />
        )}
      </motion.div>
    </div>
  )
}

function QuestionView({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  isReviewing,
  onSelect,
  onNext,
}: Omit<QuizOverlayProps, 'isComplete' | 'score' | 'difficultyChanged' | 'newDifficulty' | 'onFinish'>) {
  if (!question) return null

  return (
    <div className="p-6">
      {/* header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-indigo-400 text-sm font-medium flex items-center gap-1.5">
          <BrainCircuit size={15} strokeWidth={2} />
          Quick Check
        </span>
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/40 text-sm">
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* progress dots */}
      <div className="flex gap-1.5 mb-5">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i < questionIndex ? 'bg-indigo-500' : i === questionIndex ? 'bg-white/60' : 'bg-white/15'
            )}
          />
        ))}
      </div>

      {/* question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-white font-medium text-lg leading-snug mb-5">{question.questionText}</p>

          <div className="space-y-2.5 mb-5">
            {question.options.map((option, i) => {
              const isSelected = selectedOption === i
              const isCorrect = i === question.correctIndex
              let style = 'bg-white/5 border-white/15 text-white/80 hover:bg-indigo-500/10 hover:border-indigo-500/30'
              if (isReviewing) {
                if (isCorrect) style = 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                else if (isSelected && !isCorrect) style = 'bg-rose-500/20 border-rose-400 text-rose-300'
                else style = 'bg-white/5 border-white/10 text-white/40'
              } else if (isSelected) {
                style = 'bg-indigo-500/20 border-indigo-400 text-white'
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => !isReviewing && onSelect(i)}
                  animate={
                    isReviewing && isSelected && !isCorrect
                      ? { x: [0, -6, 6, -6, 6, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer',
                    style,
                    !isReviewing && 'cursor-pointer'
                  )}
                  disabled={isReviewing}
                >
                  <span className="font-mono text-xs mr-2.5 opacity-50">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </motion.button>
              )
            })}
          </div>

          {/* explanation */}
          <AnimatePresence>
            {isReviewing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-3 mb-4 text-white/70 text-sm"
              >
                <span className="font-medium text-white/90">Explanation: </span>
                {question.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {isReviewing && (
            <Button variant="primary" className="w-full" onClick={onNext}>
              Next →
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CompletionView({
  score,
  totalQuestions,
  difficultyChanged,
  newDifficulty,
  onFinish,
}: {
  score: number
  totalQuestions: number
  difficultyChanged?: boolean
  newDifficulty?: string
  onFinish: () => void
}) {
  const correct = Math.round(score * totalQuestions)
  const pct = Math.round(score * 100)

  const result =
    pct >= 80
      ? { icon: <Trophy size={48} className="text-yellow-400" />, message: 'Great work!' }
      : pct >= 50
      ? { icon: <ThumbsUp size={48} className="text-indigo-400" />, message: 'Solid effort!' }
      : { icon: <BookMarked size={48} className="text-white/50" />, message: 'Keep going, you got this!' }

  return (
    <div className="p-8 text-center">
      <div className="flex justify-center mb-4">{result.icon}</div>
      <h3 className="text-2xl font-bold text-white mb-1">{result.message}</h3>
      <p className="text-white/50 text-sm mb-6">
        You got {correct} out of {totalQuestions} correct ({pct}%)
      </p>

      {/* score bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          className={cn(
            'h-full rounded-full',
            pct >= 80 ? 'bg-emerald-400' : pct >= 50 ? 'bg-indigo-500' : 'bg-rose-400'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      {difficultyChanged && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mb-6 text-sm"
        >
          <span className="text-white/60">Difficulty adjusted to </span>
          <span className="text-indigo-300 font-semibold capitalize">{newDifficulty}</span>
        </motion.div>
      )}

      <Button variant="primary" className="w-full" onClick={onFinish}>
        Continue Learning →
      </Button>
    </div>
  )
}
