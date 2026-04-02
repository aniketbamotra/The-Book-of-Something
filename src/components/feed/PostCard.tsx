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

// ─── Type configuration ───────────────────────────────────────────────────────

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

// ─── Content renderer ─────────────────────────────────────────────────────────

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
          className="code-block rounded-2xl p-4 overflow-x-auto scrollbar-thin my-3"
          style={{
            background: "rgba(0,0,0,0.50)",
            fontSize: "0.8125rem",
            lineHeight: "1.7",
            fontFamily: "var(--font-mono), JetBrains Mono, monospace",
          }}
        >
          {lang && (
            <div
              className="mb-2 uppercase tracking-widest font-sans"
              style={{
                fontSize: "0.6875rem",
                color: colors.typeCode,
                opacity: 0.7,
              }}
            >
              {lang}
            </div>
          )}
          <code style={{ color: "#C4B5FD" }}>{code}</code>
        </pre>
      );
    }

    const rendered = part.split("\n").map((line, j) => {
      const formatted = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color:#FAFAFA;font-weight:600">$1</strong>'
      );
      const withCode = formatted.replace(
        /`([^`]+)`/g,
        `<code style="background:rgba(167,139,250,0.12);color:#C4B5FD;padding:2px 6px;border-radius:6px;font-size:0.875em;font-family:var(--font-mono);border:1px solid rgba(167,139,250,0.18)">$1</code>`
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
              color: "rgba(250,250,250,0.72)",
              lineHeight: "1.65",
              marginBottom: "4px",
              listStyleType: "disc",
            }}
            dangerouslySetInnerHTML={{ __html: withCode.slice(2) }}
          />
        );
      }
      if (line.trim() === "")
        return <div key={j} style={{ height: "0.5em" }} />;
      return (
        <p
          key={j}
          style={{ color: "rgba(250,250,250,0.72)", lineHeight: "1.65" }}
          dangerouslySetInnerHTML={{ __html: withChecks }}
        />
      );
    });

    return (
      <div
        key={i}
        style={{ display: "flex", flexDirection: "column", gap: "6px" }}
      >
        {rendered}
      </div>
    );
  });
}

// ─── Difficulty tokens ────────────────────────────────────────────────────────

function getDiffTokens(diff: DifficultyLevel) {
  if (diff === "beginner")
    return {
      color: colors.diffBeginner,
      bg: colors.diffBeginnerBg,
      border: colors.diffBeginnerBorder,
    };
  if (diff === "intermediate")
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

// ─── Component ────────────────────────────────────────────────────────────────

export function PostCard({
  post,
  difficulty,
  isActive,
  totalPosts,
}: PostCardProps) {
  const typeInfo = typeConfig[post.type];
  const content = post.content[difficulty];
  const diff = getDiffTokens(difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={
        isActive
          ? { type: "spring", stiffness: 300, damping: 26, delay: 0.05 }
          : { duration: 0.18 }
      }
      className="h-full flex flex-col max-w-2xl mx-auto w-full px-5 pt-16 pb-6"
    >
      {/* ── Header row ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
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
            color: "rgba(250,250,250,0.35)",
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {post.order} / {totalPosts}
        </span>
      </div>

      {/* ── Title ───────────────────────────────────────────────── */}
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ delay: 0.12, duration: 0.32 }}
        className="font-bold leading-tight mb-5"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.55rem, 4vw, 2rem)",
          letterSpacing: "-0.025em",
          color: colors.textPrimary,
        }}
      >
        {post.title}
      </motion.h2>

      {/* ── Body ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.22, duration: 0.38 }}
        className="flex-1 overflow-y-auto scrollbar-thin"
        style={{ fontSize: "1rem" }}
      >
        {renderContent(content, post.type, post.codeLanguage)}
      </motion.div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.36, duration: 0.28 }}
        className="mt-auto pt-5 flex items-center justify-between"
      >
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize"
          style={{
            color: diff.color,
            background: diff.bg,
            borderColor: diff.border,
          }}
        >
          {difficulty}
        </span>

        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "rgba(250,250,250,0.22)" }}
        >
          <ChevronUp size={12} />
          Swipe up
        </span>
      </motion.div>
    </motion.div>
  );
}
