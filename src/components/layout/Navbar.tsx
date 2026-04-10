"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { colors } from "@/design-system/tokens";

export function Navbar() {
  const pathname = usePathname();
  // Hide on full-screen feed pages
  if (pathname.endsWith("/feed")) return null;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255,249,245,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.borderSubtle}`,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded-lg"
          aria-label="The Book of Something — home"
        >
          <Logo size="sm" variant="light" />
        </Link>

        <Link
          href="/"
          className="text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 rounded-md"
          style={{ color: colors.textMuted }}
        >
          Browse Courses
        </Link>
      </div>
    </header>
  );
}
