import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { Colors, type ColorScheme, type ThemeColors } from "../theme/colors";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const colorScheme: ColorScheme =
    mode === "system"
      ? (systemColorScheme ?? "light") === "dark"
        ? "dark"
        : "light"
      : mode;

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      if (current !== "system") {
        return current === "dark" ? "light" : "dark";
      }
      return (systemColorScheme ?? "light") === "dark" ? "light" : "dark";
    });
  }, [systemColorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, colorScheme, setMode, toggleTheme }),
    [mode, colorScheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeColors,
): string {
  const { colorScheme } = useTheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[colorScheme][colorName];
}
