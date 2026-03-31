"use client";

import { useCallback } from "react";

export function useConfetti() {
  const triggerConfetti = useCallback(async () => {
    const confetti = (await import("canvas-confetti")).default;
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return { triggerConfetti };
}
