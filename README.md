# The Book of Something

> Bite-sized lessons designed for the scroll generation.

A doom-scroll learning web app built with Next.js 16. Pick a course, swipe through TikTok-style lesson cards, and level up — one card at a time. Adaptive quizzes automatically adjust content difficulty based on your performance.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer)

## Features

- TikTok-style scroll feed with CSS scroll-snap
- Adaptive difficulty engine (beginner / intermediate / advanced)
- Pop-up quizzes every N posts with instant feedback
- Completion screen with confetti celebration
- Progress saved to localStorage (no backend needed)
- 3 built-in courses: Intro to React, TypeScript Basics, CSS Mastery

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Icons | lucide-react |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3000
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/                    # Next.js routes
├── components/
│   ├── ui/                 # Primitive components
│   ├── feed/               # Feed components
│   └── home/               # Home page components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & animation variants
├── types/                  # TypeScript types
└── data/                   # Static course JSON
```

## Deployment

Deploy to Vercel with zero config:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
