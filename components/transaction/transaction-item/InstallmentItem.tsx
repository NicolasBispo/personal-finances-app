import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useColorScheme } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { useTransactionItem } from "./TransactionItemProvider";

export const InstallmentItem = () => {
  const { transaction } = useTransactionItem();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  // Componente para adicionar informações específicas de parcelas
  // Por exemplo, progresso das parcelas, próximas parcelas, etc.
  
  return (
    <View marginTop={8} paddingTop={8} borderTopWidth={1} borderTopColor="#E0E0E0">
      <YStack space={4}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={12} color={colors.icon}>
            Próxima parcela: {transaction.dueDate ? formatDate(transaction.dueDate) : "N/A"}
          </Text>
          <Text fontSize={12} color={colors.icon}>
            Restam: {transaction.totalInstallments && transaction.installmentNumber 
              ? transaction.totalInstallments - transaction.installmentNumber 
              : 0} parcelas
          </Text>
        </XStack>
        
        {/* Barra de progresso das parcelas */}
        <View 
          backgroundColor="#E0E0E0" 
          height={4} 
          borderRadius={2}
          overflow="hidden"
        >
          <View 
            backgroundColor={colors.tint}
            height="100%"
            width={`${transaction.installmentNumber && transaction.totalInstallments 
              ? (transaction.installmentNumber / transaction.totalInstallments) * 100 
              : 0}%`}
          />
        </View>
      </YStack>
    </View>
  );
};
