import type { Course } from '@/types'
import { CourseGrid } from '@/components/home/CourseGrid'
import coursesData from '@/data/courses.json'
import { BookOpen, Smartphone } from 'lucide-react'

export default function HomePage() {
  const courses = coursesData as Course[]

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* hero */}
      <div className="border-b border-white/5 px-6 py-20 text-center relative overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
            <Smartphone size={14} strokeWidth={2} />
            <span>Scroll to learn</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight text-glow">
            The Book of{' '}
            <span className="text-indigo-400">Something</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Bite-sized lessons designed for the scroll generation. Pick a course, scroll through
            posts, and level up — one swipe at a time.
          </p>
        </div>
      </div>

      {/* courses */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-400" />
            All Courses
          </h2>
          <span className="text-white/30 text-sm">{courses.length} courses</span>
        </div>
        <CourseGrid courses={courses} />
      </div>
    </main>
  )
}
