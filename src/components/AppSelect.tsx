import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  View,
} from "react-native";

import { useThemeColor } from "@contexts/ThemeContext";
import { ThemedText } from "@components/ThemedText";

export type AppSelectOption<TValue extends string | number = string> = {
  label: string;
  value: TValue;
};

export type AppSelectProps<TValue extends string | number = string> = {
  label?: string;
  value?: TValue | null;
  options: AppSelectOption<TValue>[];
  onValueChange: (value: TValue) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  modalTitle?: string;
};

export function AppSelect<TValue extends string | number = string>({
  label,
  value,
  options,
  onValueChange,
  placeholder = "Select an option",
  error,
  containerStyle,
  style,
  textStyle,
  disabled,
  modalTitle = "Select an option",
}: AppSelectProps<TValue>) {
  const [visible, setVisible] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "muted");
  const surfaceColor = useThemeColor({}, "surface");

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <ThemedText type="subtitle" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}

      <Pressable
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
        style={({ pressed }) => [
          styles.input,
          {
            backgroundColor,
            borderColor,
            opacity: disabled ? 0.6 : pressed ? 0.96 : 1,
          },
          style,
        ]}
      >
        <ThemedText
          type="default"
          style={[
            styles.valueText,
            { color: selectedOption ? textColor : mutedColor },
            textStyle,
          ]}
        >
          {displayValue}
        </ThemedText>
        <ThemedText style={styles.chevron}>▾</ThemedText>
      </Pressable>

      {error ? (
        <ThemedText type="subtitle" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: surfaceColor }]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {modalTitle}
            </ThemedText>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <Pressable
                    onPress={() => {
                      onValueChange(item.value);
                      setVisible(false);
                    }}
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected
                          ? "rgba(5, 39, 114, 0.08)"
                          : "transparent",
                        borderColor: borderColor,
                      },
                    ]}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: isSelected ? textColor : textColor }}
                    >
                      {item.label}
                    </ThemedText>
                    {isSelected ? (
                      <ThemedText style={styles.checkmark}>✓</ThemedText>
                    ) : null}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  valueText: {
    flex: 1,
    fontFamily: "Montserrat-Regular",
  },
  chevron: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: "Montserrat-SemiBold",
  },
  error: {
    marginTop: 8,
    color: "#dc2626",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: "70%",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.3)",
  },
  modalTitle: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  separator: {
    height: 8,
  },
  checkmark: {
    fontSize: 18,
    lineHeight: 18,
    color: "#052772",
    fontFamily: "Montserrat-SemiBold",
  },
});
