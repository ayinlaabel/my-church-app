import {
  Keyboard,
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  type KeyboardAvoidingViewProps,
} from "react-native";

export function KeyboardAvoidingView({
  behavior = Platform.OS === "ios" ? "padding" : "height",
  ...props
}: KeyboardAvoidingViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <NativeKeyboardAvoidingView behavior={behavior} {...props} />
    </TouchableWithoutFeedback>
  );
}
