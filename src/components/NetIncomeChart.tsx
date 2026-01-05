/**
 * NetIncomeChart - Visualizes Venezuela's tax-benefit system
 *
 * Shows how gross income transforms into net income through taxes and benefits,
 * with special emphasis on the Amor Mayor "cliff" effect.
 */

import React, { useMemo } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  generateIncomeSchedule,
  CONSTANTS,
  type HouseholdInput,
} from "../data/calculator";
import { useCurrency } from "../context/CurrencyContext";
import {
  formatCurrency,
  convertVesToUsd,
  getCurrencySymbol,
} from "../data/currency";
import { colors } from "../design/colors";
import { fonts, fontSizes, fontWeights } from "../design/typography";

export interface NetIncomeChartProps {
  chartState: {
    showGrossIncome: boolean;
    showIncomeTax: boolean;
    showPayrollTax: boolean;
    showSistemaPatria: boolean;
    showAmorMayor: boolean;
    showChildBenefits: boolean;
    showNetIncome: boolean;
    highlightCliff: boolean;
    householdType: "single" | "elder" | "family";
  };
}

const HOUSEHOLD_CONFIGS: Record<string, Omit<HouseholdInput, "grossIncome">> = {
  single: {
    age: 35,
    isMale: true,
    hasCarnetPatria: true,
    isAmorMayorEligible: false,
    schoolAgeChildren: 0,
    isBreastfeeding: false,
    isSistemaPatriaEligible: true,
  },
  elder: {
    age: 68,
    isMale: true,
    hasCarnetPatria: true,
    isAmorMayorEligible: true,
    schoolAgeChildren: 0,
    isBreastfeeding: false,
    isSistemaPatriaEligible: true,
  },
  family: {
    age: 32,
    isMale: false,
    hasCarnetPatria: true,
    isAmorMayorEligible: false,
    schoolAgeChildren: 2,
    isBreastfeeding: true,
    isSistemaPatriaEligible: true,
  },
};


