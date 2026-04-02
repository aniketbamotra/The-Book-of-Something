/**
 * Design Tokens — The Book of Something
 *
 * Source of truth for every visual value in the app.
 * Education design system: light theme, indigo brand, micro-interactions.
 * Audience: developers, designers, and general learners.
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
  // Backgrounds — light indigo-tinted layers (education design system)
  bgBase: "#F8F7FF", // page background — barely-there lavender
  bgSurface: "#EEF2FF", // lifted surface — light indigo (skill-recommended)
  bgCard: "#FFFFFF", // card / panel — pure white for max contrast
  bgElevated: "#E8ECFB", // modals / dropdowns — slightly deeper

  // Primary — Indigo brand (engagement, trust, learning)
  primary300: "#A5B4FC",
  primary400: "#818CF8", // hover / light accent
  primary500: "#6366F1", // main brand
  primary600: "#4F46E5", // pressed / deep
  primaryGlow: "rgba(99,102,241,0.14)",
  primaryBorder: "rgba(99,102,241,0.22)",
  primaryMuted: "rgba(99,102,241,0.08)",

  // Text — deep indigo (skill recommends #312E81 family)
  textPrimary: "#1E1B4B", // indigo-950
  textSecondary: "rgba(30,27,75,0.68)",
  textMuted: "rgba(30,27,75,0.48)",
  textSubtle: "rgba(30,27,75,0.32)",
  textDisabled: "rgba(30,27,75,0.20)",

  // Borders — indigo-tinted (visible on light backgrounds)
  borderSubtle: "rgba(99,102,241,0.08)",
  borderDefault: "rgba(99,102,241,0.16)",
  borderStrong: "rgba(99,102,241,0.30)",

  // ── Confidence state colours (education core) ──────────────────────────────
  // Got It — green → confidence & success
  gotIt500: "#16A34A", // green-600 (darker for light bg)
  gotIt400: "#22C55E", // green-500
  gotItBg: "rgba(22,163,74,0.08)",
  gotItBorder: "rgba(22,163,74,0.22)",
  gotItGlow: "rgba(22,163,74,0.12)",

  // Need Help — amber → attention without alarm
  needHelp500: "#D97706", // amber-600 (darker for light bg)
  needHelp400: "#F59E0B", // amber-500
  needHelpBg: "rgba(217,119,6,0.08)",
  needHelpBorder: "rgba(217,119,6,0.22)",

  // Show Again — blue → neutral, informational replay
  showAgain500: "#2563EB", // blue-600 (darker for light bg)
  showAgain400: "#3B82F6", // blue-500
  showAgainBg: "rgba(37,99,235,0.08)",
  showAgainBorder: "rgba(37,99,235,0.22)",

  // ── Quiz states ────────────────────────────────────────────────────────────
  quizCorrect: "#15803D", // green-700 — readable on white
  quizCorrectBg: "rgba(21,128,61,0.08)",
  quizCorrectBorder: "#15803D",
  quizCorrectGlow: "rgba(21,128,61,0.12)",

  quizIncorrect: "#DC2626", // red-600 — readable on white
  quizIncorrectBg: "rgba(220,38,38,0.08)",
  quizIncorrectBorder: "#DC2626",

  quizNeutral: "rgba(99,102,241,0.04)",
  quizNeutralBorder: "rgba(99,102,241,0.14)",

  // ── Achievement / completion ───────────────────────────────────────────────
  achievement: "#D97706", // amber-600
  achievementLight: "#F59E0B", // amber-500
  achievementBg: "rgba(217,119,6,0.08)",
  achievementGlow: "rgba(217,119,6,0.18)",

  // ── Content type badge colours — darker variants for light backgrounds ─────
  typeText: "#2563EB", // blue-600
  typeTextBg: "rgba(37,99,235,0.07)",
  typeTextBorder: "rgba(37,99,235,0.18)",

  typeCode: "#7C3AED", // violet-600
  typeCodeBg: "rgba(124,58,237,0.07)",
  typeCodeBorder: "rgba(124,58,237,0.18)",

  typeTip: "#D97706", // amber-600
  typeTipBg: "rgba(217,119,6,0.07)",
  typeTipBorder: "rgba(217,119,6,0.18)",

  typeAnalogy: "#9333EA", // purple-600
  typeAnalogyBg: "rgba(147,51,234,0.07)",
  typeAnalogyBorder: "rgba(147,51,234,0.18)",

  typeFact: "#EA580C", // orange-600
  typeFactBg: "rgba(234,88,12,0.07)",
  typeFactBorder: "rgba(234,88,12,0.18)",

  // ── Difficulty colours — darker for light backgrounds ──────────────────────
  diffBeginner: "#16A34A", // green-600
  diffBeginnerBg: "rgba(22,163,74,0.08)",
  diffBeginnerBorder: "rgba(22,163,74,0.22)",

  diffIntermediate: "#D97706", // amber-600
  diffIntermediateBg: "rgba(217,119,6,0.08)",
  diffIntermediateBorder: "rgba(217,119,6,0.22)",

  diffAdvanced: "#DC2626", // red-600
  diffAdvancedBg: "rgba(220,38,38,0.08)",
  diffAdvancedBorder: "rgba(220,38,38,0.22)",

  // ── Code block ────────────────────────────────────────────────────────────
  codeBlockBg: "#F0EEFF", // very light indigo — code bg on light theme
  codeBlockBorder: "rgba(124,58,237,0.22)",
  codeText: "#5B21B6", // violet-700 — readable code on light bg
  codeLabel: "#7C3AED", // violet-600 — language label
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

// ─── Shadows & glows — light mode (indigo-tinted, no harsh dark shadows) ─────

export const shadows = {
  card: "0 0 0 1px rgba(99,102,241,0.10), 0 4px 24px rgba(99,102,241,0.07)",
  cardHover:
    "0 0 0 1px rgba(99,102,241,0.18), 0 8px 32px rgba(99,102,241,0.12)",
  elevated:
    "0 0 0 1px rgba(99,102,241,0.14), 0 12px 48px rgba(99,102,241,0.10)",
  primary: "0 0 0 1px rgba(99,102,241,0.25), 0 0 24px rgba(99,102,241,0.14)",
  glowPrimary: "0 0 32px rgba(99,102,241,0.18)",
  glowGotIt: "0 0 24px rgba(22,163,74,0.14)",
  glowAchievement: "0 0 48px rgba(217,119,6,0.18)",
  insetCode: "inset 0 0 24px rgba(99,102,241,0.06)",
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
