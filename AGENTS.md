# AGENTS.md — Project conventions for AI coding agents

## Project overview
The Book of Something is a doom-scroll learning web app where users swipe through TikTok-style lesson cards, take adaptive quizzes, and progress through courses at beginner, intermediate, or advanced difficulty.

## Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Animation: Framer Motion 12
- Testing: Vitest + React Testing Library
- Icons: lucide-react

## Getting started
```bash
npm install
npm run dev      # localhost:3000
npm test         # run tests
npm run lint     # eslint
npm run format   # prettier
```

## Folder conventions
- `src/app/`                — Next.js routes and layouts
- `src/components/ui/`     — primitive reusable components (Badge, Button, ProgressRing)
- `src/components/feed/`   — feed-specific components (PostCard, QuizOverlay, etc.)
- `src/components/home/`   — home page components (CourseCard, CourseGrid)
- `src/components/layout/` — layout components (if any)
- `src/hooks/`             — custom React hooks (useConfetti, useQuizEngine, useUserProgress)
- `src/lib/`               — utilities and animation variants
- `src/types/`             — shared TypeScript types
- `src/data/`              — static JSON course data
- `src/test/`              — test setup files

## Key conventions
- All imports use the `@/` alias (e.g. `@/components/ui/Button`)
- Framer Motion variants live in `src/lib/animations.ts`
- canvas-confetti accessed only via `useConfetti()` hook
- Server Components by default; add `"use client"` only when needed
- Tests live in `src/components/__tests__/` subdirectories
- No emoji as UI icons — use lucide-react SVG icons

## What NOT to change
- `.husky/` — pre-commit hooks, don't disable
- `src/data/` — static JSON course data, edit carefully
- `src/lib/difficultyEngine.ts` — core quiz scoring logic
