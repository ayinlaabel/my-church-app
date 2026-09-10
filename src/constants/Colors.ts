export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
    card: "#f5f5f5",
    border: "#e0e0e0",
    notification: "#ff3b30",
    statusPending: "#F0B429",
    statusVerified: "#4CD964",
    statusPendingBackground: "#F0B429A0",
    statusVerifiedBackground: "#4CD964AF",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#4fc3f7",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#4fc3f7",
    card: "#1e1e1e",
    border: "#333333",
    notification: "#ff453a",
  },
} as const;

export type ThemeColors = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  border: string;
  notification: string;
  statusPending: string;
  statusVerified: string;
  statusPendingBackground: string;
  statusVerifiedBackground: string;
};
