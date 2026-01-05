/**
 * Tests for NetIncomeChart component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import NetIncomeChart, { type NetIncomeChartProps } from "./NetIncomeChart";

// Mock recharts completely to avoid rendering issues in tests
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

const defaultChartState: NetIncomeChartProps["chartState"] = {
  showGrossIncome: true,
  showIncomeTax: false,
  showPayrollTax: false,
  showSistemaPatria: false,
  showAmorMayor: false,
  showChildBenefits: false,
  showNetIncome: false,
  highlightCliff: false,
  householdType: "single",
};

describe("NetIncomeChart", () => {
  it("renders without crashing", () => {
    render(<NetIncomeChart chartState={defaultChartState} />);
    expect(screen.getByTestId("net-income-chart")).toBeInTheDocument();
  });

  it("renders chart container", () => {
    render(<NetIncomeChart chartState={defaultChartState} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("displays legend items based on chart state", () => {
    const allVisibleState = {
      ...defaultChartState,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
      showSistemaPatria: true,
      showAmorMayor: true,
      showNetIncome: true,
      householdType: "elder" as const,
    };

    render(<NetIncomeChart chartState={allVisibleState} />);

    // Check for legend labels
    expect(screen.getByText(/Gross Income/i)).toBeInTheDocument();
    expect(screen.getByText(/Income Tax/i)).toBeInTheDocument();
    expect(screen.getByText(/Payroll Tax/i)).toBeInTheDocument();
  });

  it("shows cliff indicator when highlightCliff is true", () => {
    const cliffState = {
      ...defaultChartState,
      showAmorMayor: true,
      highlightCliff: true,
      householdType: "elder" as const,
    };

    render(<NetIncomeChart chartState={cliffState} />);
    expect(screen.getByText(/cliff/i)).toBeInTheDocument();
  });

  it("updates when household type changes", () => {
    const { rerender } = render(
      <NetIncomeChart chartState={defaultChartState} />,
    );

    // Change to elder household
    const elderState = {
      ...defaultChartState,
      householdType: "elder" as const,
    };
    rerender(<NetIncomeChart chartState={elderState} />);

    // Component should still render
    expect(screen.getByTestId("net-income-chart")).toBeInTheDocument();
  });

  it("shows child benefits for family household type", () => {
    const familyState = {
      ...defaultChartState,
      showChildBenefits: true,
      householdType: "family" as const,
    };

    render(<NetIncomeChart chartState={familyState} />);
    expect(screen.getByText(/Bono Escolaridad/i)).toBeInTheDocument();
  });
});
