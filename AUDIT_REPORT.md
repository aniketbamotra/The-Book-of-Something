# The Book of Something — Full Codebase Audit

**Date:** 2026-04-02
**Auditor:** Claude Code (claude-sonnet-4-6)
**Scope:** All 41 source files, 5,488 lines of TypeScript/TSX/CSS

---

## Section 1 — File Structure

| Path | Lines | Role | Notes |
|------|-------|------|-------|
| `src/app/globals.css` | ~120 | Global styles, design tokens | Warm cream palette, SVG noise texture |
| `src/app/layout.tsx` | ~40 | Root layout | `lang="en"`, font vars |
| `src/app/page.tsx` | ~180 | Home page | Hero + CourseGrid, SSG |
| `src/app/course/[courseId]/page.tsx` | 224 | Course detail page | SSG, `generateStaticParams` |
| `src/app/course/[courseId]/feed/page.tsx` | ~30 | Feed page wrapper | Passes courseId to FeedContainer |
| `src/components/feed/FeedContainer.tsx` | 504 | Main feed orchestrator | Largest file — scroll snap, quiz engine, progress |
| `src/components/feed/PostCard.tsx` | 364 | Lesson card renderer | Markdown table parser, inline formatting |
| `src/components/feed/QuizCard.tsx` | ~180 | Quiz card renderer | Confidence + accuracy tracking |
| `src/components/feed/CompletionScreen.tsx` | 365 | Course completion UI | Confetti, share, stat cards |
| `src/components/feed/FeedProgressHUD.tsx` | 93 | Fixed top progress bar | Back button, title, difficulty badge |
| `src/components/home/CourseCard.tsx` | 172 | Course listing card | Progress bar, completion badge |
| `src/components/home/CourseGrid.tsx` | ~90 | Grid of CourseCards | `useEffect` for localStorage progress |
| `src/components/course/ContinueButton.tsx` | ~60 | Resume lesson button | localStorage-driven, client component |
| `src/components/layout/Navbar.tsx` | ~50 | Top navigation bar | Warm frosted glass |
| `src/components/layout/Footer.tsx` | ~40 | Site footer | Warm palette |
| `src/components/ui/Button.tsx` | ~30 | Generic button | No state/effects — unnecessary `"use client"` |
| `src/components/ui/Badge.tsx` | ~20 | Generic badge | No state/effects — unnecessary `"use client"` |
| `src/components/ui/ProgressRing.tsx` | ~35 | SVG ring indicator | No state/effects — unnecessary `"use client"` |
| `src/design-system/tokens.ts` | ~80 | Color/spring tokens | `as const`, source of truth |
| `src/lib/difficultyEngine.ts` | ~60 | Difficulty utilities | `getDifficultyLabel`, `getDiffTokens` |
| `src/lib/animations.ts` | ~30 | Framer Motion variants | `fadeUp`, `staggerChildren` |
| `src/constants/animations.ts` | 59 | Framer Motion variants | **DUPLICATE** of `src/lib/animations.ts` |
| `src/lib/progressStorage.ts` | ~80 | localStorage abstraction | SSR-guarded, try-catch wrapped |
| `src/hooks/useConfetti.ts` | ~25 | Confetti trigger | Lazy-loads `canvas-confetti` |
| `src/types/index.ts` | ~60 | Shared TypeScript types | `Course`, `Post`, `Quiz`, `CourseProgress` |
| `src/data/courses.json` | ~50 | Course index | 4 courses: react, typescript, css, computer-basics |
| `src/data/courses/react-hooks.json` | ~300 | React Hooks course data | 15 posts, 3 quizzes |
| `src/data/courses/typescript-basics.json` | ~200 | TypeScript course data | 10 posts, 2 quizzes |
| `src/data/courses/css-layout.json` | ~200 | CSS Layout course data | 10 posts, 2 quizzes |
| `src/data/courses/computer-basics.json` | 484 | Computer Basics course data | 20 posts, 5 quizzes |

**Total:** 41 source files, ~5,488 lines

---

## Section 2 — TypeScript Health

| Check | Status | Detail |
|-------|--------|--------|
| `tsc --noEmit` errors | ✅ Zero | Strict mode passes cleanly |
| `strict: true` | ✅ On | Full strict mode enabled |
| `@/*` path alias | ✅ Configured | `tsconfig.json` + `next.config.ts` |
| `target` | `ES2017` | Fine for current browser support |
| `moduleResolution` | `bundler` | Correct for Next.js 16 |
| Explicit `any` | None found | No escape hatches |
| Untyped props | None found | All component props have interfaces |
| Return types | Implicit only | Functions use inference — acceptable |

