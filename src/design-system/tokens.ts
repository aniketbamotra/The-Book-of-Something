/**
 * Design Tokens — The Book of Something
 *
 * Source of truth for every visual value in the app.
 * Education design system: clean white light theme, indigo accent, gray text hierarchy.
 * Inspired by Linear, Vercel, Duolingo. Audience: developers, designers, general learners.
 */

export const colors = {
  // Backgrounds — clean white, gray-50 surface
  bgBase: "#FFFFFF",
  bgSurface: "#F9FAFB", // gray-50
  bgCard: "#FFFFFF",
  bgElevated: "#F3F4F6", // gray-100

  // Primary — Indigo brand
  primary300: "#A5B4FC",
  primary400: "#818CF8",
  primary500: "#6366F1",
  primary600: "#4F46E5",
  primaryGlow: "rgba(99,102,241,0.12)",
  primaryBorder: "rgba(99,102,241,0.20)",
  primaryMuted: "rgba(99,102,241,0.08)",

  // Text hierarchy (gray-based, WCAG AA compliant on white)
  textPrimary: "#111827", // gray-900 — headings
  textSecondary: "#374151", // gray-700 — body
  textMuted: "#6B7280", // gray-500 — meta
  textSubtle: "#9CA3AF", // gray-400 — hints
  textDisabled: "#D1D5DB", // gray-300

  // Borders — gray-based
  borderSubtle: "#F3F4F6", // gray-100
  borderDefault: "#E5E7EB", // gray-200
  borderStrong: "#D1D5DB", // gray-300

  // ── Confidence states ─────────────────────────────────────────────────────
  gotIt500: "#16A34A",
  gotIt400: "#22C55E",
  gotItBg: "rgba(22,163,74,0.08)",
  gotItBorder: "rgba(22,163,74,0.22)",
  gotItGlow: "rgba(22,163,74,0.12)",

  needHelp500: "#D97706",
  needHelp400: "#F59E0B",
  needHelpBg: "rgba(217,119,6,0.08)",
  needHelpBorder: "rgba(217,119,6,0.22)",

  showAgain500: "#2563EB",
  showAgain400: "#3B82F6",
  showAgainBg: "rgba(37,99,235,0.08)",
  showAgainBorder: "rgba(37,99,235,0.22)",

  // ── Quiz states ───────────────────────────────────────────────────────────
  quizCorrect: "#15803D",
  quizCorrectBg: "rgba(21,128,61,0.08)",
  quizCorrectBorder: "#15803D",
  quizCorrectGlow: "rgba(21,128,61,0.12)",

  quizIncorrect: "#DC2626",
  quizIncorrectBg: "rgba(220,38,38,0.08)",
  quizIncorrectBorder: "#DC2626",

  quizNeutral: "rgba(99,102,241,0.04)",
  quizNeutralBorder: "rgba(99,102,241,0.14)",

  // ── Achievement ───────────────────────────────────────────────────────────
  achievement: "#D97706",
  achievementLight: "#F59E0B",
  achievementBg: "rgba(217,119,6,0.08)",
  achievementGlow: "rgba(217,119,6,0.18)",

  // ── Content type badges ───────────────────────────────────────────────────
  typeText: "#2563EB",
  typeTextBg: "rgba(37,99,235,0.07)",
  typeTextBorder: "rgba(37,99,235,0.18)",

  typeCode: "#7C3AED",
  typeCodeBg: "rgba(124,58,237,0.07)",
  typeCodeBorder: "rgba(124,58,237,0.18)",

  typeTip: "#D97706",
  typeTipBg: "rgba(217,119,6,0.07)",
  typeTipBorder: "rgba(217,119,6,0.18)",

  typeAnalogy: "#9333EA",
  typeAnalogyBg: "rgba(147,51,234,0.07)",
  typeAnalogyBorder: "rgba(147,51,234,0.18)",

  typeFact: "#EA580C",
  typeFactBg: "rgba(234,88,12,0.07)",
  typeFactBorder: "rgba(234,88,12,0.18)",

  // ── Difficulty ────────────────────────────────────────────────────────────
  diffBeginner: "#16A34A",
  diffBeginnerBg: "rgba(22,163,74,0.08)",
  diffBeginnerBorder: "rgba(22,163,74,0.22)",

  diffIntermediate: "#D97706",
  diffIntermediateBg: "rgba(217,119,6,0.08)",
  diffIntermediateBorder: "rgba(217,119,6,0.22)",

  diffAdvanced: "#DC2626",
  diffAdvancedBg: "rgba(220,38,38,0.08)",
  diffAdvancedBorder: "rgba(220,38,38,0.22)",

  // ── Code blocks — dark (VS Code style, always dark even on light page) ────
  codeBlockBg: "#0F172A", // slate-900
  codeBlockBorder: "#1E293B", // slate-800
  codeText: "#E2E8F0", // slate-200
  codeLabel: "#94A3B8", // slate-400
} as const;

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

export const typography = {
  fontHeading: "var(--font-heading)",
  fontBody: "var(--font-body)",
  fontMono: "var(--font-mono)",
  sizeXs: "0.75rem",
  sizeSm: "0.875rem",
  sizeBase: "1rem",
  sizeLg: "1.125rem",
  sizeXl: "1.25rem",
  size2xl: "1.5rem",
  size3xl: "1.875rem",
  size4xl: "2.25rem",
  leadingTight: "1.25",
  leadingSnug: "1.375",
  leadingNormal: "1.5",
  leadingRelaxed: "1.65",
  leadingLoose: "1.8",
  trackingTight: "-0.02em",
  trackingNormal: "0em",
  trackingWide: "0.04em",
  maxLineWidth: "62ch",
  maxCodeWidth: "80ch",
} as const;

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

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "28px",
  full: "9999px",
} as const;

export const shadows = {
  card: "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
  cardHover: "0 4px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(99,102,241,0.20)",
  elevated: "0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)",
  primary: "0 0 0 1px rgba(99,102,241,0.25), 0 4px 16px rgba(99,102,241,0.18)",
  glowPrimary: "0 0 24px rgba(99,102,241,0.18)",
  glowGotIt: "0 0 20px rgba(22,163,74,0.14)",
  glowAchievement: "0 0 40px rgba(217,119,6,0.18)",
  insetCode: "none",
} as const;

export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  emphasis: 0.5,
  reveal: 0.7,
} as const;

export const springs = {
  snappy: { type: "spring", stiffness: 450, damping: 30 } as const,
  bouncy: { type: "spring", stiffness: 320, damping: 22 } as const,
  smooth: { type: "spring", stiffness: 260, damping: 28 } as const,
  gentle: { type: "spring", stiffness: 200, damping: 30 } as const,
  swipeFling: { type: "spring", stiffness: 280, damping: 20 } as const,
  swipeDrag: { type: "spring", stiffness: 400, damping: 40 } as const,
} as const;
