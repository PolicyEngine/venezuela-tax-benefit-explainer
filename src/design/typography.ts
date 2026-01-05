/**
 * Typography system for Venezuela Tax-Benefit Explainer
 *
 * Editorial/data journalism aesthetic with distinctive fonts.
 */

export const fonts = {
  // Display font - elegant serif for headlines
  // Playfair Display: classic editorial feel, great for data journalism
  display: '"Playfair Display", Georgia, serif',

  // Body font - clean sans-serif for readability
  // Source Sans Pro: professional, readable, works well with Playfair
  body: '"Source Sans 3", "Source Sans Pro", -apple-system, sans-serif',

  // Mono font for numbers in charts
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
  hero: "4rem", // 64px - main title
  h1: "2.5rem", // 40px - section titles
  h2: "1.75rem", // 28px - step titles
  h3: "1.25rem", // 20px - subsections

  // Body sizes
  large: "1.25rem", // 20px - intro text
  body: "1.125rem", // 18px - main narrative
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
  "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;500;600;700;900&family=Source+Sans+3:wght@400;500;600;700&display=swap";