**Verdict:** TypeScript health is excellent. No issues.

---

## Section 3 — Dependencies

| Package | Current | Latest | Type | Action |
|---------|---------|--------|------|--------|
| `next` | 16.2.1 | 16.2.3 | prod | Patch update — safe |
| `react` / `react-dom` | 19.0.0 | 19.1.0 | prod | Minor — check release notes |
| `framer-motion` | 12.x | 12.x | prod | Up to date |
| `lucide-react` | 0.474.0 | 0.475.0 | prod | Patch update — safe |
| `canvas-confetti` | 1.9.3 | 1.9.3 | prod | Up to date |
| `typescript` | 5.9.x | 6.0 | dev | **Major** — breaking changes, defer |
| `vitest` | 2.1.x | 4.1.x | dev | **Major** — no tests exist anyway |
| `@vitejs/plugin-react` | 4.7.x | 6.0.x | dev | **Major** — defer with vitest |
| `eslint` | 9.x | 10.x | dev | **Major** — review rules before upgrading |
| `tailwindcss` | 4.x | 4.x | dev | Up to date |

**Bundle concerns:**
- `framer-motion` is synchronously imported in 12 files — contributes to initial JS bundle
- `canvas-confetti` is lazily imported in `useConfetti.ts` ✅
- No unused dependencies detected

---

## Section 4 — Design System

| Check | Status | Detail |
|-------|--------|--------|
| Token source of truth | ✅ `tokens.ts` | Colors and springs centralised |
| CSS custom properties | ✅ `globals.css` | Maps `--ds-bg-*`, `--ds-border-*` |
| Warm cream palette | ✅ Consistent | `#fff9f5` base across all surfaces |
| Dark mode | ❌ Not implemented | Zero `dark:` classes, no theme toggle |
| Inline `style={{}}` count | ⚠️ 147 instances | Opportunity to move to Tailwind utilities |
| Design token usage | Mixed | Some components use tokens, some use raw hex |
| SVG noise texture | ✅ Applied | `html, body` background-image, 200×200px tile |
| Difficulty badge tokens | ✅ Centralised | `getDiffTokens()` shared across 2 consumers |
| Legacy `--background` var | ✅ Updated | Points to `#fff9f5` |

**Palette reference:**

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-bg-base` / `--background` | `#fff9f5` | Page background |
| `--ds-bg-surface` | `#fef5ef` | Sections, alternating rows |
| `--ds-bg-card` | `#ffffff` | Course cards (pop against cream) |
| `--ds-bg-elevated` | `#fdeee6` | Table headers, modals |
| `--ds-border-subtle` | `#f0ebe6` | Inner borders |
| `--ds-border-default` | `#ede5de` | Card/section borders |

---

## Section 5 — Component Architecture

### Client component inventory

| Component | `"use client"` | Needs It? | Reason |
|-----------|---------------|-----------|--------|
| `FeedContainer.tsx` | ✅ | Yes | `useState`, `useEffect`, scroll |
| `FeedProgressHUD.tsx` | ✅ | Yes | `framer-motion` animations |
| `PostCard.tsx` | ✅ | Yes | `framer-motion` |
| `QuizCard.tsx` | ✅ | Yes | `useState`, interaction |
| `CompletionScreen.tsx` | ✅ | Yes | `useState`, `useEffect`, confetti |
| `CourseCard.tsx` | ✅ | Yes | `framer-motion` |
| `CourseGrid.tsx` | ✅ | Yes | `useEffect` + localStorage |
| `ContinueButton.tsx` | ✅ | Yes | localStorage read |
| `Navbar.tsx` | ✅ | Likely yes | `framer-motion` |
| `Footer.tsx` | ✅ | Borderline | Static content only — could be server |
| `Button.tsx` | ✅ | ⚠️ No | Pure presentational |
| `Badge.tsx` | ✅ | ⚠️ No | Pure presentational |
| `ProgressRing.tsx` | ✅ | ⚠️ No | Pure presentational |

### Duplicate code

