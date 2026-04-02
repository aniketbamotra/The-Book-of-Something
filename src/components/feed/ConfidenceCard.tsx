"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { ConfidenceResult } from "@/types";
import { colors, springs } from "@/design-system/tokens";

interface ConfidenceCardProps {
  conceptTitle: string;
  checkpointIndex: number;
  onChoice: (result: ConfidenceResult) => void;
}

// ─── Option config ────────────────────────────────────────────────────────────

const options: {
  result: ConfidenceResult;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  tint: string;
}[] = [
  {
    result: "need_help",
    label: "Still fuzzy",
    sublabel: "I need more practice",
    icon: <HelpCircle size={22} strokeWidth={1.75} />,
    color: colors.needHelp500,
    bg: colors.needHelpBg,
    border: colors.needHelpBorder,
    tint: "rgba(245,158,11,0.10)",
  },
  {
    result: "show_again",
    label: "See it again",
    sublabel: "One more look",
    icon: <RotateCcw size={22} strokeWidth={1.75} />,
    color: colors.showAgain500,
    bg: colors.showAgainBg,
    border: colors.showAgainBorder,
    tint: "rgba(59,130,246,0.10)",
  },
  {
    result: "got_it",
    label: "I got this",
    sublabel: "Ready to move on",
    icon: <CheckCircle2 size={22} strokeWidth={1.75} />,
    color: colors.gotIt500,
    bg: colors.gotItBg,
    border: colors.gotItBorder,
    tint: "rgba(34,197,94,0.10)",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfidenceCard({
  conceptTitle,
  checkpointIndex,
  onChoice,
}: ConfidenceCardProps) {
  const [chosen, setChosen] = useState<ConfidenceResult | null>(null);
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  function handleChoice(result: ConfidenceResult) {
    if (chosen) return;
    setChosen(result);
    setTimeout(() => onChoice(result), 420);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (
      !isDragging.current &&
      Math.abs(dx) > Math.abs(dy) &&
      Math.abs(dx) > 10
    ) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      e.preventDefault();
      setDragX(dx);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    setDragX(0);
    isDragging.current = false;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      handleChoice(dx > 0 ? "got_it" : "need_help");
    }
  }

  const exitX = chosen === "got_it" ? 440 : chosen === "need_help" ? -440 : 0;
  const exitY = chosen === "show_again" ? -60 : 0;

  // Tint overlay color based on drag direction or choice
  const tintColor =
    chosen === "got_it" || dragX > 40
      ? colors.gotItBg
      : chosen === "need_help" || dragX < -40
        ? colors.needHelpBg
        : "transparent";

  const tintOpacity = chosen ? 1 : Math.min(Math.abs(dragX) / 120, 1);

  return (
    <div
      className="ds-confidence-bg h-full flex flex-col items-center justify-center px-5 pt-16 pb-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Drag tint overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {(Math.abs(dragX) > 20 || chosen) && (
          <motion.div
            key="tint"
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: tintOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${tintColor} 0%, transparent 75%)`,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-sm relative z-10"
        animate={
          chosen
            ? { x: exitX, y: exitY, opacity: 0, scale: 0.88 }
            : { x: dragX, rotate: dragX * 0.035, opacity: 1, scale: 1 }
        }
        transition={chosen ? springs.swipeFling : springs.swipeDrag}
      >
        {/* ── Checkpoint badge ──────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border mb-4"
            style={{
              color: colors.primary400,
              background: colors.primaryMuted,
              borderColor: colors.primaryBorder,
            }}
          >
            Checkpoint {checkpointIndex + 1}
          </div>

          <h2
            className="font-bold leading-snug mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.25rem, 4vw, 1.65rem)",
              letterSpacing: "-0.02em",
              color: colors.textPrimary,
            }}
          >
            How confident do you feel?
          </h2>

          <p
            className="font-medium leading-snug px-2"
            style={{
              fontSize: "1rem",
              color: colors.primary300,
            }}
          >
            {conceptTitle}
          </p>
        </div>

        {/* ── Swipe direction hints ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 px-1">
          <motion.span
            className="flex items-center gap-1 text-xs font-medium"
            animate={{
              color:
                dragX < -30 ? colors.needHelp400 : "rgba(250,250,250,0.22)",
              x: dragX < -30 ? -3 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            <ArrowLeft size={12} />
            Still fuzzy
          </motion.span>
          <motion.span
            className="flex items-center gap-1 text-xs font-medium"
            animate={{
              color: dragX > 30 ? colors.gotIt400 : "rgba(250,250,250,0.22)",
              x: dragX > 30 ? 3 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            I got this
            <ArrowRight size={12} />
          </motion.span>
        </div>

        {/* ── Option cards ──────────────────────────────────────────────── */}
        <div
          className="rounded-3xl p-4"
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.borderDefault}`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.40)",
          }}
        >
          <div className="flex flex-col gap-2.5">
            {options.map((opt) => (
              <motion.button
                key={opt.result}
                onClick={() => handleChoice(opt.result)}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 w-full rounded-2xl border text-left cursor-pointer"
                style={{
                  minHeight: "72px",
                  padding: "14px 16px",
                  color: opt.color,
                  background: opt.bg,
                  borderColor: opt.border,
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <span style={{ flexShrink: 0 }}>{opt.icon}</span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className="font-semibold"
                    style={{ fontSize: "0.9375rem", lineHeight: "1.3" }}
                  >
                    {opt.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(250,250,250,0.40)",
                      lineHeight: "1.3",
                    }}
                  >
                    {opt.sublabel}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>

          <p
            className="text-center mt-3"
            style={{ fontSize: "0.6875rem", color: "rgba(250,250,250,0.20)" }}
          >
            Swipe ← → or tap an option
          </p>
        </div>
      </motion.div>
    </div>
  );
}
