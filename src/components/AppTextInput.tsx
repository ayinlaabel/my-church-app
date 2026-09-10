import { type TextInputProps, StyleSheet, TextInput, View } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { useTheme, useThemeColor } from "@contexts/ThemeContext";
import { ThemedText } from "@components/ThemedText";
import { Colors } from "@theme/colors";

export type AppTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: TextInputProps["style"];
  control?: Control<TFieldValues>;
  name?: TName;
  disabled?: boolean;
};

export function AppTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  error,
  style,
  containerStyle,
  placeholderTextColor,
  control,
  name,
  disabled = false,
  editable,
  ...rest
}: AppTextInputProps<TFieldValues, TName>) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const placeholderColor = placeholderTextColor ?? useThemeColor({}, "muted");
  const { colorScheme } = useTheme();

  const inputComponent = (
    <View
      style={[
        styles.container,
        containerStyle,
        disabled && {
          backgroundColor: Colors[colorScheme].muted,
        },
      ]}
    >
      {label ? (
        <ThemedText type="subtitle" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <TextInput
        style={[
          styles.input,
          { backgroundColor, borderColor, color: textColor },
          error && styles.inputError,
          disabled && styles.disabled,
          style,
        ]}
        placeholderTextColor={placeholderColor}
        editable={disabled ? false : editable}
        {...rest}
      />
      {error ? (
        <ThemedText type="subtitle" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.container, containerStyle]}>
            {label ? (
              <ThemedText type="subtitle" style={styles.label}>
                {label}
              </ThemedText>
            ) : null}
            <TextInput
              style={[
                styles.input,
                { backgroundColor, borderColor, color: textColor },
                error && styles.inputError,
                disabled && styles.disabled,
                style,
              ]}
              placeholderTextColor={placeholderColor}
              editable={disabled ? false : editable}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              {...rest}
            />
            {error ? (
              <ThemedText type="subtitle" style={styles.error}>
                {error}
              </ThemedText>
            ) : null}
          </View>
        )}
      />
    );
  }

  return inputComponent;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  label: {
    // marginBottom: 8,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
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
