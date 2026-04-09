# CLAUDE.md — The Book of Something

> This file is read by Claude Code at the start of every session.
> It is the single source of truth for the project's context, conventions,
> architecture, design system, and current product state.
> Never guess at project decisions — if it's not in here, ask before acting.

---

## 1. Project overview

**The Book of Something** is a scroll-native micro-learning web app for
frontend developers. The core mechanic is a TikTok-style vertical snap-scroll
feed where users learn through bite-sized lesson cards and immediately test
themselves with interactive challenges after every single concept.

**Tagline:** Learn anything, one scroll at a time.

**Core learning loop (Flow A):**
1. Concept card — one idea, one screen, ~10 seconds to read
2. Interaction card — immediately tests the same concept (fill-in-blank,
   spot-the-bug, true/false swipe, predict-output, or drag-to-order)
3. Instant reward — XP pop, green flash, explanation revealed, combo counter
4. Next concept → repeat
5. Every 5 concepts: section checkpoint (mixed 3-question burst)
6. End of course: boss challenge + completion screen with confetti

**Repo:** `aniketbamotra/The-Book-of-Something`
**Live at:** localhost:3000 (development)

---

## 2. Tech stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 16.2.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| Animation | Framer Motion | 12.x |
| Icons | Lucide React | 0.474+ |
| Confetti | canvas-confetti (lazy) | 1.9.x |
| Utilities | clsx, tailwind-merge | latest |
| Runtime | React 19 | 19.x |

**Build:** `npm run dev` · `npm run build` · `npm run lint`
**Type check:** `npx tsc --noEmit`

---

## 3. Folder structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — lang="en", fonts, metadata
│   ├── globals.css              # CSS custom properties, Tailwind theme wiring
│   ├── page.tsx                 # Homepage — SSG, hero + CourseGrid
│   └── course/
│       ├── [courseId]/
│       │   ├── page.tsx         # Course detail — SSG, generateStaticParams
│       │   └── feed/
│       │       └── page.tsx     # Feed wrapper — passes courseId to FeedContainer
├── components/
│   ├── feed/
│   │   ├── FeedContainer.tsx    # Main orchestrator — scroll, quiz, progress (504 lines)
│   │   ├── PostCard.tsx         # Lesson card renderer — markdown, code blocks (364 lines)
│   │   ├── QuizCard.tsx         # Quiz overlay — confidence + accuracy tracking
│   │   ├── CompletionScreen.tsx # Course complete — confetti, share, stats
│   │   └── FeedProgressHUD.tsx  # Fixed top bar — back, title, difficulty, progress
│   ├── home/
│   │   ├── CourseCard.tsx       # Course listing card — progress bar, completion badge
│   │   └── CourseGrid.tsx       # Grid of CourseCards — reads localStorage progress
│   ├── course/
│   │   └── ContinueButton.tsx   # Resume lesson button — localStorage-driven
│   ├── layout/
│   │   ├── Navbar.tsx           # Top nav — frosted glass
│   │   └── Footer.tsx           # Site footer
│   └── ui/
│       ├── Button.tsx           # Generic button — server component
│       ├── Badge.tsx            # Generic badge — server component
│       └── ProgressRing.tsx     # SVG ring indicator — server component
├── design-system/
│   ├── tokens.ts                # SOURCE OF TRUTH — all design values
│   └── DESIGN.md                # Rationale document
├── hooks/
│   └── useConfetti.ts           # Lazy-loads canvas-confetti on demand
├── lib/
│   ├── animations.ts            # Framer Motion variants — fadeUp, staggerChildren
│   ├── difficultyEngine.ts      # getDifficultyLabel, getDiffTokens
│   └── progressStorage.ts       # localStorage abstraction — SSR-guarded, try-catch
├── types/
│   └── index.ts                 # Course, Post, Quiz, CourseProgress interfaces
└── data/
    ├── courses.json             # Course index — 4 courses
    └── courses/
        ├── intro-to-react.json  # 15 posts, 3 quizzes
        ├── typescript-basics.json # 10 posts, 2 quizzes
        ├── css-mastery.json     # 10 posts, 2 quizzes
        └── computer-basics.json # 20 posts, 5 quizzes
