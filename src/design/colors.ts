/**
 * Venezuela Tax-Benefit Explainer Design System
 *
 * Muted Venezuelan flag colors with an editorial/data journalism aesthetic.
 * Inspired by The Pudding, Bloomberg, and high-quality policy interactives.
 */

export const colors = {
  // Primary palette - muted Venezuelan flag colors
  azul: "#1a3a5c", // Deep navy blue (from flag blue, darkened)
  azulLight: "#2a5a8c", // Lighter blue for hover states
  azulPale: "#e8f0f7", // Very light blue for backgrounds

  oro: "#c9a227", // Warm gold/ochre (from flag yellow, earthier)
  oroLight: "#e8d48a", // Lighter gold for accents
  oroPale: "#fdf8e8", // Cream gold for highlights

  rojo: "#9c3d3d", // Terra cotta red (from flag red, muted)
  rojoLight: "#c45a5a", // Brighter red for emphasis
  rojoPale: "#f9eded", // Pink-tinged white

  // Neutral palette
  parchment: "#f8f6f1", // Warm off-white background
  parchmentDark: "#ebe7df", // Slightly darker for sections
  ink: "#1a1a1a", // Near-black for text
  inkLight: "#4a4a4a", // Gray for secondary text
  inkMuted: "#7a7a7a", // Muted gray for captions

  // Chart-specific colors (for stacking)
  grossIncome: "#2a5a8c", // Blue - base earnings
  incomeTax: "#9c3d3d", // Red - taxes taken away
  payrollTax: "#c45a5a", // Lighter red - more taxes
  benefits: "#2d7a4f", // Green - money coming back
  amorMayor: "#c9a227", // Gold - the pension
  childBenefits: "#5a9c7a", // Teal-green - child benefits
  netIncome: "#1a3a5c", // Navy - final net income

  // Cliff highlight
  cliff: "#dc2626", // Bright red for the cliff
  cliffGlow: "rgba(220, 38, 38, 0.3)", // Red glow
};

export const colorsRGB = {
  azul: "26, 58, 92",
  oro: "201, 162, 39",
  rojo: "156, 61, 61",
  cliff: "220, 38, 38",
};

// Chart color sequence for stacking
export const chartColors = {
  positive: [colors.amorMayor, colors.benefits, colors.childBenefits],
  negative: [colors.incomeTax, colors.payrollTax],
};
