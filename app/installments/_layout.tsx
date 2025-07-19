import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function InstallmentsLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Esconde o header padrão
        contentStyle: {
          backgroundColor: "#F8F9FA",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Parcelas",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          title: "Detalhes da Parcela",
        }}
      />
      <Stack.Screen
        name="transaction/[transactionId]"
        options={{
          headerShown: false,
          title: "Parcelas da Transação",
        }}
      />
    </Stack>
  );
} 