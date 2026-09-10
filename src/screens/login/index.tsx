import { AppButton } from "@components/AppButton";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";
import { ThemedView } from "@components/ThemedView";
import { Alert, Image, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as LocalAuthentication from "expo-local-authentication";
import { ThemedText } from "@components/ThemedText";
import { AppTextInput } from "@components/AppTextInput";
import { FormState, SubmitHandler, useForm } from "react-hook-form";
import { useLogin } from "@hooks/useAuth";
import { useAuth } from "@contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "..";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@declared-types/index";

type LoginFormValues = {
  email: string;
  password: string;
};

WebBrowser.maybeCompleteAuthSession();

// Endpoint configuration for KingsChat OAuth
const discovery = {
  authorizationEndpoint: "https://accounts.kingschat.online/oauth/authorize",
  tokenEndpoint: "https://connect.kingsch.at/developer/oauth/token",
};

const LoginScreen = () => {
  const { isAuthenticated, profile, setUser, updateProfile, setToken } =
    useAuth();

  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { control, handleSubmit, setValue, getValues, formState } =
    useForm<LoginFormValues>({
      defaultValues: {
        email: profile && profile.email ? profile.email : "",
        password: "",
      },
      mode: "all",
    });

  const { mutate, isPending } = useLogin({
    onSuccess(res) {
      console.log("Login successful: ", res);
      setToken(res.data.token);
      updateProfile(res.data.profile);
      setUser(res.data.user);
      navigate(ScreenNames.DASHBOARDSCREEN);
    },
    onFailed(err) {
      console.log("Login failed: ", err);
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    console.log("Form submitted with values:", values);
    mutate(values);
  };

  const handleBiometricLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        "Biometric login unavailable",
        "Set up Face ID, Touch ID, or a fingerprint on this device first.",
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Sign in to My Church App",
    });

    if (!result.success) {
      if (result.error !== "user_cancel" && result.error !== "system_cancel") {
        Alert.alert(
          "Biometric login failed",
          "Please try again or use your password.",
        );
      }
      return;
    }

    navigate(ScreenNames.DASHBOARDSCREEN);
  };

  // const CLIENT_ID = "932eba46-0246-464f-8a25-60986d0f829a";
  // const redirectUri = AuthSession.makeRedirectUri({
  //   scheme: "mychurchapp-dev",
  // });

  // const handleKingsChatLogin = async () => {
  //   // KingsChat OAuth endpoint URL
  //   const authUrl = `https://accounts.kingschat.online/log-in?clientId=${CLIENT_ID}&origin=${encodeURIComponent(redirectUri)}`;

  //   await WebBrowser.openAuthSessionAsync(authUrl, redirectUri).then((res) =>
  //     console.log("res: ", res),
  //   );

  //   // if (result.type === "success") {
  //   //   const { url } = result;
  //   //   // Extract the 'code' query parameter from url and exchange it for a token on your backend
  //   //   console.log("Returned URL:", url);
  //   // }
  // };
  return (
    <ThemedView style={[styles.container]}>
      <KeyboardAvoidingView
        style={[
          {
            flex: 1,
            // alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingHorizontal: 20,
          },
        ]}
      >
        <View style={[styles.headerContainer]}>
          <View style={[styles.headerImage]}>
            <Image
              source={require("@assets/images/ce_logo.png")}
              style={{ height: "100%", width: "100%", resizeMode: "contain" }}
            />
          </View>
          <View style={[styles.headerContent]}>
            <ThemedText type="title">Christ Embassy Yaba</ThemedText>
            <ThemedText>...giving your life a meaning.</ThemedText>
          </View>
        </View>
        <View style={[styles.formContainer]}>
          <AppTextInput
            control={control}
            name="email"
            label="Email"
            error={formState.errors.email?.message}
            keyboardType="email-address"
            disabled={profile && isAuthenticated ? true : false}
          />
          {!profile && !isAuthenticated && (
            <AppTextInput
              control={control}
              name="password"
              label="Password"
              secureTextEntry
              error={formState.errors.password?.message}
            />
          )}
          <AppButton
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            // onPress={() => navigate(ScreenNames.DASHBOARDSCREEN)}
            loading={isPending}
          />
          {profile && isAuthenticated ? (
            <AppButton
              title="Sign in with biometrics"
              onPress={handleBiometricLogin}
              variant="outline"
            />
          ) : null}
        </View>
        {/* <AppButton title="Sign via Kingschat" onPress={handleKingsChatLogin} /> */}
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {},
  headerImage: {
    height: 50,
    width: 100,
    alignSelf: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  formContainer: {
    gap: 20,
    marginVertical: 20,
  },
});
