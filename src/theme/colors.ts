export type ColorScheme = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  backgroundOpacity: string;
  card: string;
  iconBackground: string;
  iconBackgroundPrimary: string;
  text: string;
  tint: string;
  muted: string;
  deepMuted: string;
  primary: string;
  primaryMuted: string;
  onPrimary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  deepWarning: string;
  statusPending: string;
  statusVerified: string;
  statusPendingBackground: string;
  statusVerifiedBackground: string;
  activeNavBg: string;
  activeNavBorder: string;
  cardContentBackground: string;
};

export const Colors: Record<ColorScheme, ThemeColors> = {
  light: {
    // Canvas & Surfaces
    background: "#ffffff",
    surface: "#f8fafc", // Section/grouped background
    card: "#ffffff", // Standalone card surface (pair with border/shadow)
    cardContentBackground: "#F0F4F8",
    backgroundOpacity: "#ffffff4d",
    border: "#D9E2EC",

    // Icon Containers & Badges
    iconBackground: "#f1f5f9", // Neutral icon tile / action button
    iconBackgroundPrimary: "#eff6ff", // Brand-tinted background for primary icons

    // Typography
    text: "#0f172a",
    tint: "#0f172a",
    muted: "#64748b",
    deepMuted: "#434d5a",

    // Brand & Interactive
    primary: "#052772",
    primaryMuted: "#eff6ff",
    onPrimary: "#ffffff",

    // Status Feedback
    error: "#dc2626",
    success: "#16a34a",
    warning: "#d97706",
    deepWarning: "#92400E",
    statusPending: "#F0B429",
    statusPendingBackground: "#F0B42930",
    statusVerified: "#4CD964",
    statusVerifiedBackground: "#ACFFBA30",

    // Navigation
    activeNavBg: "#EFF6FF",
    activeNavBorder: "#DBEAFE",
  },
  dark: {
    // Canvas & Surfaces
    background: "#0f172a",
    surface: "#1e293b", // Section/grouped background
    card: "#1e293b", // Standalone card surface
    cardContentBackground: "#0f172a",
    backgroundOpacity: "#0f172a4d",
    border: "#334155",

    // Icon Containers & Badges
    iconBackground: "#334155", // Neutral icon tile / action button
    iconBackgroundPrimary: "#1e3a8a33", // Brand-tinted background for primary icons

    // Typography
    text: "#f8fafc",
    tint: "#f8fafc",
    muted: "#94a3b8",
    deepMuted: "#cbd5e1",

    // Brand & Interactive
    primary: "#3b82f6", // Brightened for dark surfaces
    primaryMuted: "#1e3a8a40",
    onPrimary: "#ffffff",

    // Status Feedback
    error: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    deepWarning: "#fde047",
    statusPending: "#f59e0b",
    statusPendingBackground: "#f59e0b30",
    statusVerified: "#4cd964",
    statusVerifiedBackground: "#4cd96430",

    // Navigation
    activeNavBg: "#1e3a8a40",
    activeNavBorder: "#1d4ed880",
  },
};
