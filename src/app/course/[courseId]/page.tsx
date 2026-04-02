import { notFound } from "next/navigation";
import Link from "next/link";
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

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;
  const data = await getCourseData(courseId);
  if (!data) notFound();

  const { course, posts, quizzes } = data;

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* back */}
      <div className="px-6 pt-6">
        <Link
          href="/"
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          ← All Courses
        </Link>
      </div>

      {/* hero */}
      <div
        className={`mx-6 mt-6 rounded-3xl bg-gradient-to-br ${course.coverGradient} p-8 text-white`}
      >
        <div className="text-6xl mb-4">{course.emoji}</div>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-white/80 leading-relaxed mb-5">
          {course.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {getDifficultyLabel(course.difficulty)}
          </span>
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            ⏱ {course.estimatedMinutes} min
          </span>
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {posts.length} lessons
          </span>
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {quizzes.length} quizzes
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="px-6 mt-6">
        <Link
          href={`/course/${courseId}/feed`}
          className={`block w-full text-center py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r ${course.coverGradient} text-white hover:opacity-90 transition-opacity`}
        >
          Start Learning →
        </Link>
      </div>

      {/* "Continue" button — only rendered client-side if progress exists */}
      <ContinueButton courseId={courseId} />

      {/* lesson list */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Lessons</h2>
        <div className="space-y-2">
          {posts.map((post) => {
            const isQuizAfter = quizzes.some(
              (q) => q.afterPostOrder === post.order
            );
            return (
              <div key={post.id}>
                <div className="flex items-center gap-3 py-3 px-4 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-white/30 text-sm tabular-nums w-6">
                    {post.order}
                  </span>
                  <span className="text-white/80 text-sm flex-1">
                    {post.title}
                  </span>
                  <span className="text-xs text-white/30 capitalize">
                    {post.type}
                  </span>
                </div>
                {isQuizAfter && (
                  <div className="flex items-center gap-2 py-2 px-4 text-xs text-amber-400/70">
                    <div className="flex-1 h-px bg-amber-500/20" />
                    <span>🧠 Quiz checkpoint</span>
                    <div className="flex-1 h-px bg-amber-500/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
