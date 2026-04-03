import type { DifficultyLevel } from "@/types";
import { colors } from "@/design-system/tokens";

export function adjustDifficulty(
  current: DifficultyLevel,
  score: number,
  consecutiveHoldCount: number
): { difficulty: DifficultyLevel; consecutiveHoldCount: number } {
  const UPGRADE_THRESHOLD = 0.8;
  const DOWNGRADE_THRESHOLD = 0.4;
  const STREAK_NUDGE = 3;

  if (score >= UPGRADE_THRESHOLD) {
    return {
      difficulty: upgrade(current),
      consecutiveHoldCount: 0,
    };
  }

  if (score <= DOWNGRADE_THRESHOLD) {
    return {
      difficulty: downgrade(current),
      consecutiveHoldCount: 0,
    };
  }

  // Hold zone: 41–79%
  const newCount = consecutiveHoldCount + 1;
  if (newCount >= STREAK_NUDGE) {
    return {
      difficulty: upgrade(current),
      consecutiveHoldCount: 0,
    };
  }

  return { difficulty: current, consecutiveHoldCount: newCount };
}

function upgrade(level: DifficultyLevel): DifficultyLevel {
  if (level === "beginner") return "intermediate";
  if (level === "intermediate") return "advanced";
  return "advanced";
}

function downgrade(level: DifficultyLevel): DifficultyLevel {
  if (level === "advanced") return "intermediate";
  if (level === "intermediate") return "beginner";
  return "beginner";
}

export function getDifficultyLabel(level: DifficultyLevel): string {
  return {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }[level];
}

export function getDiffTokens(level: DifficultyLevel): {
  color: string;
  bg: string;
  border: string;
} {
  if (level === "beginner")
    return {
      color: colors.diffBeginner,
      bg: colors.diffBeginnerBg,
      border: colors.diffBeginnerBorder,
    };
  if (level === "intermediate")
    return {
      color: colors.diffIntermediate,
      bg: colors.diffIntermediateBg,
      border: colors.diffIntermediateBorder,
    };
  return {
    color: colors.diffAdvanced,
    bg: colors.diffAdvancedBg,
    border: colors.diffAdvancedBorder,
  };
}
