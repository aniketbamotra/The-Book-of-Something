/**
 * Design Tokens — The Book of Something
 *
 * Source of truth for every visual value in the app.
 * Education design system: dark OLED, micro-interactions, vibrant semantic states.
 *
 * Usage in components:
 *   - `colors.*`    → raw hex/rgba for Framer Motion, SVG attributes, inline styles
 *   - `cssVars.*`   → CSS variable references: style={{ color: cssVars.textPrimary }}
 *   - `typography.*` → type scale constants
 *   - `shadows.*`   → box-shadow values for inline styles
 *   - `motion.*`    → Framer Motion spring/ease presets
 *
 * In globals.css these are exposed as CSS custom properties (--ds-*) and
 * wired into the Tailwind @theme so utilities like `text-primary` work.
 */

// ─── Color palette ────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds — OLED-optimised dark layers
  bgBase: "#09090B", // page background
  bgSurface: "#0F0F12", // slightly lifted surface
  bgCard: "#18181B", // card / panel background
  bgElevated: "#232329", // modal / tooltip / dropdown

  // Primary — Indigo brand (engagement, trust, learning)
  primary300: "#A5B4FC",
  primary400: "#818CF8", // hover / light accent
  primary500: "#6366F1", // main brand
  primary600: "#4F46E5", // pressed / deep
  primaryGlow: "rgba(99,102,241,0.18)",
  primaryBorder: "rgba(99,102,241,0.30)",
  primaryMuted: "rgba(99,102,241,0.12)",

  // Text
  textPrimary: "#FAFAFA",
  textSecondary: "rgba(250,250,250,0.70)",
  textMuted: "rgba(250,250,250,0.45)",
  textSubtle: "rgba(250,250,250,0.25)",
  textDisabled: "rgba(250,250,250,0.15)",

  // Borders
  borderSubtle: "rgba(255,255,255,0.06)",
  borderDefault: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",

  // ── Confidence state colours (education core) ──────────────────────────────
  // Got It — emerald green → confidence & success
  gotIt500: "#22C55E",
  gotIt400: "#4ADE80",
  gotItBg: "rgba(34,197,94,0.10)",
  gotItBorder: "rgba(34,197,94,0.25)",
  gotItGlow: "rgba(34,197,94,0.15)",

  // Need Help — warm amber → attention without alarm
  needHelp500: "#F59E0B",
  needHelp400: "#FBBF24",
  needHelpBg: "rgba(245,158,11,0.10)",
  needHelpBorder: "rgba(245,158,11,0.25)",

  // Show Again — sky blue → neutral, informational replay
  showAgain500: "#3B82F6",
  showAgain400: "#60A5FA",
  showAgainBg: "rgba(59,130,246,0.10)",
  showAgainBorder: "rgba(59,130,246,0.25)",

  // ── Quiz states ────────────────────────────────────────────────────────────
  quizCorrect: "#10B981", // emerald-500
  quizCorrectBg: "rgba(16,185,129,0.12)",
  quizCorrectBorder: "#10B981",
  quizCorrectGlow: "rgba(16,185,129,0.15)",

  quizIncorrect: "#F87171", // red-400
  quizIncorrectBg: "rgba(248,113,113,0.12)",
  quizIncorrectBorder: "#F87171",

  quizNeutral: "rgba(255,255,255,0.05)",
  quizNeutralBorder: "rgba(255,255,255,0.10)",

  // ── Achievement / completion ───────────────────────────────────────────────
  achievement: "#EAB308", // yellow-500
  achievementLight: "#FDE047", // yellow-300
  achievementBg: "rgba(234,179,8,0.12)",
  achievementGlow: "rgba(234,179,8,0.20)",

  // ── Content type badge colours ─────────────────────────────────────────────
  typeText: "#60A5FA", // blue-400
  typeTextBg: "rgba(96,165,250,0.10)",
  typeTextBorder: "rgba(96,165,250,0.20)",

  typeCode: "#A78BFA", // violet-400
  typeCodeBg: "rgba(167,139,250,0.10)",
  typeCodeBorder: "rgba(167,139,250,0.20)",

  typeTip: "#FBBF24", // amber-400
  typeTipBg: "rgba(251,191,36,0.10)",
  typeTipBorder: "rgba(251,191,36,0.20)",

  typeAnalogy: "#C084FC", // purple-400
  typeAnalogyBg: "rgba(192,132,252,0.10)",
  typeAnalogyBorder: "rgba(192,132,252,0.20)",

  typeFact: "#FB923C", // orange-400
  typeFactBg: "rgba(251,146,60,0.10)",
  typeFactBorder: "rgba(251,146,60,0.20)",

  // ── Difficulty colours (match badge system) ────────────────────────────────
  diffBeginner: "#4ADE80",
  diffBeginnerBg: "rgba(74,222,128,0.10)",
  diffBeginnerBorder: "rgba(74,222,128,0.20)",

  diffIntermediate: "#FBBF24",
  diffIntermediateBg: "rgba(251,191,36,0.10)",
  diffIntermediateBorder: "rgba(251,191,36,0.20)",

  diffAdvanced: "#F87171",
  diffAdvancedBg: "rgba(248,113,113,0.10)",
  diffAdvancedBorder: "rgba(248,113,113,0.20)",
} as const;

