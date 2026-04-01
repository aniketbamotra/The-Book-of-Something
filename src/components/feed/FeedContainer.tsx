'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { CourseData, DifficultyLevel } from '@/types'
import { PostCard } from '@/components/feed/PostCard'
import { FeedProgressHUD } from '@/components/feed/FeedProgressHUD'
import { useQuizEngine } from '@/hooks/useQuizEngine'
import { useUserProgress } from '@/hooks/useUserProgress'
import { useRouter } from 'next/navigation'

const QuizOverlay = dynamic(
  () => import('@/components/feed/QuizOverlay').then((m) => m.QuizOverlay),
  { ssr: false }
)

const CompletionScreen = dynamic(
  () => import('@/components/feed/CompletionScreen').then((m) => m.CompletionScreen),
  { ssr: false }
)

interface FeedContainerProps {
  data: CourseData
}

export function FeedContainer({ data }: FeedContainerProps) {
  const { course, posts, quizzes } = data
  const router = useRouter()

  const { progress, updatePost, recordQuiz, markComplete } = useUserProgress(
    course.id,
    course.difficulty
  )

  const [activePostIndex, setActivePostIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleQuizComplete = useCallback(
    (attempt: Parameters<typeof recordQuiz>[0]) => {
      recordQuiz(attempt)
    },
    [recordQuiz]
  )

  const quiz = useQuizEngine(
    quizzes,
    (progress?.currentDifficulty ?? course.difficulty) as DifficultyLevel,
    progress?.consecutiveHoldCount ?? 0,
    handleQuizComplete
  )

  // Intersection observer for active card detection
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setActivePostIndex(index)
              const post = posts[index]
              if (post) {
                updatePost(post.id, post.order)
                quiz.checkAndTriggerQuiz(post.order)
              }
            }
          }
        })
      },
      { threshold: 0.7 }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    return () => observerRef.current?.disconnect()
  }, [posts, quiz, updatePost])

  // Scroll to last saved position on mount
  useEffect(() => {
    if (!progress || !containerRef.current) return
    const targetIndex = posts.findIndex((p) => p.order === progress.currentPostOrder)
    if (targetIndex > 0) {
      const card = cardRefs.current[targetIndex]
      if (card) {
        setTimeout(() => card.scrollIntoView({ behavior: 'instant' }), 100)
      }
    }
  }, [progress, posts])

  const currentPost = posts[activePostIndex]
  const difficulty = quiz.difficulty
  const avgScore =
    progress && progress.quizHistory.length > 0
      ? progress.quizHistory.reduce((sum, q) => sum + q.score, 0) / progress.quizHistory.length
      : 0

  // Check completion
  useEffect(() => {
    if (
      activePostIndex === posts.length - 1 &&
      progress &&
      progress.completedPostIds.length >= posts.length - 1 &&
      !isComplete
    ) {
      // small delay so user reads the last card
      const t = setTimeout(() => {
        markComplete()
        setIsComplete(true)
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [activePostIndex, posts.length, progress, markComplete, isComplete])

  const showQuiz =
    quiz.state === 'active' || quiz.state === 'reviewing' || quiz.state === 'complete'

  return (
    <div className="relative h-screen bg-zinc-950 overflow-hidden">
      <FeedProgressHUD
        current={activePostIndex + 1}
        total={posts.length}
        difficulty={difficulty}
        courseTitle={course.title}
        onBack={() => router.push(`/course/${course.id}`)}
      />

      {/* scrollable feed */}
      <div ref={containerRef} className="feed-container h-screen overflow-y-scroll">
        {posts.map((post, i) => (
          <div
            key={post.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="feed-item"
          >
            <PostCard
              post={post}
              difficulty={difficulty}
              isActive={activePostIndex === i}
              totalPosts={posts.length}
            />
          </div>
        ))}

        {/* completion card */}
        {isComplete && (
          <CompletionScreen
            course={course}
            quizCount={progress?.quizHistory.length ?? 0}
            avgScore={avgScore}
          />
        )}
      </div>

      {/* quiz overlay */}
      <AnimatePresence>
        {showQuiz && (
          <QuizOverlay
            question={quiz.currentQuestion}
            questionIndex={quiz.currentQuestionIndex}
            totalQuestions={quiz.totalQuestions}
            selectedOption={quiz.selectedOption}
            isReviewing={quiz.isReviewingAnswer}
            isComplete={quiz.state === 'complete'}
            score={
              quiz.answers.filter((a) => a.correct).length / Math.max(1, quiz.answers.length)
            }
            difficultyChanged={
              quiz.state === 'complete' &&
              quiz.answers.length > 0 &&
              (() => {
                const correct = quiz.answers.filter((a) => a.correct).length
                const score = correct / quiz.answers.length
                return score >= 0.8 || score <= 0.4
              })()
            }
            newDifficulty={difficulty}
            onSelect={quiz.selectOption}
            onNext={quiz.nextQuestion}
            onFinish={quiz.finishQuiz}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
