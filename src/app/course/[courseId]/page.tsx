import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, BrainCircuit, ChevronRight } from "lucide-react";
import type { CourseData } from "@/types";
import { getDifficultyLabel } from "@/lib/difficultyEngine";
import { ContinueButton } from "@/components/course/ContinueButton";
import coursesIndex from "@/data/courses.json";

interface Props {
  params: Promise<{ courseId: string }>;
}

async function getCourseData(courseId: string): Promise<CourseData | null> {
  try {
    const data = await import(`@/data/courses/${courseId}.json`);
    return data.default as CourseData;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return coursesIndex.map((c) => ({ courseId: c.id }));
}

const typeColors: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  text: {
    color: "#2563EB",
    bg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.18)",
  },
  code: {
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.18)",
  },
  tip: {
    color: "#D97706",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.18)",
  },
  analogy: {
    color: "#9333EA",
    bg: "rgba(147,51,234,0.07)",
    border: "rgba(147,51,234,0.18)",
  },
  fact: {
    color: "#EA580C",
    bg: "rgba(234,88,12,0.07)",
    border: "rgba(234,88,12,0.18)",
  },
};

const typeLabels: Record<string, string> = {
  text: "Read",
  code: "Code",
  tip: "Tip",
  analogy: "Analogy",
  fact: "Fact",
};

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;
  const data = await getCourseData(courseId);
  if (!data) notFound();

  const { course, posts, quizzes } = data;

  return (
    <div className="bg-background min-h-screen">
      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors rounded-lg px-3 py-1.5 -ml-3"
          style={{ color: "#6B7280", background: "transparent" }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          All Courses
        </Link>
      </div>

      {/* Course hero — constrained width, rounded */}
      <div className="max-w-3xl mx-auto px-6 mt-4">
        <div
          className={`rounded-3xl bg-gradient-to-br ${course.coverGradient} p-8 text-white`}
        >
          <div className="text-5xl mb-4">{course.emoji}</div>
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              letterSpacing: "-0.025em",
            }}
          >
            {course.title}
          </h1>
          <p className="text-white/80 leading-relaxed mb-5 max-w-lg">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              getDifficultyLabel(course.difficulty),
              `${course.estimatedMinutes} min`,
              `${posts.length} lessons`,
              `${quizzes.length} quizzes`,
            ].map((label) => (
              <span
                key={label}
                className="text-sm px-3 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 mt-6 flex flex-col items-center gap-3">
        <Link
          href={`/course/${courseId}/feed`}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "#6366F1",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            fontSize: "1rem",
          }}
        >
          Start Learning
          <ChevronRight size={18} strokeWidth={2.5} />
        </Link>
        <ContinueButton courseId={courseId} />
      </div>

      {/* Lessons list */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div
          className="flex items-center gap-2 mb-5 pb-4"
          style={{ borderBottom: "1px solid #EDE5DE" }}
        >
          <BookOpen size={16} strokeWidth={2} style={{ color: "#6366F1" }} />
          <h2
            className="font-semibold"
            style={{ color: "#111827", fontSize: "1rem" }}
          >
            Lessons
          </h2>
          <span className="ml-auto text-xs" style={{ color: "#9CA3AF" }}>
            {posts.length} total
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {posts.map((post, idx) => {
            const isQuizAfter = quizzes.some(
              (q) => q.afterPostOrder === post.order
            );
            const tc = typeColors[post.type] ?? typeColors.text;
            const tl = typeLabels[post.type] ?? post.type;
            return (
              <div key={post.id}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer"
                  style={{
                    background: idx % 2 === 0 ? "#FFFFFF" : "#FEF5EF",
                    border: "1px solid #F0EBE6",
                  }}
                >
                  <span
                    className="text-xs tabular-nums font-medium w-6 flex-shrink-0 text-center"
                    style={{ color: "#D1D5DB" }}
                  >
                    {post.order}
                  </span>
                  <span className="text-sm flex-1" style={{ color: "#374151" }}>
                    {post.title}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0"
                    style={{
                      color: tc.color,
                      background: tc.bg,
                      borderColor: tc.border,
                    }}
                  >
                    {tl}
                  </span>
                </div>
                {isQuizAfter && (
                  <div
                    className="flex items-center gap-2 py-2 px-4 text-xs"
                    style={{ color: "#D97706" }}
                  >
                    <div
                      className="flex-1 h-px"
                      style={{ background: "rgba(217,119,6,0.18)" }}
                    />
                    <span className="flex items-center gap-1">
                      <BrainCircuit size={11} strokeWidth={2} />
                      Quiz checkpoint
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ background: "rgba(217,119,6,0.18)" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
