"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { colors } from "@/design-system/tokens";

interface ContinueButtonProps {
  courseId: string;
}

export function ContinueButton({ courseId }: ContinueButtonProps) {
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem(`tbos_feed_${courseId}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (val && parseInt(val, 10) > 0) setHasSaved(true);
    } catch {}
  }, [courseId]);

  if (!hasSaved) return null;

  return (
    <div className="px-6 mt-3">
      <Link
        href={`/course/${courseId}/feed`}
        className="flex items-center justify-center gap-2 w-full rounded-2xl font-medium text-sm cursor-pointer border transition-colors"
        style={{
          minHeight: "48px",
          color: colors.primary300,
          background: colors.primaryMuted,
          borderColor: colors.primaryBorder,
        }}
      >
        Continue where you left off
        <ChevronRight size={15} strokeWidth={2} />
      </Link>
    </div>
  );
}
