"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Lightbulb,
  RefreshCw,
  Zap,
  ChevronUp,
} from "lucide-react";
import type { LessonPost, DifficultyLevel } from "@/types";
import { colors } from "@/design-system/tokens";

interface PostCardProps {
  post: LessonPost;
  difficulty: DifficultyLevel;
  isActive: boolean;
  totalPosts: number;
}

const typeConfig: Record<
  LessonPost["type"],
  {
    icon: React.ReactNode;
    label: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  text: {
    icon: <BookOpen size={13} strokeWidth={2} />,
    label: "Read",
    textColor: colors.typeText,
    bgColor: colors.typeTextBg,
    borderColor: colors.typeTextBorder,
  },
  code: {
    icon: <Code2 size={13} strokeWidth={2} />,
    label: "Code",
    textColor: colors.typeCode,
    bgColor: colors.typeCodeBg,
    borderColor: colors.typeCodeBorder,
  },
  tip: {
    icon: <Lightbulb size={13} strokeWidth={2} />,
    label: "Tip",
    textColor: colors.typeTip,
    bgColor: colors.typeTipBg,
    borderColor: colors.typeTipBorder,
  },
  analogy: {
    icon: <RefreshCw size={13} strokeWidth={2} />,
    label: "Analogy",
    textColor: colors.typeAnalogy,
    bgColor: colors.typeAnalogyBg,
    borderColor: colors.typeAnalogyBorder,
  },
  fact: {
    icon: <Zap size={13} strokeWidth={2} />,
    label: "Fact",
    textColor: colors.typeFact,
    bgColor: colors.typeFactBg,
    borderColor: colors.typeFactBorder,
  },
};

function renderContent(
  content: string,
  type: LessonPost["type"],
  codeLanguage?: string
) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0] || codeLanguage || "";
      const code = lines.slice(1).join("\n");
      return (
        <pre
          key={i}
          className="code-block rounded-xl p-4 overflow-x-auto scrollbar-thin my-4"
          style={{
            background: colors.codeBlockBg,
            fontSize: "0.8125rem",
            lineHeight: "1.75",
            fontFamily: "var(--font-mono), JetBrains Mono, monospace",
            border: `1px solid ${colors.codeBlockBorder}`,
          }}
        >
          {lang && (
            <div
              className="mb-3 uppercase tracking-widest"
              style={{
                fontSize: "0.625rem",
                color: colors.codeLabel,
                letterSpacing: "0.1em",
              }}
            >
              {lang}
            </div>
          )}
          <code style={{ color: colors.codeText }}>{code}</code>
        </pre>
      );
    }

    const rendered = part.split("\n").map((line, j) => {
      const formatted = line.replace(
        /\*\*(.*?)\*\*/g,
        `<strong style="color:${colors.textPrimary};font-weight:600">$1</strong>`
      );
      const withCode = formatted.replace(
        /`([^`]+)`/g,
        `<code style="background:${colors.codeBlockBg};color:${colors.codeText};padding:1px 5px;border-radius:5px;font-size:0.85em;font-family:var(--font-mono)">$1</code>`
      );
      const withChecks = withCode.replace(
        /^✅\s/,
        `<span style="color:${colors.quizCorrect}">✅ </span>`
      );

      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <li
            key={j}
            className="ml-5"
            style={{
              color: colors.textSecondary,
              lineHeight: "1.7",
              marginBottom: "6px",
              listStyleType: "disc",
            }}
            dangerouslySetInnerHTML={{ __html: withCode.slice(2) }}
          />
        );
      }
      if (line.trim() === "")
        return <div key={j} style={{ height: "0.6em" }} />;
      return (
        <p
          key={j}
          style={{ color: colors.textSecondary, lineHeight: "1.7" }}
          dangerouslySetInnerHTML={{ __html: withChecks }}
        />
      );
    });

    return (
      <div
        key={i}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {rendered}
      </div>
    );
  });
}

export function PostCard({
  post,
  difficulty,
  isActive,
  totalPosts,
}: PostCardProps) {
  const typeInfo = typeConfig[post.type];
  const content = post.content[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={
        isActive
          ? { type: "spring", stiffness: 300, damping: 26, delay: 0.04 }
          : { duration: 0.18 }
      }
      className="h-full flex flex-col max-w-2xl mx-auto w-full px-5"
      style={{ paddingTop: "72px", paddingBottom: "24px" }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
          style={{
            color: typeInfo.textColor,
            background: typeInfo.bgColor,
            borderColor: typeInfo.borderColor,
          }}
        >
          {typeInfo.icon}
          {typeInfo.label}
        </span>
        <span
          className="text-xs tabular-nums font-medium px-2.5 py-1 rounded-full border"
          style={{
            color: colors.textSubtle,
            background: colors.bgSurface,
            borderColor: colors.borderDefault,
          }}
        >
          {post.order} / {totalPosts}
        </span>
      </div>

      {/* ── Centered content area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="font-bold leading-tight mb-5 flex-shrink-0"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.65rem, 4.5vw, 2.25rem)",
            letterSpacing: "-0.025em",
            color: colors.textPrimary,
          }}
        >
          {post.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.36 }}
          className="overflow-y-auto scrollbar-thin"
          style={{ fontSize: "1.0625rem" }}
        >
          {renderContent(content, post.type, post.codeLanguage)}
        </motion.div>
      </div>

      {/* ── Footer hint ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.34, duration: 0.26 }}
        className="mt-4 flex-shrink-0 flex justify-end"
      >
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: colors.textSubtle }}
        >
          <ChevronUp size={12} />
          Swipe up
        </span>
      </motion.div>
    </motion.div>
  );
}
