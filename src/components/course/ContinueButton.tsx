"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors font-medium text-sm cursor-pointer"
      >
        Continue where you left off
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}
