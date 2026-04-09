"use client";

import { motion, useReducedMotion } from "framer-motion";
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

// Apply bold, inline-code, and ✅ formatting to a string
function applyInline(text: string): string {
  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      `<strong style="color:${colors.textPrimary};font-weight:600">$1</strong>`
    )
    .replace(
      /`([^`]+)`/g,
      `<code style="background:${colors.codeBlockBg};color:${colors.codeText};padding:1px 5px;border-radius:5px;font-size:0.85em;font-family:var(--font-mono)">$1</code>`
    )
    .replace(/^✅\s/, `<span style="color:${colors.quizCorrect}">✅ </span>`);
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith("|");
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s|:|-]+\|$/.test(line.trim());
}

function parseTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function renderTextLines(lines: string[], blockKey: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Detect table: current line is a table row and the next is a separator
    if (
      isTableRow(line) &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }

      const [headerLine, , ...dataLines] = tableLines; // skip separator at index 1
      const headers = parseTableCells(headerLine);
      const rows = dataLines.map(parseTableCells);

      nodes.push(
        <div
          key={`${blockKey}-t${i}`}
          className="overflow-x-auto scrollbar-thin my-3"
          style={{
            borderRadius: "10px",
            border: `1px solid ${colors.borderDefault}`,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr style={{ background: colors.bgElevated }}>
                {headers.map((cell, ci) => (
                  <th
                    key={ci}
                    style={{
                      padding: "8px 14px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: colors.textPrimary,
                      borderBottom: `1px solid ${colors.borderDefault}`,
                      whiteSpace: "nowrap",
                    }}
                    dangerouslySetInnerHTML={{ __html: applyInline(cell) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  style={{
                    background: ri % 2 === 0 ? "transparent" : colors.bgSurface,
                  }}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "7px 14px",
                        color: colors.textSecondary,
                        borderBottom:
                          ri < rows.length - 1
                            ? `1px solid ${colors.borderSubtle}`
                            : "none",
                      }}
                      dangerouslySetInnerHTML={{ __html: applyInline(cell) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Regular line rendering
    const html = applyInline(line);

    if (line.startsWith("- ") || line.startsWith("• ")) {
      nodes.push(
        <li
          key={`${blockKey}-${i}`}
          className="ml-5"
          style={{
            color: colors.textSecondary,
            lineHeight: "1.7",
            marginBottom: "6px",
            listStyleType: "disc",
          }}
          dangerouslySetInnerHTML={{ __html: applyInline(line.slice(2)) }}
        />
      );
    } else if (line.trim() === "") {
      nodes.push(<div key={`${blockKey}-${i}`} style={{ height: "0.6em" }} />);
    } else {
      nodes.push(
        <p
          key={`${blockKey}-${i}`}
          style={{ color: colors.textSecondary, lineHeight: "1.7" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    i++;
  }

  return nodes;
}

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

    return (
      <div
        key={i}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {renderTextLines(part.split("\n"), String(i))}
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
  const shouldReduce = useReducedMotion();
  const typeInfo = typeConfig[post.type];
  const content = post.content[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
      animate={
        isActive
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: shouldReduce ? 0 : 24 }
      }
      transition={
        shouldReduce
          ? { duration: 0 }
          : isActive
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