// ─── CSS variable references ──────────────────────────────────────────────────
// Use these in style={{ }} when you need a CSS variable

export const cssVars = {
  bgBase: "var(--ds-bg-base)",
  bgSurface: "var(--ds-bg-surface)",
  bgCard: "var(--ds-bg-card)",
  bgElevated: "var(--ds-bg-elevated)",

  primary: "var(--ds-primary)",
  primaryGlow: "var(--ds-primary-glow)",
  primaryBorder: "var(--ds-primary-border)",

  textPrimary: "var(--ds-text-primary)",
  textSecondary: "var(--ds-text-secondary)",
  textMuted: "var(--ds-text-muted)",
  textSubtle: "var(--ds-text-subtle)",

  borderDefault: "var(--ds-border-default)",
  borderSubtle: "var(--ds-border-subtle)",

  gotIt: "var(--ds-got-it)",
  needHelp: "var(--ds-need-help)",
  showAgain: "var(--ds-show-again)",

  quizCorrect: "var(--ds-quiz-correct)",
  quizIncorrect: "var(--ds-quiz-incorrect)",

  achievement: "var(--ds-achievement)",
} as const;

// ─── Typography scale ─────────────────────────────────────────────────────────

export const typography = {
  // Families (via CSS vars from Next.js font system)
  fontHeading: "var(--font-heading)", // Space Grotesk
  fontBody: "var(--font-body)", // DM Sans
  fontMono: "var(--font-mono)", // JetBrains Mono

  // Size scale
  sizeXs: "0.75rem", // 12px — metadata, captions
  sizeSm: "0.875rem", // 14px — badges, labels, small UI
  sizeBase: "1rem", // 16px — body text minimum (WCAG)
  sizeLg: "1.125rem", // 18px — lead / emphasis text
  sizeXl: "1.25rem", // 20px — quiz questions
  size2xl: "1.5rem", // 24px — card sub-titles
  size3xl: "1.875rem", // 30px — lesson titles (mobile)
  size4xl: "2.25rem", // 36px — lesson titles (desktop)

  // Line heights
  leadingTight: "1.25", // headings
  leadingSnug: "1.375", // sub-headings
  leadingNormal: "1.5", // UI text
  leadingRelaxed: "1.65", // body paragraphs (optimal 60–70 char lines)
  leadingLoose: "1.8", // long-form reading

  // Letter spacing
  trackingTight: "-0.02em",
  trackingNormal: "0em",
  trackingWide: "0.04em",
  trackingWidest: "0.10em",

  // Max line lengths (for readability)
  maxLineWidth: "62ch", // body text
  maxCodeWidth: "80ch", // code blocks
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
} as const;

// ─── Border radii ─────────────────────────────────────────────────────────────

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "28px",
  full: "9999px",
} as const;

// ─── Shadows & glows ─────────────────────────────────────────────────────────

export const shadows = {
  card: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.40)",
  cardHover: "0 0 0 1px rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.50)",
  elevated: "0 0 0 1px rgba(255,255,255,0.10), 0 12px 48px rgba(0,0,0,0.60)",
  primary: "0 0 0 1px rgba(99,102,241,0.30), 0 0 24px rgba(99,102,241,0.14)",
  glowPrimary: "0 0 32px rgba(99,102,241,0.22)",
  glowGotIt: "0 0 24px rgba(34,197,94,0.18)",
  glowAchievement: "0 0 48px rgba(234,179,8,0.22)",
  insetCode: "inset 0 0 24px rgba(0,0,0,0.30)",
} as const;

// ─── Animation durations (seconds for Framer Motion) ─────────────────────────

export const durations = {
  instant: 0,
  fast: 0.15, // 150ms — micro-interactions, button taps
  normal: 0.25, // 250ms — standard transitions
  slow: 0.35, // 350ms — card enter/exit
  emphasis: 0.5, // 500ms — complex sequences
  reveal: 0.7, // 700ms — progress bars, stat reveals
} as const;

// ─── Framer Motion spring presets ─────────────────────────────────────────────

export const springs = {
  // Snappy — button taps, badge pops
  snappy: { type: "spring", stiffness: 450, damping: 30 } as const,
  // Bouncy — card entries, achievements
  bouncy: { type: "spring", stiffness: 320, damping: 22 } as const,
  // Smooth — overlays, drawers
  smooth: { type: "spring", stiffness: 260, damping: 28 } as const,
  // Gentle — content reveals
  gentle: { type: "spring", stiffness: 200, damping: 30 } as const,
  // Swipe exit — confidence card fling
  swipeFling: { type: "spring", stiffness: 280, damping: 20 } as const,
  // Swipe drag — resistance feedback
  swipeDrag: { type: "spring", stiffness: 400, damping: 40 } as const,
} as const;
