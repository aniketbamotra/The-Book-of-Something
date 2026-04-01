"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Course, CourseProgress } from "@/types";
import { CourseCard } from "@/components/home/CourseCard";
import { loadProgress } from "@/lib/progressStorage";
import { stagger } from "@/lib/animations";

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  const [progressMap, setProgressMap] = useState<
    Record<string, CourseProgress>
  >({});

  useEffect(() => {
    const up = loadProgress();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgressMap(up.courses);
  }, []);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          progress={progressMap[course.id] ?? null}
        />
      ))}
    </motion.div>
  );
}
