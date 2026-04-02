import type { Course, CourseData } from "@/types";
import { CourseGrid } from "@/components/home/CourseGrid";
import coursesData from "@/data/courses.json";
import { BookOpen } from "lucide-react";

async function getLessonCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  await Promise.all(
    (coursesData as Course[]).map(async (course) => {
      try {
        const data = await import(`@/data/courses/${course.id}.json`);
        counts[course.id] = (data.default as CourseData).posts.length;
      } catch {
        counts[course.id] = 0;
      }
    })
  );
  return counts;
}

export default async function HomePage() {
  const courses = coursesData as Course[];
  const lessonCounts = await getLessonCounts();

  return (
    <div className="bg-background">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFF4EC 0%, #FFF9F5 100%)",
          borderBottom: "1px solid #EDE5DE",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px]"
            style={{ background: "rgba(217,119,6,0.07)" }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20 text-center relative">
          <h1
            className="font-bold tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              letterSpacing: "-0.03em",
              color: "#111827",
            }}
          >
            The Book of <span style={{ color: "#6366F1" }}>Something</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-xl mx-auto mb-6"
            style={{ color: "#6B7280" }}
          >
            Bite-sized lessons designed for the scroll generation. Pick a
            course, scroll through posts, and level up — one swipe at a time.
          </p>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Scroll to learn ↓
          </p>
        </div>
      </section>

      {/* ── Courses ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div
          className="flex items-center gap-2 mb-8 pb-5"
          style={{ borderBottom: "1px solid #EDE5DE" }}
        >
          <BookOpen size={18} style={{ color: "#6366F1" }} strokeWidth={2} />
          <h2
            className="font-semibold"
            style={{ fontSize: "1.0625rem", color: "#111827" }}
          >
            All Courses
          </h2>
          <span className="ml-auto text-sm" style={{ color: "#9CA3AF" }}>
            {courses.length} courses
          </span>
        </div>
        <CourseGrid courses={courses} lessonCounts={lessonCounts} />
      </section>
    </div>
  );
}
