import { Colors } from "@/constants/Colors";
import { Transaction } from "@/types/transaction";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View, XStack, YStack } from "tamagui";
import { BaseTransactionDetails } from "./BaseTransactionDetails";

interface IncomeDetailsProps {
  transaction: Transaction;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const IncomeDetails = ({
  transaction,
  onUpdate,
  onDelete,
  onCancel,
  isLoading,
  isUpdating,
  isDeleting,
}: IncomeDetailsProps) => {
  const colors = Colors.light;

  return (
    <BaseTransactionDetails
      transaction={transaction}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onCancel={onCancel}
      isLoading={isLoading}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
    >
      {/* Informações Específicas de Receita */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Informações da Receita
        </Text>
        
        <YStack space={8}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Tipo
            </Text>
            <View
              backgroundColor={colors.tint + "20"}
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color={colors.tint}>
                Receita
              </Text>
            </View>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Fonte de Renda
            </Text>
            <Text fontSize={14} fontWeight="500" color={colors.text}>
              Salário
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Tipo de Receita
            </Text>
            <Text fontSize={14} fontWeight="500" color={colors.text}>
              Fixa
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Frequência
            </Text>
            <View
              backgroundColor="#9B59B620"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#9B59B6">
                Mensal
              </Text>
            </View>
          </XStack>
        </YStack>
      </YStack>

      {/* Ações Específicas de Receita */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Ações Rápidas
        </Text>
        
        <YStack space={8}>
          <XStack space={8}>
            <View
              backgroundColor={colors.tint + "20"}
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Lógica para receber
                onUpdate({
                  ...transaction,
                  status: "RECEIVED",
                  dateOccurred: new Date(),
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="account-balance-wallet" size={20} color={colors.tint} />
                <Text fontSize={14} fontWeight="600" color={colors.tint}>
                  Receber
                </Text>
              </XStack>
            </View>
            
            <View
              backgroundColor="#27AE6020"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Marca como recebida
                onUpdate({
                  ...transaction,
                  status: "RECEIVED",
                  dateOccurred: new Date(),
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="check-circle" size={20} color="#27AE60" />
                <Text fontSize={14} fontWeight="600" color="#27AE60">
                  Marcar como Recebida
                </Text>
              </XStack>
            </View>
          </XStack>
        </YStack>
      </YStack>

      {/* Estatísticas de Receita */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Estatísticas
        </Text>
        
        <YStack space={8}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Total Recebido este Mês
            </Text>
            <Text fontSize={14} fontWeight="600" color={colors.tint}>
              R$ 5.000,00
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Média Mensal
            </Text>
            <Text fontSize={14} fontWeight="600" color={colors.tint}>
              R$ 4.800,00
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Receitas Pendentes
            </Text>
            <Text fontSize={14} fontWeight="600" color="#F39C12">
              R$ 2.500,00
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </BaseTransactionDetails>
  );
}; 