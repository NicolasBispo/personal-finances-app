import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Text, View, XStack } from "tamagui";
import { useTransactionItem } from "./TransactionItemProvider";

export const IncomeItem = () => {
  const { transaction } = useTransactionItem();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  // Componente para adicionar informações específicas de receitas
  // Por exemplo, fonte de renda, tipo de receita, etc.
  
  return (
    <View marginTop={8} paddingTop={8} borderTopWidth={1} borderTopColor="#E0E0E0">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={12} color={colors.icon}>
          Fonte: Salário
        </Text>
        <Text fontSize={12} color={colors.icon}>
          Tipo: Fixa
        </Text>
      </XStack>
    </View>
  );
};
