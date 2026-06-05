/**
 * AKSHAYA OS — Design tokens (TypeScript)
 * Mirror of CSS custom properties for programmatic use (Framer Motion, React Flow, charts).
 */

export const AKSHAYA_BRAND = {
  name: "AKSHAYA OS",
  neuralCoreAvatar: "/MYfaceInPortfolio.png",
} as const;

export const AKSHAYA_COLORS = {
  void: "#030508",
  voidElevated: "#060a12",
  surface: {
    0: "#0a0e17",
    1: "#0f1520",
    2: "#141c2b",
    3: "#1a2436",
  },
  blue: {
    400: "#1a94ff",
    500: "#0078f0",
    600: "#0066ff",
    glow: "rgba(0, 102, 255, 0.45)",
  },
  purple: {
    400: "#933fff",
    500: "#a855f7",
    600: "#9333ea",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  cyan: {
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    glow: "rgba(34, 211, 238, 0.35)",
  },
  text: {
    primary: "#f0f4fc",
    secondary: "#a8b4cc",
    muted: "#6b7a94",
  },
  semantic: {
    success: "#34d399",
    warning: "#fbbf24",
    error: "#f87171",
    online: "#34d399",
  },
} as const;

export const AKSHAYA_FONTS = {
  display: '"Space Grotesk", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const AKSHAYA_FONT_SIZE = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
} as const;

export const AKSHAYA_RADIUS = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const AKSHAYA_DURATION = {
  instant: 80,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
  pulse: 2400,
  glow: 3000,
  orbit: 8000,
} as const;

export const AKSHAYA_EASING = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.45, 0, 0.55, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
};

export const AKSHAYA_Z_INDEX = {
  base: 0,
  dock: 40,
  window: 50,
  windowActive: 60,
  overlay: 70,
  modal: 80,
  toast: 90,
  neuralCore: 100,
} as const;

export const AKSHAYA_NODE_SIZE = {
  sm: 40,
  md: 56,
  lg: 80,
  core: 120,
} as const;

/** CSS variable names for dynamic theming */
export const AKSHAYA_CSS_VARS = {
  neuralCoreAvatar: "--akshaya-neural-core-avatar",
  void: "--akshaya-void",
  blueGlow: "--akshaya-blue-glow",
  purpleGlow: "--akshaya-purple-glow",
  cyanGlow: "--akshaya-cyan-glow",
} as const;
