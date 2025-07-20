import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View, XStack, YStack } from "tamagui";
import { BaseTransactionDetails } from "./BaseTransactionDetails";
import { useTransactionDetails } from "./TransactionDetailsProvider";

export const ExpenseDetails = () => {
  const { transaction, onUpdate } = useTransactionDetails();
  const colors = Colors.light;

  return (
    <BaseTransactionDetails>
      {/* Informações Específicas de Despesa */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Informações da Despesa
        </Text>
        
        <YStack space={8}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Tipo
            </Text>
            <View
              backgroundColor="#E74C3C20"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#E74C3C">
                Despesa
              </Text>
            </View>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Categoria
            </Text>
            <Text fontSize={14} fontWeight="500" color={colors.text}>
              Geral
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Método de Pagamento
            </Text>
            <Text fontSize={14} fontWeight="500" color={colors.text}>
              Dinheiro
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Prioridade
            </Text>
            <View
              backgroundColor="#F39C1220"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#F39C12">
                Média
              </Text>
            </View>
          </XStack>
        </YStack>
      </YStack>

      {/* Ações Específicas de Despesa */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Ações Rápidas
        </Text>
        
        <YStack space={8}>
          <XStack space={8}>
            <View
              backgroundColor="#E74C3C20"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Lógica para adiar despesa
                const newDate = new Date(transaction.date);
                newDate.setDate(newDate.getDate() + 7); // Adia 7 dias
                onUpdate({
                  ...transaction,
                  date: newDate,
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="schedule" size={20} color="#E74C3C" />
                <Text fontSize={14} fontWeight="600" color="#E74C3C">
                  Adiar
                </Text>
              </XStack>
            </View>
            
            <View
              backgroundColor="#27AE6020"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Marca como paga
                onUpdate({
                  ...transaction,
                  status: "PAID",
                  dateOccurred: new Date(),
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="check-circle" size={20} color="#27AE60" />
                <Text fontSize={14} fontWeight="600" color="#27AE60">
                  Marcar como Paga
                </Text>
              </XStack>
            </View>
          </XStack>
        </YStack>
      </YStack>
    </BaseTransactionDetails>
  );
}; 