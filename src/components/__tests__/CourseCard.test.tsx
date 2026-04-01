import { render, screen } from "@testing-library/react";
import { CourseCard } from "@/components/home/CourseCard";
import type { Course } from "@/types";

const mockCourse: Course = {
  id: "test-course",
  title: "Test Course",
  description: "A test course description",
  emoji: "📚",
  coverGradient: "from-blue-500 to-purple-600",
  difficulty: "beginner",
  category: "Testing",
  tags: ["test", "demo"],
  estimatedMinutes: 30,
};

describe("CourseCard", () => {
  it("renders course title", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText("Test Course")).toBeInTheDocument();
  });

  it("renders course description", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText("A test course description")).toBeInTheDocument();
  });
});
