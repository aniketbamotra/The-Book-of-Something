import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders without crashing", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("renders with beginner variant", () => {
    render(<Badge variant="beginner">Beginner</Badge>);
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });
});
