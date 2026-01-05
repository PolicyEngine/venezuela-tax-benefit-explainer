/**
 * Tests for ScrollyStory component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import ScrollyStory, { STORY_STEPS, type StoryStep } from "./ScrollyStory";

// Mock recharts to avoid rendering issues in tests
jest.mock("recharts", () => ({
  ComposedChart: ({ children }: any) => (
    <div data-testid="composed-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  ReferenceLine: () => <div data-testid="reference-line" />,
  ReferenceArea: () => <div data-testid="reference-area" />,
}));

// Mock react-scrollama
jest.mock("react-scrollama", () => ({
  Scrollama: ({ children, onStepEnter }: any) => (
    <div data-testid="scrollama">{children}</div>
  ),
  Step: ({ children, data }: any) => (
    <div data-testid={`step-${data}`}>{children}</div>
  ),
}));

// Mock IntersectionObserver for react-scrollama (just in case)
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("ScrollyStory", () => {
  it("renders without crashing", () => {
    render(<ScrollyStory />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders hero section with title", () => {
    render(<ScrollyStory />);
    // The title "Venezuela's" appears in the hero h1
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Venezuela/i,
    );
  });

  it("renders all story steps", () => {
    render(<ScrollyStory />);
    STORY_STEPS.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it("renders the sticky chart container", () => {
    render(<ScrollyStory />);
    const chart = screen.getByTestId("sticky-chart");
    expect(chart).toBeInTheDocument();
  });
});

describe("STORY_STEPS", () => {
  it("should have at least 5 steps covering major elements", () => {
    expect(STORY_STEPS.length).toBeGreaterThanOrEqual(5);
  });

  it("each step should have required fields", () => {
    STORY_STEPS.forEach((step: StoryStep, index) => {
      expect(step.id).toBeDefined();
      expect(step.title).toBeDefined();
      expect(step.content).toBeDefined();
      expect(step.chartState).toBeDefined();
    });
  });

  it("should have a step about the Amor Mayor cliff", () => {
    const cliffStep = STORY_STEPS.find(
      (step) =>
        step.id === "amor-mayor" || step.title.toLowerCase().includes("cliff"),
    );
    expect(cliffStep).toBeDefined();
  });

  it("should cover income tax", () => {
    const taxStep = STORY_STEPS.find(
      (step) =>
        step.id === "income-tax" || step.title.toLowerCase().includes("tax"),
    );
    expect(taxStep).toBeDefined();
  });

  it("should cover payroll taxes", () => {
    const payrollStep = STORY_STEPS.find(
      (step) =>
        step.id === "payroll-tax" ||
        step.title.toLowerCase().includes("payroll"),
    );
    expect(payrollStep).toBeDefined();
  });

  it("should cover benefits", () => {
    const benefitStep = STORY_STEPS.find(
      (step) =>
        step.id.includes("benefit") ||
        step.id.includes("patria") ||
        step.title.toLowerCase().includes("benefit"),
    );
    expect(benefitStep).toBeDefined();
  });
});
