import { Colors } from "@/constants/Colors";
import { TransactionType } from "@/types/transaction";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { useTransactionItem } from "./TransactionItemProvider";

export const TransactionItemContainer = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;
  const { isIncome, transactionItemIcon, transaction, transactionTypeDisplay } =
    useTransactionItem();
  const router = useRouter();

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM", { locale: ptBR });
  };

  const formatCurrency = (amountInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amountInCents / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "received":
        return "#27AE60";
      case "pending":
        return "#F39C12";
      case "cancelled":
        return "#E74C3C";
      default:
        return colors.icon;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pago";
      case "RECEIVED":
        return "Recebido";
      case "PENDING":
        return "Pendente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const renderTransactionContent = () => {
    switch (transaction.type) {
      case TransactionType.INSTALLMENT:
        return (
          <YStack flex={1} space={8}>
            {/* Header com ícone e descrição */}
            <XStack alignItems="center" space={8}>
              <View
                backgroundColor={isIncome ? colors.tint + "20" : "#E74C3C20"}
                padding={8}
                borderRadius={8}
              >
                {transactionItemIcon}
              </View>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color={colors.text}>
                  {transaction.description}
                </Text>
                <Text fontSize={14} color={colors.icon}>
                  {formatDate(transaction.date)}
                </Text>
              </YStack>
            </XStack>

            {/* Informações de parcela */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" space={6}>
                <View
                  backgroundColor={colors.tint + "15"}
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={6}
                >
                  <Text fontSize={12} fontWeight="600" color={colors.tint}>
                    Parcela {transaction.installmentNumber}/{transaction.totalInstallments}
                  </Text>
                </View>
                <View
                  backgroundColor={getStatusColor(transaction.status) + "20"}
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={6}
                >
                  <Text
                    fontSize={12}
                    fontWeight="600"
                    color={getStatusColor(transaction.status)}
                  >
                    {getStatusText(transaction.status)}
                  </Text>
                </View>
              </XStack>
              <Text fontSize={18} fontWeight="700" color={isIncome ? colors.tint : "#E74C3C"}>
                {formatCurrency(transaction.amountInCents)}
              </Text>
            </XStack>
          </YStack>
        );

      case TransactionType.RECURRING:
        return (
          <YStack flex={1} space={8}>
            {/* Header com ícone e descrição */}
            <XStack alignItems="center" space={8}>
              <View
                backgroundColor={colors.tint + "20"}
                padding={8}
                borderRadius={8}
              >
                {transactionItemIcon}
              </View>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color={colors.text}>
                  {transaction.description}
                </Text>
                <Text fontSize={14} color={colors.icon}>
                  {formatDate(transaction.date)}
                </Text>
              </YStack>
            </XStack>

            {/* Informações de recorrência */}
            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" space={6}>
                <View
                  backgroundColor="#9B59B620"
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={6}
                >
                  <Text fontSize={12} fontWeight="600" color="#9B59B6">
                    {transaction.recurrencePattern === "monthly" ? "Mensal" : 
                     transaction.recurrencePattern === "weekly" ? "Semanal" : 
                     transaction.recurrencePattern === "yearly" ? "Anual" : "Recorrente"}
                  </Text>
                </View>
                <View
                  backgroundColor={getStatusColor(transaction.status) + "20"}
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={6}
                >
                  <Text
                    fontSize={12}
                    fontWeight="600"
                    color={getStatusColor(transaction.status)}
                  >
                    {getStatusText(transaction.status)}
                  </Text>
                </View>
              </XStack>
              <Text fontSize={18} fontWeight="700" color={isIncome ? colors.tint : "#E74C3C"}>
                {formatCurrency(transaction.amountInCents)}
              </Text>
            </XStack>
          </YStack>
        );

      case TransactionType.EXPENSE:
        return (
          <YStack flex={1} space={8}>
            {/* Header com ícone e descrição */}
            <XStack alignItems="center" space={8}>
              <View
                backgroundColor="#E74C3C20"
                padding={8}
                borderRadius={8}
              >
                {transactionItemIcon}
              </View>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color={colors.text}>
                  {transaction.description}
                </Text>
                <Text fontSize={14} color={colors.icon}>
                  {formatDate(transaction.date)}
                </Text>
              </YStack>
            </XStack>

            {/* Status e valor */}
            <XStack justifyContent="space-between" alignItems="center">
              <View
                backgroundColor={getStatusColor(transaction.status) + "20"}
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={6}
              >
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={getStatusColor(transaction.status)}
                >
                  {getStatusText(transaction.status)}
                </Text>
              </View>
              <Text fontSize={18} fontWeight="700" color="#E74C3C">
                -{formatCurrency(transaction.amountInCents)}
              </Text>
            </XStack>
          </YStack>
        );

      case TransactionType.INCOME:
        return (
          <YStack flex={1} space={8}>
            {/* Header com ícone e descrição */}
            <XStack alignItems="center" space={8}>
              <View
                backgroundColor={colors.tint + "20"}
                padding={8}
                borderRadius={8}
              >
                {transactionItemIcon}
              </View>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color={colors.text}>
                  {transaction.description}
                </Text>
                <Text fontSize={14} color={colors.icon}>
                  {formatDate(transaction.date)}
                </Text>
              </YStack>
            </XStack>

            {/* Status e valor */}
            <XStack justifyContent="space-between" alignItems="center">
              <View
                backgroundColor={getStatusColor(transaction.status) + "20"}
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={6}
              >
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={getStatusColor(transaction.status)}
                >
                  {getStatusText(transaction.status)}
                </Text>
              </View>
              <Text fontSize={18} fontWeight="700" color={colors.tint}>
                +{formatCurrency(transaction.amountInCents)}
              </Text>
            </XStack>
          </YStack>
        );

      default:
        return (
          <YStack flex={1} space={8}>
            {/* Descrição e Tipo */}
            <XStack alignItems="center" space={8}>
              <View
                backgroundColor={isIncome ? colors.tint + "20" : "#E74C3C20"}
                padding={8}
                borderRadius={8}
              >
                {transactionItemIcon}
              </View>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color={colors.text}>
                  {transaction.description}
                </Text>
                <Text fontSize={14} color={colors.icon}>
                  {formatDate(transaction.date)}
                </Text>
              </YStack>
            </XStack>

            {/* Status */}
            <XStack alignItems="center" space={6}>
              <View
                backgroundColor={getStatusColor(transaction.status) + "20"}
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={6}
              >
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={getStatusColor(transaction.status)}
                >
                  {getStatusText(transaction.status)}
                </Text>
              </View>
            </XStack>
          </YStack>
        );
    }
  };

  // Exemplo de como navegar para a lista de parcelas de uma transação específica
  // Você pode adicionar este botão ou funcionalidade em qualquer lugar do app
  const handleViewInstallments = (transactionId: string) => {
    router.push(`/installments/transaction/${transactionId}`);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        backgroundColor="white"
        padding={16}
        borderRadius={12}
        borderWidth={1}
        borderColor="#E0E0E0"
        marginBottom={8}
      >
        {renderTransactionContent()}
        {children}
      </View>
    </TouchableOpacity>
  );
};
