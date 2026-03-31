'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import type { Course } from '@/types'
import { Button } from '@/components/ui/Button'
import confetti from 'canvas-confetti'

interface CompletionScreenProps {
  course: Course
  quizCount: number
  avgScore: number
}

export function CompletionScreen({ course, quizCount, avgScore }: CompletionScreenProps) {
  useEffect(() => {
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })
  }, [])

  const pct = Math.round(avgScore * 100)

  return (
    <div className="feed-item flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="max-w-md w-full text-center"
      >
        {/* Trophy icon with glow */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full" />
            <Trophy size={72} className="text-yellow-400 relative" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Course Complete!</h1>
        <p className="text-white/50 mb-8">
          You finished <span className="text-white font-medium">{course.title}</span>
        </p>

        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4 text-left">
          <div>
            <div className="text-white/40 text-xs mb-1">Quizzes passed</div>
            <div className="text-2xl font-bold text-white">{quizCount}</div>
          </div>
          <div>
            <div className="text-white/40 text-xs mb-1">Avg score</div>
            <div className="text-2xl font-bold text-indigo-300">{pct}%</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
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
    </div>
  )
}
