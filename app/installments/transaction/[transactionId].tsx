import { InstallmentTransactionHeader } from "@/components/layouts/InstallmentTransactionHeader";
import { Colors } from "@/constants/Colors";
import { TransactionService } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function TransactionInstallmentsScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  // Query para buscar a transação parcelada principal
  const installmentQuery = useQuery({
    queryKey: ["installment", transactionId],
    queryFn: () => TransactionService.getInstallmentById(transactionId!),
    enabled: !!transactionId,
  });

  // Query para buscar as parcelas da transação parcelada
  const installmentsQuery = useQuery({
    queryKey: ["installment-installments", transactionId],
    queryFn: () =>
      TransactionService.getInstallmentInstallments(transactionId!),
    enabled: !!transactionId,
  });

  // Estados de loading e erro
  const isLoading = installmentQuery.isLoading || installmentsQuery.isLoading;
  const error = installmentQuery.error || installmentsQuery.error;
  const refetch = () => {
    installmentQuery.refetch();
    installmentsQuery.refetch();
  };

  console.log("isntallment quert data", installmentQuery.data);

  // Dados das queries
  const parentTransaction = installmentQuery.data;
  const installmentTransactions = installmentsQuery.data || [];

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "RECEIVED":
        return "#27AE60";
      case "PENDING":
        return "#F39C12";
      case "CANCELLED":
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

  const calculateProgress = (transaction: Transaction) => {
    if (transaction.installmentNumber && transaction.totalInstallments) {
      return (
        (transaction.installmentNumber / transaction.totalInstallments) * 100
      );
    }
    return 0;
  };

  const calculateTotalAmount = (transaction: Transaction) => {
    return transaction.amountInCents;
  };

  const handleInstallmentPress = useCallback(
    (transaction: Transaction) => {
      router.push(`/installments/${transaction.id}`);
    },
    [router]
  );

  const renderInstallmentItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity onPress={() => handleInstallmentPress(item)}>
      <View
        backgroundColor="white"
        padding={16}
        borderRadius={12}
        borderWidth={1}
        borderColor="#E0E0E0"
        marginBottom={8}
      >
        <YStack space={12}>
          {/* Header com descrição e status */}
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} space={4}>
              <Text fontSize={16} fontWeight="600" color={colors.text}>
                {item.description}
              </Text>
              <Text fontSize={14} color={colors.icon}>
                {formatDate(item.date)}
              </Text>
            </YStack>
            <View
              backgroundColor={getStatusColor(item.status) + "20"}
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text
                fontSize={12}
                fontWeight="600"
                color={getStatusColor(item.status)}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
          </XStack>

          {/* Informações de parcela */}
          <YStack space={8}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={14} color={colors.icon}>
                Parcela {item.installmentNumber}/{item.totalInstallments}
              </Text>
              <Text fontSize={16} fontWeight="600" color={colors.text}>
                {formatCurrencyFromCents(item.amountInCents)}
              </Text>
            </XStack>

            {/* Barra de progresso */}
            <YStack space={4}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={12} color={colors.icon}>
                  Progresso
                </Text>
                <Text fontSize={12} fontWeight="600" color={colors.text}>
                  {Math.round(calculateProgress(item))}%
                </Text>
              </XStack>

              <View
                backgroundColor="#E0E0E0"
                height={6}
                borderRadius={3}
                overflow="hidden"
              >
                <View
                  backgroundColor={colors.tint}
                  height="100%"
                  width={`${calculateProgress(item)}%`}
                />
              </View>
            </YStack>
          </YStack>

          {/* Data de vencimento */}
          {item.dueDate && (
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
                    Vencimento
                  </Text>
                  <Text fontSize={12} color={colors.icon}>
                    {formatDate(item.dueDate)}
                  </Text>
                </YStack>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={colors.icon}
                />
              </XStack>
            </View>
          )}
        </YStack>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" padding={32}>
      <View
        backgroundColor={colors.tint + "20"}
        padding={24}
        borderRadius={50}
        marginBottom={16}
      >
        <MaterialIcons name="credit-card" size={48} color={colors.tint} />
      </View>
      <Text
        fontSize={18}
        fontWeight="600"
        color={colors.text}
        textAlign="center"
        marginBottom={8}
      >
        Nenhuma parcela encontrada
      </Text>
      <Text fontSize={14} color={colors.icon} textAlign="center">
        Esta transação não possui parcelas
      </Text>
    </YStack>
  );

  const totalInstallments = installmentTransactions.length;
  const paidInstallments = installmentTransactions.filter(
    (transaction) =>
      transaction.status === "PAID" || transaction.status === "RECEIVED"
  ).length;

  if (isLoading) {
    return (
      <View flex={1} backgroundColor="#F8F9FA">
        <InstallmentTransactionHeader title="Parcelas" showBackButton />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={colors.tint} />
        </YStack>
      </View>
    );
  }

  if (error || !parentTransaction) {
    return (
      <View flex={1} backgroundColor="#F8F9FA">
        <InstallmentTransactionHeader title="Parcelas" showBackButton />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize={16} color="#E74C3C">
            Transação não encontrada
          </Text>
        </YStack>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="#F8F9FA">
      <InstallmentTransactionHeader title="Parcelas" showBackButton />

      {/* Informações da transação pai */}
      <View
        backgroundColor="white"
        padding={16}
        borderBottomWidth={1}
        borderBottomColor="#E0E0E0"
      >
        <YStack space={12}>
          <Text fontSize={18} fontWeight="600" color={colors.text}>
            {parentTransaction.description}
          </Text>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={16} color={colors.icon}>
              Valor Total
            </Text>
            <Text fontSize={18} fontWeight="600" color={colors.text}>
              {formatCurrencyFromCents(parentTransaction.amountInCents)}
            </Text>
          </XStack>
        </YStack>
      </View>

      {/* Estatísticas */}
      <View
        backgroundColor="white"
        padding={16}
        borderBottomWidth={1}
        borderBottomColor="#E0E0E0"
      >
        <YStack space={12}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Parcelas Pagas
            </Text>
            <Text fontSize={16} fontWeight="600" color={colors.text}>
              {paidInstallments} de {totalInstallments}
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Valor Pago
            </Text>
            <Text fontSize={16} fontWeight="600" color={colors.text}>
              {formatCurrencyFromCents(
                paidInstallments * (parentTransaction.amountInCents || 0)
              )}
            </Text>
          </XStack>
        </YStack>
      </View>

      {/* Lista de parcelas */}
      <View flex={1} padding={16}>
        <FlatList
          data={installmentTransactions}
          renderItem={renderInstallmentItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[colors.tint]}
              tintColor={colors.tint}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
        />
      </View>
    </View>
  );
}