| Location | Issue |
|----------|-------|
| `src/lib/animations.ts` | Identical exports: `fadeUp`, `staggerChildren`, `slideIn` |
| `src/constants/animations.ts` | **Exact duplicate** — 59 lines of dead code |

**Action required:** Delete `src/constants/animations.ts`. Confirm no imports point to it (none found).

---

## Section 6 — Data Layer

### Course inventory

| Course ID | Posts | Quizzes | Quiz positions | Difficulty range |
|-----------|-------|---------|----------------|-----------------|
| `react-hooks` | 15 | 3 | After posts 5, 10, 14 | beginner → advanced |
| `typescript-basics` | 10 | 2 | After posts 5, 9 | beginner → advanced |
| `css-layout` | 10 | 2 | After posts 5, 9 | beginner → advanced |
| `computer-basics` | 20 | 5 | After posts 5, 9, 14, 17, 20 | beginner → advanced |

### localStorage schema

| Key pattern | Content | Guard |
|-------------|---------|-------|
| `tbos_progress` | `Record<courseId, CourseProgress>` | try-catch ✅ SSR-guarded ✅ |
| `tbos_feed_${courseId}` | `{ postIndex, quizIndex }` scroll state | try-catch ✅ SSR-guarded ✅ |
| `tbos_confidence_${courseId}_${quizIndex}` | `{ confidence, accuracy }` | try-catch ✅ SSR-guarded ✅ |

### Data integrity

- All 4 courses have `beginner`/`intermediate`/`advanced` content variants in every post ✅
- All quiz `afterPostOrder` values reference valid post `order` values ✅
- `courses.json` index matches available JSON files ✅

---

## Section 7 — Known Bugs

| # | Bug | Reported | Status | Root Cause | Fix Applied |
|---|-----|----------|--------|------------|-------------|
| 1 | Continue Learning resets to Q1 on re-entry | Prior session | ✅ FIXED | Quiz overlay architecture replaced by feed-card pattern; `quizResetKeys` controls state reset | Architecture change eliminates the issue |
| 2 | Question lag / double-fire on fast tap | Prior session | ✅ FIXED | `handleSelect` calls both `setState` and `onAnswer` synchronously; no debounce needed in new arch | State + callback in same handler, no async gap |
| 3 | Hydration mismatch risk | Audit | ⚠️ LOW RISK | localStorage reads happen in `useEffect` (after hydration) — no SSR/client mismatch in practice | No fix needed; pattern is correct |
| 4 | Tables rendering as raw markdown | This session | ✅ FIXED | `renderContent()` had no table parser | Full `renderTextLines()` table parser added to PostCard |
| 5 | Course card hover shadow had sharp corners | This session | ✅ FIXED | `motion.div` wrapper lacked `borderRadius` | Added `style={{ borderRadius: "16px" }}` to wrapper |
| 6 | Warm colors inconsistent (cool HEX values in places) | This session | ✅ FIXED | Multiple files used `#E5E7EB`, `#F9FAFB` (cool grey) | Replaced with warm equivalents across 7 files |

---

## Section 8 — Performance

| Area | Finding | Status |
|------|---------|--------|
| `canvas-confetti` | Lazily imported via dynamic `import()` in `useConfetti.ts` | ✅ Good |
| `framer-motion` | Synchronously imported in 12 files — no lazy loading | ⚠️ Bundle impact |
| Images | No `<img>` tags found — no image optimisation needed | ✅ N/A |
| Static generation | All routes use `generateStaticParams` — zero runtime DB calls | ✅ Excellent |
| `import * as` | Used only in `progressStorage.ts` for its own exports | ✅ Acceptable |
| Bundle splitting | Next.js App Router splits per route automatically | ✅ Good |
| Font loading | Google Fonts loaded via `next/font` (no FOUT) | ✅ Good |
| Scroll performance | `transform` used for motion, not `width/height` | ✅ Good |
| `prefers-reduced-motion` | Not explicitly checked in any animation | ⚠️ Missing |

**Recommendation:** Add `useReducedMotion()` from framer-motion to `PostCard` and `FeedContainer` to respect OS accessibility settings.

---

## Section 9 — Accessibility