const NetIncomeChart: React.FC<NetIncomeChartProps> = ({ chartState }) => {
  const { householdType, highlightCliff } = chartState;
  const { currency } = useCurrency();

  // Helper to convert values based on current currency
  const convertValue = (vesValue: number): number => {
    return currency === "USD" ? convertVesToUsd(vesValue) : vesValue;
  };

  // Generate data for the selected household type
  const data = useMemo(() => {
    const config = HOUSEHOLD_CONFIGS[householdType];
    const schedule = generateIncomeSchedule(config, 0, 10000, 201);

    return schedule.map((result) => ({
      grossIncome: convertValue(result.grossIncome),
      netIncome: convertValue(result.netIncome),
      incomeTax: -convertValue(result.incomeTax), // Negative for stacking below
      payrollTax: -convertValue(result.payrollTax),
      sistemaPatria: convertValue(result.sistemaPatria),
      amorMayor: convertValue(result.amorMayor),
      bonoEscolaridad: convertValue(result.bonoEscolaridad),
      bonoLactancia: convertValue(result.bonoLactancia),
      totalBenefits: convertValue(result.totalBenefits),
      // For visualization: stack taxes below, benefits above
      afterTax: convertValue(
        result.grossIncome - result.incomeTax - result.payrollTax,
      ),
      withBenefits: convertValue(result.netIncome),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [householdType, currency]);

  // Find cliff location for Amor Mayor
  const cliffLocation = useMemo(() => {
    if (householdType !== "elder") return null;
    return convertValue(CONSTANTS.MINIMUM_WAGE_ANNUAL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [householdType, currency]);

  // Format value for display
  const formatValue = (value: number): string => {
    return formatCurrency(value, currency, false);
  };

  return (
    <div
      data-testid="net-income-chart"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontFamily: fonts.display,
          fontSize: fontSizes.h3,
          fontWeight: fontWeights.semibold,
          color: colors.azul,
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        {householdType === "single" && "Single Worker, Age 35"}
        {householdType === "elder" && "Retiree, Age 68 (Amor Mayor Eligible)"}
        {householdType === "family" && "Family with 2 School-Age Children"}
      </h3>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.inkMuted}
              opacity={0.3}
            />

            <XAxis
              dataKey="grossIncome"
              tickFormatter={(v) =>
                `${getCurrencySymbol(currency)}${(v / (currency === "USD" ? 1 : 1000)).toFixed(currency === "USD" ? 0 : 0)}${currency === "VES" ? "k" : ""}`
              }
              label={{
                value: `Gross Income (${currency}/year)`,
                position: "bottom",
                style: {
                  fill: colors.ink,
                  fontFamily: fonts.body,
                  fontSize: 12,
                },
              }}
              tick={{
                fill: colors.inkLight,
                fontFamily: fonts.mono,
                fontSize: 11,
              }}
            />

            <YAxis
              tickFormatter={(v) =>
                `${getCurrencySymbol(currency)}${(v / (currency === "USD" ? 1 : 1000)).toFixed(currency === "USD" ? 0 : 0)}${currency === "VES" ? "k" : ""}`
              }
              label={{
                value: `${currency}/year`,
                angle: -90,
                position: "insideLeft",
                style: {
                  fill: colors.ink,
                  fontFamily: fonts.body,
                  fontSize: 12,
                },
              }}
              tick={{
                fill: colors.inkLight,
                fontFamily: fonts.mono,
                fontSize: 11,
              }}
            />

            <Tooltip
              formatter={(value, name) => [
                typeof value === "number" ? formatValue(Math.abs(value)) : "",
                name ?? "",
              ]}
              labelFormatter={(label) =>
                `Gross: ${formatValue(typeof label === "number" ? label : 0)}`
              }
              contentStyle={{
                backgroundColor: "white",
                border: `1px solid ${colors.inkMuted}`,
                borderRadius: 4,
                fontFamily: fonts.body,
              }}
            />

            {/* Gross income baseline */}
            {chartState.showGrossIncome && (
              <Line
                type="monotone"
                dataKey="grossIncome"
                stroke={colors.azulLight}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Gross Income"
              />
            )}

            {/* Income tax (shown as reduction) */}
            {chartState.showIncomeTax && (
              <Area
                type="monotone"
                dataKey="incomeTax"
                fill={colors.incomeTax}
                stroke={colors.incomeTax}
                fillOpacity={0.7}
                name="Income Tax"
                stackId="taxes"
              />
            )}

            {/* Payroll tax */}
            {chartState.showPayrollTax && (
              <Area
                type="monotone"
                dataKey="payrollTax"
                fill={colors.payrollTax}
                stroke={colors.payrollTax}
                fillOpacity={0.7}
                name="Payroll Tax"
                stackId="taxes"
              />
            )}

            {/* Sistema Patria */}
            {chartState.showSistemaPatria && (
              <Area
                type="monotone"
                dataKey="sistemaPatria"
                fill={colors.benefits}
                stroke={colors.benefits}
                fillOpacity={0.6}
                name="Sistema Patria"
                stackId="benefits"
              />
            )}

            {/* Amor Mayor */}
            {chartState.showAmorMayor && householdType === "elder" && (
              <Area
                type="monotone"
                dataKey="amorMayor"
                fill={colors.amorMayor}
                stroke={colors.amorMayor}
                fillOpacity={0.7}
                name="Amor Mayor"
                stackId="benefits"
              />
            )}

            {/* Child benefits */}
            {chartState.showChildBenefits && householdType === "family" && (
              <>
                <Area
                  type="monotone"
                  dataKey="bonoEscolaridad"
                  fill={colors.childBenefits}
                  stroke={colors.childBenefits}
                  fillOpacity={0.6}
                  name="Bono Escolaridad"
                  stackId="benefits"
                />
                <Area
                  type="monotone"
                  dataKey="bonoLactancia"
                  fill="#7ab89c"
                  stroke="#7ab89c"
                  fillOpacity={0.6}
                  name="Bono Lactancia"
                  stackId="benefits"
                />
              </>
            )}

            {/* Net income line */}
            {chartState.showNetIncome && (
              <Line
                type="monotone"
                dataKey="netIncome"
                stroke={colors.netIncome}
                strokeWidth={3}
                dot={false}
                name="Net Income"
              />
            )}

            {/* Cliff highlight */}
            {highlightCliff && cliffLocation && (
              <>
                <ReferenceLine
                  x={cliffLocation}
                  stroke={colors.cliff}
                  strokeWidth={3}
                  strokeDasharray="none"
                  label={{
                    value: "CLIFF",
                    position: "top",
                    fill: colors.cliff,
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                />
                <ReferenceArea
                  x1={cliffLocation - 100}
                  x2={cliffLocation + 100}
                  fill={colors.cliff}
                  fillOpacity={0.15}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "0.5rem",
          fontSize: fontSizes.small,
        }}
      >
        {chartState.showGrossIncome && (
          <LegendItem color={colors.azulLight} label="Gross Income" dashed />
        )}
        {chartState.showIncomeTax && (
          <LegendItem color={colors.incomeTax} label="Income Tax" />
        )}
        {chartState.showPayrollTax && (
          <LegendItem color={colors.payrollTax} label="Payroll Tax" />
        )}
        {chartState.showSistemaPatria && (
          <LegendItem color={colors.benefits} label="Sistema Patria" />
        )}
        {chartState.showAmorMayor && householdType === "elder" && (
          <LegendItem color={colors.amorMayor} label="Amor Mayor" />
        )}
        {chartState.showChildBenefits && householdType === "family" && (
          <>
            <LegendItem color={colors.childBenefits} label="Bono Escolaridad" />
            <LegendItem color="#7ab89c" label="Bono Lactancia" />
          </>
        )}
        {chartState.showNetIncome && (
          <LegendItem color={colors.netIncome} label="Net Income" isLine />
        )}
      </div>

      {/* Cliff callout */}
      {highlightCliff && cliffLocation && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: colors.rojoPale,
            borderRadius: "4px",
            textAlign: "center",
            fontSize: fontSizes.small,
            color: colors.rojo,
          }}
        >
          <strong>Cliff at {formatValue(cliffLocation)}</strong>: Amor Mayor
          drops to zero
        </div>
      )}

      {/* PolicyEngine logo */}
      <div
        style={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
          opacity: 0.6,
        }}
      >
        <img
          src="https://raw.githubusercontent.com/PolicyEngine/policyengine-app/master/src/images/logos/policyengine/blue.png"
          alt="PolicyEngine"
          style={{ height: "20px" }}
        />
      </div>
    </div>
  );
};

interface LegendItemProps {
  color: string;
  label: string;
  dashed?: boolean;
  isLine?: boolean;
}

const LegendItem: React.FC<LegendItemProps> = ({
  color,
  label,
  dashed,
  isLine,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <div
      style={{
        width: isLine ? 20 : 12,
        height: isLine ? 3 : 12,
        backgroundColor: isLine ? color : color,
        borderRadius: isLine ? 0 : 2,
        border: dashed ? `2px dashed ${color}` : "none",
        ...(dashed && { backgroundColor: "transparent" }),
      }}
    />
    <span style={{ color: colors.inkLight }}>{label}</span>
  </div>
);

export default NetIncomeChart;
