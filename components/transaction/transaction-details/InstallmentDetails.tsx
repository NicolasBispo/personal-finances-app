import { Colors } from "@/constants/Colors";
import { TransactionService } from "@/services/transactionService";
import { TransactionStatus } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import { Text, View, XStack, YStack } from "tamagui";
import { BaseTransactionDetails } from "./BaseTransactionDetails";
import { useTransactionDetails } from "./TransactionDetailsProvider";

export const InstallmentDetails = () => {
  const { transaction, updateTransactionStatus, setTransaction, deleteInstallmentMutation } = useTransactionDetails();

  const colors = Colors.light;
  const router = useRouter();

 

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const handleUpdateTransactionStatus = (status: TransactionStatus) => {
    updateTransactionStatus(status);
    setTransaction({ ...transaction, status });
  };

  const calculateTotalAmount = () => {
    if (transaction.totalInstallments && transaction.amountInCents) {
      return transaction.totalInstallments * transaction.amountInCents;
    }
    return transaction.amountInCents;
  };

  const calculateProgress = () => {
    if (transaction.installmentNumber && transaction.totalInstallments) {
      return (
        (transaction.installmentNumber / transaction.totalInstallments) * 100
      );
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
    <BaseTransactionDetails>
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
                  {formatCurrencyFromCents(
                    transaction.amountInCents * (getRemainingInstallments() - 1)
                  )}
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
              backgroundColor={
                transaction.status === TransactionStatus.PAID
                  ? "red"
                  : colors.tint + "20"
              }
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Marca parcela como paga
                const status =
                  transaction.status === TransactionStatus.PAID
                    ? TransactionStatus.PENDING
                    : TransactionStatus.PAID;
                handleUpdateTransactionStatus(status);
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons
                  name={
                    transaction.status === TransactionStatus.PAID
                      ? "cancel"
                      : "check-circle"
                  }
                  size={20}
                  color={
                    transaction.status === TransactionStatus.PAID
                      ? "white"
                      : colors.tint
                  }
                />
                <Text
                  fontSize={14}
                  fontWeight="600"
                  color={
                    transaction.status === TransactionStatus.PAID
                      ? "white"
                      : colors.tint
                  }
                >
                  {transaction.status === TransactionStatus.PAID
                    ? "Desmarcar"
                    : "Pagar Parcela"}
                </Text>
              </XStack>
            </View>

            <View
              backgroundColor="#9B59B620"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Navega para a lista de parcelas
                router.push(`/installments/transaction/${transaction.parentTransactionId}`);
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="list" size={20} color="#9B59B6" />
                <Text fontSize={14} fontWeight="600" color="#9B59B6">
                  Ver Todas
                </Text>
              </XStack>
            </View>
          </XStack>
        </YStack>
      </YStack>
    </BaseTransactionDetails>
  );
};