| Check | Status | Detail |
|-------|--------|--------|
| `lang="en"` on `<html>` | ✅ Present | `src/app/layout.tsx` |
| Image alt text | ✅ N/A | No `<img>` tags |
| Emoji alt text | ✅ Present | `role="img" aria-label={course.title}` on course emoji |
| Quiz option `aria-label` | ✅ Present | Added in review pass |
| Quiz option `aria-pressed` | ✅ Present | Added in review pass |
| Back button `aria-label` | ✅ Present | `FeedProgressHUD` |
| `focus-visible` on quiz buttons | ✅ Present | Added in review pass |
| `focus-visible` on nav links | ❌ Missing | Navbar links have no focus ring |
| `focus-visible` on course cards | ❌ Missing | `CourseCard` Link has no focus ring |
| `focus-visible` on CTA buttons | ❌ Missing | "Start Learning" button has no focus ring |
| Heading hierarchy | ✅ Present | `h1` on all pages, `h2`/`h3` in sections |
| Color-only indicators | ⚠️ Risk | Difficulty level conveyed by color + text label ✅; progress bar conveyed by color only |
| Keyboard navigation | ✅ Functional | Tab order follows visual order |
| Screen reader course list | ✅ Acceptable | List items readable but not marked as `<ul>/<li>` |

**Priority:** Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500` to Navbar links, CourseCard Link wrapper, and all CTA `<Link>` buttons.

---

## Section 10 — Feature Gaps

| Feature | Status | Notes |
|---------|--------|-------|
| Dark mode / theme toggle | 📋 NOT BUILT | No `dark:` classes, no toggle in Navbar |
| Streak system | 📋 NOT BUILT | No streak tracking in `progressStorage` |
| `consecutiveHoldCount` difficulty driver | ✅ BUILT | Read in `FeedContainer` useEffect, drives `adjustDifficulty()` |
| Keyboard navigation (← → arrows in feed) | ✅ BUILT | `useEffect` `keydown` listener in `FeedContainer` |
| Continue Learning button | ✅ BUILT | `ContinueButton.tsx` — resumes from saved `postIndex` |
| Course completion screen | ✅ BUILT | `CompletionScreen.tsx` with stats, share, confetti |
| Share course result | ✅ BUILT | Web Share API + clipboard fallback |
| Progress persistence across sessions | ✅ BUILT | localStorage with try-catch and SSR guard |
| Per-difficulty content variants | ✅ BUILT | All posts have `beginner`/`intermediate`/`advanced` |
| Quiz confidence tracking | ✅ BUILT | `avgConfidencePct` stored and shown on completion |

---

## Priority Fix List

### P0 — Delete duplicate file (5 min)

- [ ] Delete `src/constants/animations.ts` — exact duplicate of `src/lib/animations.ts`

### P1 — Accessibility: focus rings (30 min)

- [ ] Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500` class to:
  - Navbar `<Link>` elements
  - `CourseCard` outer `<Link>` wrapper
  - "Start Learning" `<Link>` in course detail page
  - "Browse more courses" and "Restart course" links in `CompletionScreen`

### P2 — Remove unnecessary `"use client"` (15 min)

- [ ] `Button.tsx` — remove `"use client"`, make server component
- [ ] `Badge.tsx` — remove `"use client"`, make server component
- [ ] `ProgressRing.tsx` — remove `"use client"`, make server component
- [ ] `Footer.tsx` — evaluate if framer-motion is used; if not, remove directive

### P3 — Reduced motion support (20 min)

- [ ] Add `const shouldReduce = useReducedMotion()` to `FeedContainer` and `PostCard`
- [ ] Conditionally pass `{ duration: 0 }` transitions when `shouldReduce` is true

### P4 — Patch dependency updates (10 min)

- [ ] `npm update lucide-react next` — safe patch updates
- [ ] Hold `typescript`, `vitest`, `eslint` — major versions with breaking changes

---

## Ready for New Features?

**Yes, with minor caveats.**

The codebase is in good health: TypeScript is strict and error-free, the data layer is robust with proper SSR guards, the feed architecture is clean and extensible, and the warm cream design system is consistent across all surfaces.

The three items worth addressing before a feature sprint:

1. **Delete `src/constants/animations.ts`** — the duplicate will cause confusion when searching for animation variants
2. **Focus rings on interactive elements** — keyboard users cannot navigate course cards or nav links
3. **No dark mode** — if this is on the roadmap, adding the `dark:` class infrastructure now is cheaper than retrofitting later

All previously reported bugs are resolved. The app is production-stable.

---

*Generated by Claude Code — 2026-04-02*
