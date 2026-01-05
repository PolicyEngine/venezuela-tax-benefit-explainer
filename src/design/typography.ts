/**
 * Typography system for Venezuela Tax-Benefit Explainer
 *
 * Aligned with PolicyEngine design tokens.
 */

export const fonts = {
  // Primary font - Inter for UI elements
  primary: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',

  // Body font - Roboto for body text
  body: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',

  // Display font - same as primary for consistency
  display: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',

  // Chart font - Roboto Serif for chart labels
  chart: '"Roboto Serif", Georgia, serif',

  // Mono font for numbers
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
};

export const fontSizes = {
  // Display sizes
  hero: "3rem", // 48px - main title
  h1: "2rem", // 32px - section titles
  h2: "1.5rem", // 24px - step titles
  h3: "1.25rem", // 20px - subsections

  // Body sizes
  large: "1.125rem", // 18px - intro text
  body: "1rem", // 16px - main narrative
  small: "0.875rem", // 14px - captions, labels
  tiny: "0.75rem", // 12px - chart axis labels
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
};

// Google Fonts import URL
export const fontsImportUrl =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Roboto:wght@400;500;700&family=Roboto+Serif:wght@400;500&display=swap";
