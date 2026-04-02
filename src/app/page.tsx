import type { Course, CourseData } from "@/types";
import { CourseGrid } from "@/components/home/CourseGrid";
import coursesData from "@/data/courses.json";
import { BookOpen, Smartphone } from "lucide-react";

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
    <main className="min-h-screen bg-background">
      {/* hero */}
      <div
        className="border-b px-6 py-20 text-center relative overflow-hidden"
        style={{ borderColor: "rgba(99,102,241,0.10)" }}
      >
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/8 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6 border"
            style={{
              background: "rgba(99,102,241,0.07)",
              borderColor: "rgba(99,102,241,0.18)",
              color: "#4F46E5",
            }}
          >
            <Smartphone size={14} strokeWidth={2} />
            <span>Scroll to learn</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "#1E1B4B", letterSpacing: "-0.025em" }}
          >
            The Book of <span style={{ color: "#6366F1" }}>Something</span>
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "rgba(30,27,75,0.55)" }}
          >
            Bite-sized lessons designed for the scroll generation. Pick a
            course, scroll through posts, and level up — one swipe at a time.
          </p>
        </div>
      </div>

      {/* courses */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-xl font-semibold flex items-center gap-2"
            style={{ color: "#1E1B4B" }}
          >
            <BookOpen size={18} style={{ color: "#6366F1" }} />
            All Courses
          </h2>
          <span className="text-sm" style={{ color: "rgba(30,27,75,0.40)" }}>
            {courses.length} courses
          </span>
        </div>
        <CourseGrid courses={courses} lessonCounts={lessonCounts} />
      </div>
    </main>
  );
}
