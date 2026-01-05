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
    title: "Gross income",
    content: `A worker in Venezuela earns gross income. Net income depends on taxes and benefits.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
    },
  },
  {
    id: "income-tax",
    title: "Income tax",
    content: `Venezuela has 8 income tax brackets, ranging from 6% to 34%. Tax is calculated in Tax Units (Unidades Tributarias), equal to 43 VES in 2025.`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
    },
  },
  {
    id: "payroll-tax",
    title: "Payroll taxes",
    content: `Workers pay 4% to IVSS (social security, capped at 5× minimum wage) and 1% to BANAVIH (housing fund, uncapped).`,
    chartState: {
      ...DEFAULT_CHART_STATE,
      showGrossIncome: true,
      showIncomeTax: true,
      showPayrollTax: true,
    },
  },
  {
    id: "sistema-patria",
    title: "Sistema Patria",
    content: `Carnet de la Patria holders receive 90 VES/month (1,080 VES/year).`,
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
    title: "Amor Mayor pension",
    content: `Venezuelans over 60 (women) or 65 (men) with income below 1,560 VES/year receive 1,560 VES/year. At the threshold, the benefit drops to zero, creating a cliff where earning 1 VES more reduces net income by ~1,471 VES.`,
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
    title: "Child benefits",
    content: `Bono de Escolaridad: 446 VES/month per child aged 4-17. Bono de Lactancia: 558 VES/month for breastfeeding mothers. Both require Carnet de la Patria.`,
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
    title: "Net income",
    content: `Net income = gross income − taxes + benefits. The Amor Mayor cliff creates marginal tax rates exceeding 100% at the minimum wage threshold.`,
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
            fontWeight: fontWeights.bold,
            marginBottom: "1rem",
            lineHeight: lineHeights.tight,
          }}
        >
          Venezuela's tax-benefit system
        </h1>
        <p
          style={{
            fontSize: fontSizes.large,
            maxWidth: "600px",
            lineHeight: lineHeights.relaxed,
            opacity: 0.9,
          }}
        >
          How taxes and benefits affect net income, including benefit cliffs
          with marginal tax rates exceeding 100%.
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
                          MTR exceeds 100%
                        </strong>
                        : Earning 100 VES more at the cliff reduces net income
                        by ~1,471 VES.
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
