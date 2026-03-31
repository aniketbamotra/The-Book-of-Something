'use client'

import { motion } from 'framer-motion'
import { BookOpen, Code2, Lightbulb, RefreshCw, Zap, ChevronUp } from 'lucide-react'
import type { LessonPost, DifficultyLevel } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { slideUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: LessonPost
  difficulty: DifficultyLevel
  isActive: boolean
  totalPosts: number
}

const typeConfig: Record<LessonPost['type'], { icon: React.ReactNode; label: string; color: string }> = {
  text: { icon: <BookOpen size={14} strokeWidth={2} />, label: 'Read', color: 'text-blue-400' },
  code: { icon: <Code2 size={14} strokeWidth={2} />, label: 'Code', color: 'text-indigo-400' },
  tip: { icon: <Lightbulb size={14} strokeWidth={2} />, label: 'Tip', color: 'text-yellow-400' },
  analogy: { icon: <RefreshCw size={14} strokeWidth={2} />, label: 'Analogy', color: 'text-purple-400' },
  fact: { icon: <Zap size={14} strokeWidth={2} />, label: 'Fact', color: 'text-orange-400' },
}

function renderContent(content: string, type: LessonPost['type'], codeLanguage?: string) {
  const parts = content.split(/(```[\s\S]*?```)/g)

  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3, -3).split('\n')
      const lang = lines[0] || codeLanguage || ''
      const code = lines.slice(1).join('\n')
      return (
        <pre
          key={i}
          className="code-block bg-black/50 border border-white/8 rounded-xl p-4 overflow-x-auto text-sm font-mono text-indigo-200 my-3 scrollbar-thin"
        >
          {lang && (
            <div className="text-indigo-400/60 text-xs mb-2 font-sans tracking-wider uppercase">{lang}</div>
          )}
          <code>{code}</code>
        </pre>
      )
    }

    const rendered = part
      .split('\n')
      .map((line, j) => {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        const withCode = formatted.replace(/`([^`]+)`/g, '<code class="bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-500/20">$1</code>')
        const withChecks = withCode.replace(/^✅\s/, '<span class="text-emerald-400">✅ </span>')

        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <li
              key={j}
              className="ml-4 list-disc text-white/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: withCode.slice(2) }}
            />
          )
        }
        if (line.trim() === '') return <br key={j} />
        return (
          <p
            key={j}
            className="text-white/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: withChecks }}
          />
        )
      })

    return <div key={i} className="space-y-1">{rendered}</div>
  })
}

export function PostCard({ post, difficulty, isActive, totalPosts }: PostCardProps) {
  const typeInfo = typeConfig[post.type]
  const content = post.content[difficulty]

  return (
    <div className="feed-item flex flex-col">
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
        className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8"
      >
        {/* Type badge + post number */}
        <div className="flex items-center justify-between mb-6">
          <span className={cn('text-sm font-medium flex items-center gap-1.5', typeInfo.color)}>
            {typeInfo.icon}
            {typeInfo.label}
          </span>
          <span className="text-xs text-white/30 tabular-nums">
            {post.order} / {totalPosts}
          </span>
        </div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight"
        >
          {post.title}
        </motion.h2>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-1 space-y-3 text-[15px]"
        >
          {renderContent(content, post.type, post.codeLanguage)}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mt-8 flex items-center justify-between"
        >
          <Badge variant={difficulty}>{difficulty}</Badge>
          <span className="text-xs text-white/25 flex items-center gap-1">
            <ChevronUp size={12} />
            Swipe up to continue
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
