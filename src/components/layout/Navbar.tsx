"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  // Hide on full-screen feed pages
  if (pathname.endsWith("/feed")) return null;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-75"
          style={{ color: "#111827", fontSize: "0.9375rem" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#6366F1" }}
          >
            <BookOpen size={14} strokeWidth={2.5} style={{ color: "#fff" }} />
          </div>
          The Book of Something
        </Link>

        <Link
          href="/"
          className="text-sm font-medium transition-colors"
          style={{ color: "#6B7280" }}
        >
          Browse Courses
        </Link>
      </div>
    </header>
  );
}
