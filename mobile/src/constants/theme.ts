// Mirrors the CSS custom properties in ../css/globals.css.
export const colors = {
  bg: '#edf1e8',
  bg2: '#d7dbd2',
  fg: '#141414',
  accent1: '#ed6a5a',
  accent2: '#f4f1bb',
  accent3: '#9bc1bc',
  accent4: '#5d576b',
} as const;

// Font family keys registered in src/app/_layout.tsx.
export const fonts = {
  display: 'Rader-Italic',
  displayBold: 'Rader-BoldItalic',
  body: 'Formula-NarrowSemibold',
  mono: 'SupplyMono-Medium',
} as const;

export const spacing = {
  gutter: 20,
} as const;
