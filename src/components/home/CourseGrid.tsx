'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Course, CourseProgress } from '@/types'
import { CourseCard } from './CourseCard'
import { loadProgress } from '@/lib/progressStorage'
import { stagger } from '@/constants/animations'

interface CourseGridProps {
  courses: Course[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({})

  useEffect(() => {
    const up = loadProgress()
    setProgressMap(up.courses)
  }, [])

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} progress={progressMap[course.id] ?? null} />
      ))}
    </motion.div>
  )
}