```

---

## 4. Design system — read this before writing any UI

### 4a. The one rule that matters most

**All visual values come from `src/design-system/tokens.ts`.**
Never use raw hex values, raw rgba(), or inline `style={{color: '...'}}` for
colours or spacing. Import from tokens or use the Tailwind utilities that
map to them. The 147 inline style instances already in the codebase are
technical debt — do not add more.

### 4b. Colour tokens (light theme)

```ts
// Backgrounds — paper-white stack
bgBase:     "#FAFAF8"  // page background
bgSurface:  "#F5F4F1"  // section alternates, sidebars
bgCard:     "#FFFFFF"  // cards pop off base
bgElevated: "#EEECEA"  // hover fills, muted surfaces

// Primary — indigo brand (never change)
primary300: "#A5B4FC"
primary400: "#818CF8"
primary500: "#6366F1"  // default CTA
primary600: "#4F46E5"  // pressed/active

// Text — slate hierarchy, WCAG AA on white
textPrimary:   "#0F172A"  // headings — contrast 16:1
textSecondary: "#334155"  // body — contrast 10:1
textMuted:     "#64748B"  // meta — contrast 5.1:1 ✓AA
textSubtle:    "#94A3B8"  // hints, placeholders

// Borders
borderSubtle:  "#E8E5E0"
borderDefault: "#D8D4CE"
borderStrong:  "#C4BFB8"

// Semantic — confidence states
gotIt500:    "#16A34A"  gotItBg:    "rgba(22,163,74,.08)"
needHelp500: "#D97706"  needHelpBg: "rgba(217,119,6,.08)"
showAgain500:"#2563EB"  showAgainBg:"rgba(37,99,235,.08)"

// Semantic — quiz results
quizCorrect:  "#15803D"  quizCorrectBg:  "rgba(21,128,61,.08)"
quizIncorrect:"#DC2626"  quizIncorrectBg:"rgba(220,38,38,.08)"

// Content type badge colours
typeText:    "#2563EB"  typeCode:    "#7C3AED"
typeTip:     "#D97706"  typeAnalogy: "#9333EA"
typeFact:    "#EA580C"

// Difficulty
diffBeginner:    "#16A34A"
diffIntermediate:"#D97706"
diffAdvanced:    "#DC2626"

// Code blocks — always dark even on light page
codeBlockBg: "#0F172A"  codeText: "#E2E8F0"
```

### 4c. Typography

| Face | Usage | Key settings |
|------|-------|-------------|
| Space Grotesk | All headings h1–h3 | weight 700, letter-spacing -0.03em |
| DM Sans | All body text | weight 400, line-height 1.65, max-width 62ch |
| JetBrains Mono | Code only | always dark-on-dark, never UI labels |

Minimum body font size: **16px**. Never go below 12px for any UI text.

### 4d. Spacing & radii

4px base unit. All spacing is multiples of 4.

| Token | Value | Use |
|-------|-------|-----|
| `radii.sm` | 8px | Badges, pills, small elements |
| `radii.md` | 12px | Inputs, buttons, small cards |
| `radii.lg` | 16px | Standard cards |
| `radii.xl` | 20px | Large cards, modals |
| `radii.full` | 9999px | Pills, tags |

### 4e. Shadows

```ts
card:      "0 1px 2px rgba(15,23,42,.05), 0 0 0 1px rgba(15,23,42,.04)"
cardHover: "0 4px 16px rgba(15,23,42,.08), 0 0 0 1px rgba(99,102,241,.14)"
elevated:  "0 8px 32px rgba(15,23,42,.10), 0 0 0 1px rgba(15,23,42,.06)"
primary:   "0 0 0 1px rgba(99,102,241,.25), 0 4px 16px rgba(99,102,241,.18)"
```

### 4f. Animation — springs only, never CSS @keyframes

```ts
snappy:     { stiffness: 450, damping: 30 }  // tap feedback, badge appear
bouncy:     { stiffness: 320, damping: 22 }  // cards entering
smooth:     { stiffness: 260, damping: 28 }  // default content reveal
gentle:     { stiffness: 200, damping: 30 }  // background shifts
swipeFling: { stiffness: 280, damping: 20 }  // card thrown on swipe
swipeDrag:  { stiffness: 400, damping: 40 }  // card being held/dragged
```

All animations must respect `useReducedMotion()` from framer-motion.
When `shouldReduce` is true, pass `{ duration: 0 }` as the transition.

### 4g. Component rules

- `Button.tsx`, `Badge.tsx`, `ProgressRing.tsx` — server components, no
  `"use client"` unless adding interactivity
- `Footer.tsx` — server component
- All other feed/home components — `"use client"` because they use state,
  effects, or Framer Motion
- New components that import `framer-motion` → wrap in `next/dynamic` with
  `ssr: false` from day one
- No emoji as icons — use Lucide React SVG icons only
- All clickable elements must have `cursor-pointer`
- All interactive elements must have `focus-visible` ring:
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`

