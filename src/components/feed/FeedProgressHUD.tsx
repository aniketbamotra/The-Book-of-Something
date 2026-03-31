'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import type { DifficultyLevel } from '@/types'
import { getDifficultyColor, getDifficultyLabel } from '@/lib/difficultyEngine'
import { cn } from '@/lib/utils'

interface FeedProgressHUDProps {
  current: number
  total: number
  difficulty: DifficultyLevel
  courseTitle: string
  onBack: () => void
}

export function FeedProgressHUD({
  current,
  total,
  difficulty,
  courseTitle,
  onBack,
}: FeedProgressHUDProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      {/* thin progress bar at top */}
      <div className="h-0.5 bg-white/8">
        <motion.div
          className="h-full bg-indigo-500"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)' }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 pointer-events-auto">
        <button
          onClick={onBack}
          className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1.5 cursor-pointer"
          aria-label="Back to course"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full border',
              getDifficultyColor(difficulty)
            )}
          >
            {getDifficultyLabel(difficulty)}
          </span>
          <motion.span
            key={current}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/40 text-xs tabular-nums"
          >
            {current} / {total}
          </motion.span>
        </div>
      </div>
    </div>
  )
}
