'use client'

import { useState, useCallback } from 'react'
import type { Quiz, QuizQuestion, DifficultyLevel, QuizAttempt } from '@/types'
import { adjustDifficulty } from '@/lib/difficultyEngine'

type QuizState = 'inactive' | 'active' | 'reviewing' | 'complete'

interface Answer {
  questionId: string
  selectedIndex: number
  correct: boolean
}

export function useQuizEngine(
  quizzes: Quiz[],
  initialDifficulty: DifficultyLevel,
  consecutiveHoldCount: number,
  onQuizComplete: (attempt: QuizAttempt) => void
) {
  const [state, setState] = useState<QuizState>('inactive')
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty)
  const [holdCount, setHoldCount] = useState(consecutiveHoldCount)
  const [isReviewingAnswer, setIsReviewingAnswer] = useState(false)

  const checkAndTriggerQuiz = useCallback(
    (postOrder: number) => {
      if (state !== 'inactive') return
      const quiz = quizzes.find((q) => q.afterPostOrder === postOrder)
      if (quiz) {
        setActiveQuiz(quiz)
        setCurrentQuestionIndex(0)
        setAnswers([])
        setSelectedOption(null)
        setState('active')
      }
    },
    [quizzes, state]
  )

  const selectOption = useCallback(
    (index: number) => {
      if (!activeQuiz || isReviewingAnswer) return
      const question: QuizQuestion = activeQuiz.questions[currentQuestionIndex]
      const correct = index === question.correctIndex
      setSelectedOption(index)
      setIsReviewingAnswer(true)
      setAnswers((prev) => [...prev, { questionId: question.id, selectedIndex: index, correct }])
      setState('reviewing')
    },
    [activeQuiz, currentQuestionIndex, isReviewingAnswer]
  )

  const nextQuestion = useCallback(() => {
    if (!activeQuiz) return
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= activeQuiz.questions.length) {
      setState('complete')
    } else {
      setCurrentQuestionIndex(nextIndex)
      setSelectedOption(null)
      setIsReviewingAnswer(false)
      setState('active')
    }
  }, [activeQuiz, currentQuestionIndex])

  const finishQuiz = useCallback(() => {
    if (!activeQuiz) return
    const correct = answers.filter((a) => a.correct).length
    const score = correct / answers.length

    const { difficulty: newDifficulty, consecutiveHoldCount: newHoldCount } = adjustDifficulty(
      difficulty,
      score,
      holdCount
    )

    const attempt: QuizAttempt = {
      quizId: activeQuiz.id,
      completedAt: new Date().toISOString(),
      score,
      difficultyBefore: difficulty,
      difficultyAfter: newDifficulty,
      answers,
    }

    setDifficulty(newDifficulty)
    setHoldCount(newHoldCount)
    onQuizComplete(attempt)
    setState('inactive')
    setActiveQuiz(null)
    setSelectedOption(null)
    setIsReviewingAnswer(false)
  }, [activeQuiz, answers, difficulty, holdCount, onQuizComplete])

  const currentQuestion = activeQuiz?.questions[currentQuestionIndex] ?? null

  return {
    state,
    difficulty,
    activeQuiz,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: activeQuiz?.questions.length ?? 0,
    selectedOption,
    isReviewingAnswer,
    answers,
    checkAndTriggerQuiz,
    selectOption,
    nextQuestion,
    finishQuiz,
  }
}