---

## 5. Data architecture

### Course JSON schema

Every new course is a JSON file dropped into `src/data/courses/`. The index
`src/data/courses.json` must be updated to include it. No code changes needed
for new content.

Each post in a course must have all three difficulty variants:

```jsonc
{
  "id": "r-1",
  "order": 1,
  "type": "learn",           // learn | interaction | checkpoint | boss | complete
  "interactionType": "fill-blank", // fill-blank | spot-bug | true-false | predict | order | debug
  "conceptId": "use-effect", // links learn↔interaction pairs
  "xpReward": 20,            // base XP before combo multiplier
  "section": 1,              // which section (drives checkpoint grouping)
  "difficulty": "beginner",
  "content": {
    "beginner":     { "title": "...", "body": "...", "code": "..." },
    "intermediate": { "title": "...", "body": "...", "code": "..." },
    "advanced":     { "title": "...", "body": "...", "code": "..." }
  },
  "challenge": {             // only on interaction/checkpoint/boss cards
    "prompt": "...",
    "blanks": [{ "position": 0, "answer": "Effect" }],
    "explanation": "..."
  }
}
```

### localStorage schema

Key: `tbos_progress`

```ts
interface CourseProgress {
  courseId: string
  currentPostOrder: number
  completedPostIds: string[]
  currentDifficulty: "beginner" | "intermediate" | "advanced"
  consecutiveHoldCount: number   // drives adaptive difficulty
  quizHistory: QuizResult[]
  startedAt: string
  lastActiveAt: string
}
```

All localStorage access is in `src/lib/progressStorage.ts`.
Never read/write localStorage directly in a component.
Always use the abstraction. It handles SSR guards and try-catch.

---

## 6. Known bugs — current status

| Bug | Status | File |
|-----|--------|------|
| Continue Learning resets quiz to Q1 | ✅ Fixed | FeedContainer.tsx |
| Quiz question lags one render cycle | ✅ Fixed | QuizCard.tsx |
| Hydration mismatch / black screen flash | ✅ Low risk | layout.tsx |
| Tables rendering as raw markdown | ✅ Fixed | PostCard.tsx |

---

## 7. Features — current status

| Feature | Status |
|---------|--------|
| Snap-scroll lesson feed | ✅ Built |
| Adaptive difficulty (data layer) | ✅ Built — consecutiveHoldCount drives adjustDifficulty() |
| Progress persistence (localStorage) | ✅ Built |
| Keyboard navigation (↑↓ arrows) | ✅ Built — FeedContainer useEffect |
| Continue where you left off | ✅ Built — ContinueButton.tsx |
| Course completion screen | ✅ Built — CompletionScreen.tsx |
| Share course result (Web Share API) | ✅ Built |
| Per-difficulty content variants | ✅ Built — all posts have 3 variants |
| Quiz confidence tracking | ✅ Built |
| Interaction cards (Flow A) | 📋 NOT BUILT — next sprint |
| XP system + combo multiplier | 📋 NOT BUILT — next sprint |
| Section checkpoints (new format) | 📋 NOT BUILT — next sprint |
| Streak system | 📋 NOT BUILT |
| Dark mode | 📋 NOT BUILT |
| Filter pills on homepage | 📋 NOT BUILT |

---

## 8. Next sprint — what to build (Flow A + checkpoints)

The product has been redesigned around **Flow A** (Duolingo rhythm):
every concept card is immediately followed by an interaction card.
The existing confidence check (yes/no) is being replaced entirely.

### New card types to add

**Interaction card types:**
- `fill-blank` — code snippet with blanks, user types answer
- `spot-bug` — show broken code, user taps the buggy line
- `true-false` — statement about the concept, swipe right/left
- `predict` — "what does this code output?" with 4 options
- `order` — drag scrambled code lines into correct order

