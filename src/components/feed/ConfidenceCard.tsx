"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, HelpCircle, RefreshCw } from "lucide-react";
import type { ConfidenceResult } from "@/types";

interface ConfidenceCardProps {
  conceptTitle: string;
  checkpointIndex: number;
  onChoice: (result: ConfidenceResult) => void;
}

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
    setTimeout(() => onChoice(result), 380);
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

  const exitX = chosen === "got_it" ? 400 : chosen === "need_help" ? -400 : 0;
  const exitY = chosen === "show_again" ? -60 : 0;

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-6 pt-16 pb-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="w-full max-w-sm"
        animate={
          chosen
            ? { x: exitX, y: exitY, opacity: 0, scale: 0.9 }
            : { x: dragX, rotate: dragX * 0.04, opacity: 1, scale: 1 }
        }
        transition={
          chosen
            ? { type: "spring", damping: 20, stiffness: 280 }
            : { type: "spring", damping: 40, stiffness: 400 }
        }
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs text-indigo-400 font-medium mb-4">
            Checkpoint {checkpointIndex + 1}
          </div>
          <h2 className="text-xl font-bold text-white leading-snug mb-2">
            How confident are you?
          </h2>
          <p className="text-indigo-300 text-lg font-semibold leading-snug px-2">
            {conceptTitle}
          </p>
        </div>

        {/* Swipe hint */}
        <div className="flex items-center justify-between text-white/30 text-xs mb-5 px-1">
          <span className={dragX < -30 ? "text-rose-400 font-medium" : ""}>
            ← Need help
          </span>
          <span className={dragX > 30 ? "text-emerald-400 font-medium" : ""}>
            Got it →
          </span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleChoice("need_help")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <HelpCircle size={22} className="text-rose-400" />
              <span className="text-xs text-rose-400 font-medium leading-tight text-center">
                Need help
              </span>
            </button>

            <button
              onClick={() => handleChoice("show_again")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw size={22} className="text-amber-400" />
              <span className="text-xs text-amber-400 font-medium leading-tight text-center">
                Show again
              </span>
            </button>

            <button
              onClick={() => handleChoice("got_it")}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle size={22} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium leading-tight text-center">
                Got it
              </span>
            </button>
          </div>

          <p className="text-white/25 text-xs text-center mt-4">
            Swipe ← → or tap a button
          </p>
        </div>
      </motion.div>
    </div>
  );
}
