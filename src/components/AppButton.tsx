import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@contexts/ThemeContext";
import { Colors } from "@theme/colors";

import { ThemedText } from "./ThemedText";

export type AppButtonVariant = "primary" | "secondary" | "outline";
export type AppButtonSize = "default" | "small";

export type AppButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
};

export function AppButton({
  title,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  variant = "primary",
  size = "default",
  disabled,
  style,
  onPress,
  ...rest
}: AppButtonProps) {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme];
  const isDisabled = disabled || loading;

  const resolvedStyle = ({ pressed }: { pressed: boolean }) => {
    const baseStyle: StyleProp<ViewStyle>[] = [
      styles.base,
      fullWidth && styles.fullWidth,
      size === "small" && styles.small,
      variant === "primary" && {
        backgroundColor: theme.primary,
        borderColor: theme.primary,
      },
      variant === "secondary" && {
        backgroundColor: theme.border,
        borderColor: theme.border,
      },
      variant === "outline" && {
        backgroundColor: "transparent",
        borderColor: theme.primary,
      },
      isDisabled && styles.disabled,
      pressed && !isDisabled && styles.pressed,
    ];

    if (typeof style === "function") {
      baseStyle.push(style({ pressed }));
    } else if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const textColor = variant === "outline" ? theme.primary : "#ffffff";
  const spinnerColor = variant === "outline" ? theme.primary : "#ffffff";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={resolvedStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View style={styles.container}>
          {icon && iconPosition === "left" ? (
            <View style={styles.icon}>{icon}</View>
          ) : null}
          <ThemedText
            style={[
              styles.label,
              size === "small" && styles.smallLabel,
              { color: textColor },
            ]}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === "right" ? (
            <View style={styles.icon}>{icon}</View>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    height: 50,
  },
  fullWidth: {
    width: "100%",
  },
  container: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
  smallLabel: {
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
});
