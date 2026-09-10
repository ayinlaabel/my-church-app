import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "../contexts/ThemeContext";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Montserrat-Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Montserrat-SemiBold",
  },
  title: {
    fontSize: 28,
    fontFamily: "Montserrat-Bold",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "Montserrat-Medium",
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: "#2563eb",
    fontFamily: "Montserrat-Medium",
  },
});
