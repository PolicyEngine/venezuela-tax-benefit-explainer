/**
 * Venezuela Tax-Benefit Explainer Design System
 *
 * Aligned with PolicyEngine design tokens.
 */

export const colors = {
  // Primary brand colors - teal (PolicyEngine)
  primary: {
    50: "#E6FFFA",
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795", // Main brand color
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044",
  },

  // Gray scale
  gray: {
    50: "#F9FAFB",
    100: "#F2F4F7",
    200: "#E2E8F0",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#344054",
    800: "#1F2937",
    900: "#101828",
  },

  // Semantic colors
  success: "#22C55E",
  warning: "#FEC601",
  error: "#EF4444",
  info: "#1890FF",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",

  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F5F9FF",
    tertiary: "#F1F5F9",
  },

  // Text colors
  text: {
    primary: "#000000",
    secondary: "#5A5A5A",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
  },

  // Border colors
  border: {
    light: "#E2E8F0",
    medium: "#CBD5E1",
    dark: "#94A3B8",
  },

  // Chart-specific colors
  grossIncome: "#319795", // Teal - base earnings
  incomeTax: "#344054", // Gray - taxes taken away
  payrollTax: "#6B7280", // Lighter gray - more taxes
  benefits: "#22C55E", // Green - money coming back
  amorMayor: "#319795", // Teal - the pension
  childBenefits: "#4FD1C5", // Light teal - child benefits
  netIncome: "#1D4044", // Dark teal - final net income

  // Cliff highlight
  cliff: "#EF4444", // Red for the cliff

  // Legacy aliases for compatibility
  azul: "#319795",
  azulLight: "#4FD1C5",
  ink: "#000000",
  inkLight: "#5A5A5A",
  inkMuted: "#9CA3AF",
  parchment: "#FFFFFF",
  parchmentDark: "#F1F5F9",
  rojo: "#EF4444",
  rojoPale: "#FEF2F2",
};

// Chart color sequence for stacking
export const chartColors = {
  positive: [colors.amorMayor, colors.benefits, colors.childBenefits],
  negative: [colors.incomeTax, colors.payrollTax],
};
