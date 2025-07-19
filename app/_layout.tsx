import { AuthProvider } from "@/providers/AuthProvider";
import { PlannerProvider } from "@/providers/PlannerProvider";
import { TransactionBottomSheetProvider } from "@/providers/TransactionBottomSheetProvider";
import {
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <AuthProvider>
            <PlannerProvider>
              <TransactionBottomSheetProvider>
                <ThemeProvider value={DefaultTheme}>
                  <Stack initialRouteName="index">
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="installments" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                  </Stack>
                  <StatusBar style="auto" />
                </ThemeProvider>
              </TransactionBottomSheetProvider>
            </PlannerProvider>
          </AuthProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
