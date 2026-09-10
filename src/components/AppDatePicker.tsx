import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { useTheme, useThemeColor } from "@contexts/ThemeContext";
import { Colors } from "@theme/colors";
import { ThemedText } from "@components/ThemedText";

type AppDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label?: string;
  placeholder?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  control?: Control<TFieldValues>;
  name?: TName;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
};

const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateValue = (value?: string) => {
  if (!value) return new Date();

  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : new Date();
};

const displayDateValue = (value?: string) =>
  value
    ? parseDateValue(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

export function AppDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder = "Select date",
  error,
  containerStyle,
  control,
  name,
  value,
  onChange,
  disabled = false,
  minimumDate,
  maximumDate,
}: AppDatePickerProps<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useTheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const placeholderColor = useThemeColor({}, "muted");
  const theme = Colors[colorScheme];

  const renderPicker = (
    selectedValue: string | undefined,
    setValue: (value: string) => void,
  ) => {
    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === "android") setIsOpen(false);
      if (event.type === "set" && selectedDate) {
        setValue(formatDateValue(selectedDate));
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <ThemedText type="subtitle">{label}</ThemedText> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label ?? placeholder}
          disabled={disabled}
          onPress={() => setIsOpen(true)}
          style={[
            styles.input,
            { backgroundColor, borderColor },
            disabled && styles.disabled,
            error && styles.inputError,
          ]}
        >
          <ThemedText
            style={{ color: selectedValue ? textColor : placeholderColor }}
          >
            {displayDateValue(selectedValue) || placeholder}
          </ThemedText>
          <Ionicons name="calendar-outline" size={20} color={theme.primary} />
        </Pressable>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        {isOpen ? (
          <DateTimePicker
            value={parseDateValue(selectedValue)}
            mode="date"
            display="default"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={handleChange}
          />
        ) : null}
      </View>
    );
  };

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange: onFieldChange, value: fieldValue } }) =>
          renderPicker(fieldValue as string | undefined, onFieldChange)
        }
      />
    );
  }

  return renderPicker(value, onChange ?? (() => {}));
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    marginTop: 8,
    color: "#dc2626",
  },
});
