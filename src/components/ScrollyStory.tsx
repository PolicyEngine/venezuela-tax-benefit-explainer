/**
 * ScrollyStory - Main scrollytelling component for Venezuela Tax-Benefit Explainer
 *
 * Uses react-scrollama to create scroll-triggered transitions between
 * different views of the net income chart.
 */

import React, { useState, useCallback } from "react";
import { Scrollama, Step } from "react-scrollama";
import NetIncomeChart from "./NetIncomeChart";
import { colors } from "../design/colors";
import {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
} from "../design/typography";

export interface ChartState {
  showGrossIncome: boolean;
  showIncomeTax: boolean;
  showPayrollTax: boolean;
  showSistemaPatria: boolean;
  showAmorMayor: boolean;
  showChildBenefits: boolean;
  showNetIncome: boolean;
  highlightCliff: boolean;
  householdType: "single" | "elder" | "family";
}

export interface StoryStep {
  id: string;
  title: string;
  content: string;
  chartState: ChartState;
}

const DEFAULT_CHART_STATE: ChartState = {
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

export const STORY_STEPS: StoryStep[] = [
  {
    id: "intro",
    title: "A Worker in Venezuela",
    content: `Imagine you're a worker in Venezuela, earning income from a job.
      Your gross earnings form the foundation of your economic life—but what
      you actually take home depends on a complex system of taxes and benefits.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
    },
  },
  {
    id: "income-tax",
    title: "Income Tax: 8 Progressive Brackets",
    content: `Venezuela uses a progressive income tax system with 8 brackets,
      ranging from 6% to 34%. The tax is calculated in "Tax Units" (Unidades Tributarias),
      which in 2025 equals 43 VES. Higher earners face steeper rates on their
      marginal income.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
    },
  },
  {
    id: "payroll-tax",
    title: "Payroll Taxes: IVSS and BANAVIH",
    content: `Workers also pay payroll taxes: 4% to the Venezuelan Social Security Institute (IVSS)
      and 1% to the housing fund (BANAVIH). These flat 5% taxes apply to all earnings,
      funding social programs and housing.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
    },
  },
  {
    id: "sistema-patria",
    title: "Sistema Patria: Monthly Bonuses",
    content: `The Sistema Patria program provides monthly bonuses to cardholders
      (Carnet de la Patria). In 2025, this equals about 90 VES per month,
      providing a small but steady supplement to household income.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
      showSistemaPatria: true,
    },
  },
  {
    id: "amor-mayor",
    title: "Gran Misión Amor Mayor: The Pension Cliff",
    content: `For Venezuelans over 60 (women) or 65 (men), the Amor Mayor pension
      provides a flat benefit—but only if household income stays below the minimum wage.
      Cross that threshold by even 1 bolívar, and the entire benefit vanishes.
      This creates a dramatic "cliff" where earning more can mean taking home less.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
      showSistemaPatria: true,
      showAmorMayor: true,
      highlightCliff: true,
      householdType: "elder",
    },
  },
  {
    id: "child-benefits",
    title: "Child Benefits: Escolaridad and Lactancia",
    content: `Families with children receive additional support. The Bono de Escolaridad
      provides 446 VES monthly per school-age child (4-17 years), while the Bono de
      Lactancia gives 558 VES monthly to breastfeeding mothers. These can significantly
      boost household income for young families.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
      showSistemaPatria: true,
      showChildBenefits: true,
      householdType: "family",
    },
  },
  {
    id: "net-income",
    title: "Net Income: The Bottom Line",
    content: `After all taxes and benefits, what remains is net income—the actual
      purchasing power of a household. The system creates complex incentives,
      including potential "cliffs" where marginal tax rates exceed 100%.
      Understanding these dynamics is crucial for policy reform.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
      showSistemaPatria: true,
      showAmorMayor: true,
      showChildBenefits: true,
      showNetIncome: true,
      householdType: "elder",
    },
  },
];

const ScrollyStory: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [chartState, setChartState] = useState<ChartState>(
    STORY_STEPS[0].chartState,
  );

  const onStepEnter = useCallback(({ data }: { data: number }) => {
    setCurrentStep(data);
    setChartState(STORY_STEPS[data].chartState);
  }, []);

  return (
    <main
      style={{
        fontFamily: fonts.body,
        backgroundColor: colors.parchment,
        color: colors.ink,
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <header
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center",
          background: `linear-gradient(135deg, ${colors.azul} 0%, ${colors.azulLight} 100%)`,
          color: colors.parchment,
        }}
      >
        <h1
          style={{
            fontFamily: fonts.display,
            fontSize: fontSizes.hero,
            fontWeight: fontWeights.black,
            marginBottom: "1rem",
            lineHeight: lineHeights.tight,
          }}
        >
          Venezuela's
          <br />
          Tax-Benefit System
        </h1>
        <p
          style={{
            fontSize: fontSizes.large,
            maxWidth: "600px",
            lineHeight: lineHeights.relaxed,
            opacity: 0.9,
          }}
        >
          An interactive guide to understanding how taxes and benefits shape
          household income—including the dramatic "cliff" effects that can
          penalize work.
        </p>
        <div
          style={{
            marginTop: "3rem",
            fontSize: fontSizes.small,
            opacity: 0.7,
          }}
        >
          Scroll to explore ↓
        </div>
      </header>

      {/* Scrollytelling Section */}
      <section
        style={{
          display: "flex",
          position: "relative",
        }}
      >
        {/* Sticky Chart */}
        <div
          data-testid="sticky-chart"
          style={{
            position: "sticky",
            top: 0,
            width: "55%",
            height: "100vh",
            backgroundColor: colors.parchmentDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <NetIncomeChart chartState={chartState} />
        </div>

        {/* Scrolling Steps */}
        <div
          style={{
            width: "45%",
            padding: "2rem",
          }}
        >
          <Scrollama onStepEnter={onStepEnter} offset={0.5}>
            {STORY_STEPS.map((step, index) => (
              <Step key={step.id} data={index}>
                <div
                  style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    padding: "2rem 1rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        currentStep === index ? "white" : colors.parchment,
                      padding: "2rem",
                      borderRadius: "8px",
                      boxShadow:
                        currentStep === index
                          ? "0 4px 20px rgba(0,0,0,0.1)"
                          : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      transform:
                        currentStep === index ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: fonts.display,
                        fontSize: fontSizes.h2,
                        fontWeight: fontWeights.bold,
                        color: colors.azul,
                        marginBottom: "1rem",
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      style={{
                        fontSize: fontSizes.body,
                        lineHeight: lineHeights.relaxed,
                        color: colors.inkLight,
                      }}
                    >
                      {step.content}
                    </p>
                    {step.id === "amor-mayor" && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "1rem",
                          backgroundColor: colors.rojoPale,
                          borderLeft: `4px solid ${colors.rojo}`,
                          borderRadius: "4px",
                        }}
                      >
                        <strong style={{ color: colors.rojo }}>
                          Benefit Cliff Alert:
                        </strong>
                        <br />
                        When MTR exceeds 100%, earning more money reduces net
                        income.
                      </div>
                    )}
                  </div>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          backgroundColor: colors.azul,
          color: colors.parchment,
        }}
      >
        <p style={{ fontSize: fontSizes.small, opacity: 0.8 }}>
          Built with PolicyEngine. Data sources: SENIAT, Sistema Patria, Gaceta
          Oficial.
        </p>
      </footer>
    </main>
  );
};

export default ScrollyStory;