**Checkpoint card** (every 5 concepts, replaces current quiz modal):
- 3 questions, each a different interaction type
- Full-screen, same scroll pattern as lessons — no overlay/modal
- Section complete reward screen after

**Reward system:**
- XP per correct answer (base amount in card JSON `xpReward` field)
- Combo multiplier: 3 correct = 1.5x, 5 correct = 2x
- Combo shown in `FeedProgressHUD` header
- Correct: green flash + XP pop animation + explanation reveal
- Wrong: red shake + explanation + try again (no XP lost, combo resets)

### XP amounts by type

| Interaction | Base XP |
|-------------|---------|
| fill-blank | 20 |
| spot-bug | 20 |
| true-false | 10 |
| predict | 25 |
| order | 20 |
| checkpoint question | 30 |
| boss question | 50 |

---

## 9. TypeScript conventions

- `strict: true` — zero errors at all times. Run `npx tsc --noEmit` before
  committing anything.
- No `any` types — ever. Use `unknown` + type guard if genuinely needed.
- No `@ts-ignore` or `@ts-nocheck` — ever.
- Path alias `@/` maps to `src/` — use it for all imports.
- All component props must have a named interface, not inline types.
- Prefer `useReducer` over multiple `useState` calls for any state that has
  more than 2 related variables (especially quiz state).

---

## 10. Coding conventions

- **No raw hex in components** — import from `@/design-system/tokens`
- **No `style={{}}` for colour/spacing** — use Tailwind utilities
- **Dynamic imports for Framer Motion** in any new component
- **Server components by default** — only add `"use client"` when the
  component genuinely needs state, effects, or browser APIs
- **All new interaction components** go in `src/components/feed/interactions/`
- **All new hooks** go in `src/hooks/`
- **Commit format:** `feat: ...` / `fix: ...` / `chore: ...` / `refactor: ...`
- Run `npm run build` and `npx tsc --noEmit` before every commit

---

## 11. Brand identity

### Logo concept

Four horizontal bars of decreasing width = a book's lines of text.
Trailing chevron → = the swipe/scroll gesture and forward momentum.
Fading opacity on bars = layered knowledge (beginner → advanced).
The icon works at every size from 14px favicon to 72px app icon.

---

### Logo SVG — copy-paste ready at every size

**72px — app icon, splash screen**
```svg
<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="72" height="72" rx="18" fill="#6366F1"/>
  <rect x="18" y="20" width="36" height="4.5" rx="2.25" fill="white"/>
  <rect x="18" y="30" width="26" height="4.5" rx="2.25" fill="white" opacity="0.85"/>
  <rect x="18" y="40" width="32" height="4.5" rx="2.25" fill="white" opacity="0.70"/>
  <rect x="18" y="50" width="20" height="4.5" rx="2.25" fill="white" opacity="0.50"/>
  <path d="M49 43 L57 51 L49 59" stroke="#A5B4FC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**48px — navbar, card header**
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="12" fill="#6366F1"/>
  <rect x="12" y="13" width="24" height="3" rx="1.5" fill="white"/>
  <rect x="12" y="20" width="17" height="3" rx="1.5" fill="white" opacity="0.85"/>
  <rect x="12" y="27" width="21" height="3" rx="1.5" fill="white" opacity="0.70"/>
  <rect x="12" y="34" width="13" height="3" rx="1.5" fill="white" opacity="0.50"/>
  <path d="M33 29 L38 34 L33 39" stroke="#A5B4FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**32px — standard UI icon**
```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#6366F1"/>
  <rect x="8" y="9" width="16" height="2" rx="1" fill="white"/>
  <rect x="8" y="14" width="11" height="2" rx="1" fill="white" opacity="0.85"/>
  <rect x="8" y="19" width="14" height="2" rx="1" fill="white" opacity="0.70"/>
  <rect x="8" y="24" width="9" height="2" rx="1" fill="white" opacity="0.50"/>
  <path d="M21 19 L25 23 L21 27" stroke="#A5B4FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**20px — compact UI, badges**
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="20" height="20" rx="5" fill="#6366F1"/>
  <rect x="5" y="6" width="10" height="1.5" rx="0.75" fill="white"/>
  <rect x="5" y="9.5" width="7" height="1.5" rx="0.75" fill="white" opacity="0.85"/>
  <rect x="5" y="13" width="8.5" height="1.5" rx="0.75" fill="white" opacity="0.70"/>
  <path d="M13.5 11.5 L16 14 L13.5 16.5" stroke="#A5B4FC" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**14px — favicon (bars only, no chevron)**
