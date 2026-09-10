import { useState } from "react";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./src/contexts/AuthContext";
// import { NotificationProvider } from "@contexts/NotificationContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import AxiosProvider from "@configs/axios";
import RootNavigation from "@navigation/root-navigation";
import { customFonts } from "@constants/fonts/staticFonts";

export default function App() {
  const [loaded] = useFonts(customFonts);
  const [queryClient] = useState(() => new QueryClient());

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* <NotificationProvider> */}
        <AuthProvider>
          <AxiosProvider />
          <RootNavigation />
        </AuthProvider>
        {/* </NotificationProvider> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
