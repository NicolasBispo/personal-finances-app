import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Text, View, XStack } from "tamagui";
import { useTransactionItem } from "./TransactionItemProvider";

export const ExpenseItem = () => {
  const { transaction } = useTransactionItem();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  // Componente para adicionar informações específicas de despesas
  // Por exemplo, categoria, método de pagamento, etc.
  
  return (
    <View marginTop={8} paddingTop={8} borderTopWidth={1} borderTopColor="#E0E0E0">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={12} color={colors.icon}>
          Categoria: Geral
        </Text>
        <Text fontSize={12} color={colors.icon}>
          Método: Dinheiro
        </Text>
      </XStack>
    </View>
  );
};
