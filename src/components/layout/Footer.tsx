"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.endsWith("/feed")) return null;

  return (
    <footer
      className="w-full mt-auto"
      style={{
        borderTop: "1px solid #F3F4F6",
        background: "#F9FAFB",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm" style={{ color: "#111827" }}>
            The Book of Something
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Learn anything, one scroll at a time.
          </p>
        </div>
        <p className="text-xs" style={{ color: "#D1D5DB" }}>
          © {new Date().getFullYear()} The Book of Something
        </p>
      </div>
    </footer>
  );
}
