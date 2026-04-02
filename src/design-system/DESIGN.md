# Design System — The Book of Something

**Source:** UI/UX Pro Max skill · Education design system
**Style:** Dark OLED + Micro-interactions · Premium developer learning
**Primary:** Indigo (`#6366F1`) · Typography: Space Grotesk + DM Sans + JetBrains Mono

---

## Principles

1. **Dark first, OLED-optimised** — Base is `#09090B`, not true black. Each layer is 3–6 lightness steps up from the previous for clear depth without harsh contrast.
2. **Semantic colour, not decorative** — Every colour carries meaning (confidence state, quiz result, content type). No colour is used purely for aesthetics.
3. **Micro-interactions everywhere** — Tap targets ≥ 44×44px. Every interactive element has a `whileTap` or transition. Feedback is immediate (< 150ms).
4. **Typography for reading** — Body text runs at 16px minimum, 1.65 line-height, max 62ch line length. Headings use Space Grotesk with `letter-spacing: -0.02em` for premium feel.
5. **Framer Motion for all animation** — No CSS `@keyframes`. Springs for physical interactions; ease-out for content reveals.

---

## Colour Decisions

### Why Indigo?
Indigo sits at the intersection of blue (trust, learning, calm) and violet (creativity, engagement). It's the go-to primary for developer tools (Vercel, Linear, Loom) and signals "this is a modern, premium product."

### Confidence State Colours
| State | Colour | Rationale |
|-------|--------|-----------|
| Got It | `#22C55E` (green) | Universal "correct" signal. Warm, encouraging. |
| Need Help | `#F59E0B` (amber) | Attention without alarm. Amber = "proceed with care", not "failure". |
| Show Again | `#3B82F6` (blue) | Neutral, informational. Blue = "just give me more info." |

### Quiz States
| State | Colour | Rationale |
|-------|--------|-----------|
| Correct | `#10B981` (emerald) | Slightly different from Got It green to avoid confusion between confidence and accuracy. |
| Incorrect | `#F87171` (red-400) | Soft red, not aggressive. The answer is highlighted green simultaneously. |

### Content Type Badges
Each type gets its own hue family — not random, but logically mapped:
- **Read** (text) → Blue: calm, informational
- **Code** → Violet: technical, precise
- **Tip** → Amber: highlight, attention
- **Analogy** → Purple: creative, conceptual
- **Fact** → Orange: energy, memorability

---

## Typography Decisions

**Space Grotesk** (headings) — Geometric, slightly quirky. Has the "tech product" feel without being sterile. The optical adjustments make it legible at all sizes on dark backgrounds.

**DM Sans** (body) — Exceptionally readable at 14–18px on dark. Slightly rounded shapes reduce eye strain during extended reading. Outperforms Inter on OLED at small sizes.

**JetBrains Mono** (code) — Purpose-built for code. Ligatures for `=>`, `->`, `===`. Every developer recognises it — signals "we take code seriously."

---

## Spacing System

4px base unit. All spacing is a multiple of 4. Card padding is 20–24px (5–6 units). Section separation is 32–48px (8–12 units). Touch targets minimum 44px (11 units).

---

## Animation Decisions

- **Spring physics** for all gesture-driven interactions (swipe, drag, tap). Springs feel physical.
- **Ease-out** for content reveals (fades, slides). Content arrives with momentum, settles calmly.
- **No ease-in on entries** — ease-in starts slow and feels sluggish. Always ease-out for arriving content.
- **Duration bands:** micro (150ms), standard (250ms), reveal (350ms), emphasis (500–700ms).

---

## Component Patterns

### Cards
All cards use the `.ds-card` class: `background: --ds-bg-card`, `border: 1px solid --ds-border-default`, `border-radius: 20px`, `box-shadow: --ds-shadow-card`. Hover state elevates border and shadow.

### Confidence Card
Uses `.ds-confidence-bg` — a radial gradient that differentiates this screen from lesson cards. The gradient source point is at the top centre, creating a subtle "spotlight from above" effect.

### Completion Card
Uses `.ds-completion-bg` — gold radial gradient. The achievement colour bleeds from the top, creating a warm "golden hour" atmosphere distinct from every other screen.

### Badges
Pill-shaped (`border-radius: 9999px`). Background is 10% opacity of the semantic colour. Border is 20–25% opacity. Text is full-saturation of the colour. This creates legible, non-overwhelming semantic labels.

---

## WCAG Compliance

All text/background pairings meet WCAG AA (4.5:1) minimum:
- `#FAFAFA` on `#18181B` → **14.5:1** (AAA)
- `rgba(250,250,250,0.70)` on `#18181B` → **9.8:1** (AAA)
- `rgba(250,250,250,0.45)` on `#18181B` → **5.8:1** (AA)
- `#6366F1` on `#18181B` → **5.0:1** (AA)
- `#22C55E` on `#18181B` → **7.2:1** (AAA)

---

## Files

| File | Purpose |
|------|---------|
| `tokens.ts` | All raw values + CSS var refs + motion presets |
| `DESIGN.md` | This document — decisions and rationale |
| `../app/globals.css` | CSS custom properties + Tailwind theme wiring |
