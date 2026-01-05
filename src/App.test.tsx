import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock recharts
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
  Scrollama: ({ children }: any) => (
    <div data-testid="scrollama">{children}</div>
  ),
  Step: ({ children, data }: any) => (
    <div data-testid={`step-${data}`}>{children}</div>
  ),
}));

test("renders Venezuela Tax-Benefit Explainer", () => {
  render(<App />);
  const mainElement = screen.getByRole("main");
  expect(mainElement).toBeInTheDocument();
});

test("renders hero title", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent(/Venezuela/i);
});