```svg
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="14" height="14" rx="3.5" fill="#6366F1"/>
  <rect x="3" y="4" width="8" height="1.2" rx="0.6" fill="white"/>
  <rect x="3" y="6.8" width="5" height="1.2" rx="0.6" fill="white" opacity="0.80"/>
  <rect x="3" y="9.6" width="6" height="1.2" rx="0.6" fill="white" opacity="0.60"/>
</svg>
```

---

### Wordmark — full lockup as a React component

Use this in `Navbar.tsx` and any full-width brand placement:

```tsx
// src/components/ui/Logo.tsx
import { colors } from "@/design-system/tokens";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "indigo";
}

export function Logo({ size = "md", variant = "light" }: LogoProps) {
  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const rx = iconSize * 0.25;
  const mainColor = variant === "light" ? colors.textPrimary : "#FFF9F5";
  const accentColor = variant === "indigo" ? "#C7D2FE" : colors.primary300;
  const somethingColor = variant === "light" ? colors.primary500 : accentColor;
  const subColor = variant === "light"
    ? colors.textMuted
    : "rgba(255,249,245,0.55)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx={rx} fill={colors.primary500}/>
        <rect x="9" y="10" width="18" height="2.2" rx="1.1" fill="white"/>
        <rect x="9" y="15" width="13" height="2.2" rx="1.1" fill="white" opacity="0.85"/>
        <rect x="9" y="20" width="16" height="2.2" rx="1.1" fill="white" opacity="0.70"/>
        <rect x="9" y="25" width="10" height="2.2" rx="1.1" fill="white" opacity="0.50"/>
        <path
          d="M25 22 L29 26 L25 30"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontSize: size === "sm" ? 14 : size === "lg" ? 20 : 17,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: mainColor,
        }}>
          The Book of{" "}
          <span style={{ color: somethingColor }}>Something</span>
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.10em",
          textTransform: "uppercase" as const,
          color: subColor,
          marginTop: 3,
        }}>
          Learn one scroll at a time
        </div>
      </div>
    </div>
  );
}
```

---

### Name treatment rule

- "The Book of" → always `colors.textPrimary` (or white on dark backgrounds)
- "Something" → always `colors.primary500` (#6366F1) — this is the one word
  that gets the brand colour. Never apply indigo to any other word in the name.
- Tagline → always `colors.textMuted` or muted white — never the same weight
  as the main name

---

### Logo usage rules

| Context | Size | Variant |
|---------|------|---------|
| Navbar (light bg) | 36px icon + wordmark | `light` |
| Navbar (dark bg) | 36px icon + wordmark | `dark` |
| App icon / favicon | 72 / 14px | icon only |
| OG image / social card | 48px icon + wordmark | `dark` on indigo bg |
| Course completion share card | 32px icon + name | `light` |
| Loading / splash | 72px icon centred | icon only |

### Minimum clear space

Always maintain clear space equal to the icon's corner radius on all sides.
Never place the logo closer than 16px to any edge or other element.

### What NOT to do

- Do not stretch, rotate, or recolour the icon
- Do not use the icon without the indigo background
- Do not change "Something" to any other colour than `primary500`
- Do not use the tagline at sizes below 10px
- Do not recreate the bars with emojis or unicode characters

---

**Voice:** Warm, direct, speaks like a senior dev friend. Analogies before
definitions. Short sentences. Never condescending, never corporate.

**Do say:** "Nice. useState updates trigger a re-render."
**Don't say:** "Excellent work! You have successfully demonstrated mastery of..."

---

## 12. Pre-delivery checklist

Before marking any task done, verify:

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run lint` — zero errors or warnings
- [ ] `npm run build` — successful production build
- [ ] No raw hex values in new code
- [ ] No new `style={{}}` for colour/spacing
- [ ] No new `"use client"` without a genuine reason
- [ ] New Framer Motion components wrapped in `next/dynamic`
- [ ] `focus-visible` ring on all new interactive elements
- [ ] `useReducedMotion()` respected in new animations
- [ ] localStorage only accessed via `progressStorage.ts`
- [ ] All new component props have a TypeScript interface