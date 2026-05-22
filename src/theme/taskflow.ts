/** TaskFlow design tokens — from taskflow-mobile.html */
export const taskflowSemantic = {
  bg: "#0d0d0f",
  surface: "#141417",
  surface2: "#1b1b1f",
  surface3: "#232328",
  border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.14)",
  textPrimary: "#f0f0f2",
  textSecondary: "#9898a8",
  textMuted: "#5c5c72",
  blue: "#5d8aff",
  blueBg: "rgba(93,138,255,0.12)",
  amber: "#f5a623",
  amberBg: "rgba(245,166,35,0.12)",
  green: "#38c48a",
  greenBg: "rgba(56,196,138,0.12)",
  red: "#ff5e5e",
  redBg: "rgba(255,94,94,0.12)",
  purple: "#a78bfa",
  purpleBg: "rgba(167,139,250,0.12)",
} as const;

export type TaskFlowSemantic = typeof taskflowSemantic;

export const taskflowShape = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};


export const taskflowMotion = {
  durationFast: 160,
  durationMedium: 280,
  durationSlow: 380,
  spring: { damping: 20, stiffness: 200 },
  springBouncy: { damping: 14, stiffness: 180 },
};

export const taskflowTypography = {
  display: { fontFamily: "Syne", fontWeight: "700" as const },
  body: { fontFamily: "DMSans", fontWeight: "400" as const },
  mono: { fontFamily: "DMMono", fontWeight: "500" as const },
  displayLarge: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700" as const,
    fontFamily: "Syne",
  },
  headlineLarge: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "700" as const,
    fontFamily: "Syne",
  },
  headlineMedium: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700" as const,
    fontFamily: "Syne",
  },
  titleLarge: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600" as const,
    fontFamily: "Syne",
  },
  titleMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    fontFamily: "DMSans",
  },
  bodyLarge: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    fontFamily: "DMSans",
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
    fontFamily: "DMSans",
  },
  labelLarge: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
    fontFamily: "DMSans",
  },
  labelMedium: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "500" as const,
    fontFamily: "DMMono",
  },
};

/** Maps TaskFlow palette onto Material 3 color roles used across the app. */
export const taskflowMaterial3Dark = {
  primary: taskflowSemantic.blue,
  onPrimary: "#FFFFFF",
  primaryContainer: taskflowSemantic.blueBg,
  onPrimaryContainer: taskflowSemantic.blue,
  secondary: taskflowSemantic.purple,
  onSecondary: "#FFFFFF",
  secondaryContainer: taskflowSemantic.purpleBg,
  onSecondaryContainer: taskflowSemantic.purple,
  tertiary: taskflowSemantic.amber,
  onTertiary: "#0d0d0f",
  tertiaryContainer: taskflowSemantic.amberBg,
  onTertiaryContainer: taskflowSemantic.amber,
  error: taskflowSemantic.red,
  onError: "#FFFFFF",
  errorContainer: taskflowSemantic.redBg,
  onErrorContainer: taskflowSemantic.red,
  surface: taskflowSemantic.bg,
  onSurface: taskflowSemantic.textPrimary,
  surfaceVariant: taskflowSemantic.surface2,
  surfaceContainerLow: taskflowSemantic.surface,
  onSurfaceVariant: taskflowSemantic.textSecondary,
  outline: taskflowSemantic.textMuted,
  outlineVariant: taskflowSemantic.border,
  inverseSurface: taskflowSemantic.textPrimary,
  inverseOnSurface: taskflowSemantic.bg,
  scrim: "rgba(0,0,0,0.65)",
  shadow: "#000000",
  success: taskflowSemantic.green,
  successContainer: taskflowSemantic.greenBg,
  warning: taskflowSemantic.amber,
  warningContainer: taskflowSemantic.amberBg,
};

export const statusColors = {
  todo: {
    light: taskflowSemantic.blueBg,
    dark: taskflowSemantic.blueBg,
    accent: taskflowSemantic.blue,
  },
  in_progress: {
    light: taskflowSemantic.amberBg,
    dark: taskflowSemantic.amberBg,
    accent: taskflowSemantic.amber,
  },
  done: {
    light: taskflowSemantic.greenBg,
    dark: taskflowSemantic.greenBg,
    accent: taskflowSemantic.green,
  },
};

export const priorityColors = {
  low: taskflowSemantic.green,
  medium: taskflowSemantic.amber,
  high: taskflowSemantic.red,
};
