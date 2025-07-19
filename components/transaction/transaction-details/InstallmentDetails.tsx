import { Colors } from "@/constants/Colors";
import { Transaction } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import { Button, ButtonText, Text, View, XStack, YStack } from "tamagui";
import { BaseTransactionDetails } from "./BaseTransactionDetails";

interface InstallmentDetailsProps {
  transaction: Transaction;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const InstallmentDetails = ({
  transaction,
  onUpdate,
  onDelete,
  onCancel,
  isLoading,
  isUpdating,
  isDeleting,
}: InstallmentDetailsProps) => {
  const colors = Colors.light;
  const router = useRouter();

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const calculateTotalAmount = () => {
    if (transaction.totalInstallments && transaction.amountInCents) {
      return transaction.totalInstallments * transaction.amountInCents;
    }
    return transaction.amountInCents;
  };

  const calculateProgress = () => {
    if (transaction.installmentNumber && transaction.totalInstallments) {
      return (transaction.installmentNumber / transaction.totalInstallments) * 100;
    }
    return 0;
  };

  const getRemainingInstallments = () => {
    if (transaction.installmentNumber && transaction.totalInstallments) {
      return transaction.totalInstallments - transaction.installmentNumber;
    }
    return 0;
  };

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
      {/* Informações de Parcelas */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Informações das Parcelas
        </Text>
        
        <YStack space={8}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Parcela Atual
            </Text>
            <View
              backgroundColor={colors.tint + "20"}
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color={colors.tint}>
                {transaction.installmentNumber}/{transaction.totalInstallments}
              </Text>
            </View>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Valor da Parcela
            </Text>
            <Text fontSize={14} fontWeight="600" color={colors.text}>
              {formatCurrencyFromCents(transaction.amountInCents)}
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Valor Total
            </Text>
            <Text fontSize={14} fontWeight="600" color={colors.text}>
              {formatCurrencyFromCents(calculateTotalAmount())}
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Parcelas Restantes
            </Text>
            <Text fontSize={14} fontWeight="600" color="#F39C12">
              {getRemainingInstallments()}
            </Text>
          </XStack>
        </YStack>

        {/* Barra de Progresso */}
        <YStack space={4}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={12} color={colors.icon}>
              Progresso
            </Text>
            <Text fontSize={12} fontWeight="600" color={colors.text}>
              {Math.round(calculateProgress())}%
            </Text>
          </XStack>
          
          <View 
            backgroundColor="#E0E0E0" 
            height={8} 
            borderRadius={4}
            overflow="hidden"
          >
            <View 
              backgroundColor={colors.tint}
              height="100%"
              width={`${calculateProgress()}%`}
            />
          </View>
        </YStack>
      </YStack>

      {/* Próximas Parcelas */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Próximas Parcelas
        </Text>
        
        <YStack space={8}>
          {transaction.dueDate && (
            <View
              backgroundColor="#F8F9FA"
              padding={12}
              borderRadius={8}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text fontSize={14} fontWeight="600" color={colors.text}>
                    Próxima Parcela
                  </Text>
                  <Text fontSize={12} color={colors.icon}>
                    {formatDate(transaction.dueDate)}
                  </Text>
                </YStack>
                <Text fontSize={14} fontWeight="600" color={colors.text}>
                  {formatCurrencyFromCents(transaction.amountInCents)}
                </Text>
              </XStack>
            </View>
          )}

          {getRemainingInstallments() > 1 && (
            <View
              backgroundColor="#F8F9FA"
              padding={12}
              borderRadius={8}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text fontSize={14} fontWeight="600" color={colors.text}>
                    Parcelas Futuras
                  </Text>
                  <Text fontSize={12} color={colors.icon}>
                    {getRemainingInstallments() - 1} parcelas restantes
                  </Text>
                </YStack>
                <Text fontSize={14} fontWeight="600" color={colors.text}>
                  {formatCurrencyFromCents(transaction.amountInCents * (getRemainingInstallments() - 1))}
                </Text>
              </XStack>
            </View>
          )}
        </YStack>
      </YStack>

      {/* Ações Específicas de Parcelas */}
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
                // Marca parcela como paga
                onUpdate({
                  ...transaction,
                  status: "PAID",
                  dateOccurred: new Date(),
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="payment" size={20} color={colors.tint} />
                <Text fontSize={14} fontWeight="600" color={colors.tint}>
                  Pagar Parcela
                </Text>
              </XStack>
            </View>
            
            <View
              backgroundColor="#9B59B620"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Adia a parcela
                const newDate = new Date(transaction.date);
                newDate.setDate(newDate.getDate() + 7); // Adia 7 dias
                onUpdate({
                  ...transaction,
                  date: newDate,
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="schedule" size={20} color="#9B59B6" />
                <Text fontSize={14} fontWeight="600" color="#9B59B6">
                  Adiar Parcela
                </Text>
              </XStack>
            </View>
          </XStack>
        </YStack>
      </YStack>

      {/* Navegação para Tela de Parcelas */}
      <YStack space={12} marginTop={16}>
        <Button
          backgroundColor={colors.tint}
          onPress={() => router.push(`/installments/transaction/${transaction.parentTransactionId}`)}
        >
          <XStack alignItems="center" space={8}>
            <MaterialIcons name="list" size={20} color="white" />
            <ButtonText color="white" fontWeight="600">
              Ver Todas as Parcelas
            </ButtonText>
          </XStack>
        </Button>
      </YStack>
    </BaseTransactionDetails>
  );
}; 