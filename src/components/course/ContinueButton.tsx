"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

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
    <Link
      href={`/course/${courseId}/feed`}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm cursor-pointer border transition-colors"
      style={{
        color: "#6366F1",
        background: "rgba(99,102,241,0.06)",
        borderColor: "rgba(99,102,241,0.18)",
      }}
    >
      <Play size={13} strokeWidth={2.5} />
      Continue where you left off
    </Link>
  );
}
