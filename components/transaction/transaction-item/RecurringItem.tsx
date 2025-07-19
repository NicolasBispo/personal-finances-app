import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useColorScheme } from "react-native";
import { Text, View, XStack } from "tamagui";
import { useTransactionItem } from "./TransactionItemProvider";

export const RecurringItem = () => {
  const { transaction } = useTransactionItem();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  // Componente para adicionar informações específicas de transações recorrentes
  // Por exemplo, próxima ocorrência, frequência, etc.
  
  return (
    <View marginTop={8} paddingTop={8} borderTopWidth={1} borderTopColor="#E0E0E0">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={12} color={colors.icon}>
          Próxima: {transaction.nextOccurrence ? formatDate(transaction.nextOccurrence) : "N/A"}
        </Text>
        <Text fontSize={12} color={colors.icon}>
          Frequência: {transaction.recurrencePattern === "monthly" ? "Mensal" : 
                      transaction.recurrencePattern === "weekly" ? "Semanal" : 
                      transaction.recurrencePattern === "yearly" ? "Anual" : "Personalizada"}
        </Text>
      </XStack>
    </View>
  );
};
