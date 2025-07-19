import { InstallmentTransactionHeader } from "@/components/layouts/InstallmentTransactionHeader";
import { Colors } from "@/constants/Colors";
import { useTransactionQueries } from "@/hooks/useTransactionQueries";
import { Transaction, TransactionType } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, RefreshControl, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function InstallmentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  // Buscar todas as transações parceladas
  const { expensesQuery, receivesQuery } = useTransactionQueries();
  
  // Filtrar apenas transações parceladas
  const installmentTransactions = useMemo(() => {
    const expenses = expensesQuery.data || [];
    const receives = receivesQuery.data || [];
    
    const allTransactionsData = [...expenses, ...receives];
    
    return allTransactionsData.filter(
      (transaction) => transaction.type === TransactionType.INSTALLMENT
    );
  }, [expensesQuery.data, receivesQuery.data]);

  // Estados de loading e erro
  const isLoading = expensesQuery.isLoading || receivesQuery.isLoading;
  const error = expensesQuery.error || receivesQuery.error;
  const refetch = () => {
    expensesQuery.refetch();
    receivesQuery.refetch();
  };

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
      return (transaction.installmentNumber / transaction.totalInstallments) * 100;
    }
    return 0;
  };

  const calculateTotalAmount = (transaction: Transaction) => {
    if (transaction.totalInstallments && transaction.amountInCents) {
      return transaction.totalInstallments * transaction.amountInCents;
    }
    return transaction.amountInCents;
  };

  const handleInstallmentPress = useCallback((transaction: Transaction) => {
    // Se a transação tem parentTransactionId, navega para a lista de parcelas da transação pai
    if (transaction.parentTransactionId) {
      router.push(`/installments/transaction/${transaction.parentTransactionId}`);
    } else {
      // Se não tem pai, navega para os detalhes da própria transação
      router.push(`/installments/${transaction.id}`);
    }
  }, [router]);

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
              <Text fontSize={12} fontWeight="600" color={getStatusColor(item.status)}>
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

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={14} color={colors.icon}>
                Valor Total
              </Text>
              <Text fontSize={14} fontWeight="600" color={colors.text}>
                {formatCurrencyFromCents(calculateTotalAmount(item))}
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

          {/* Próxima parcela */}
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
                    Próxima Parcela
                  </Text>
                  <Text fontSize={12} color={colors.icon}>
                    {formatDate(item.dueDate)}
                  </Text>
                </YStack>
                <MaterialIcons name="chevron-right" size={20} color={colors.icon} />
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
      <Text fontSize={18} fontWeight="600" color={colors.text} textAlign="center" marginBottom={8}>
        Nenhuma parcela encontrada
      </Text>
      <Text fontSize={14} color={colors.icon} textAlign="center">
        Você ainda não possui transações parceladas
      </Text>
    </YStack>
  );

  const totalInstallments = installmentTransactions.length;
  const totalAmount = installmentTransactions.reduce((sum, transaction) => {
    return sum + calculateTotalAmount(transaction);
  }, 0);

  return (
    <View flex={1} backgroundColor="#F8F9FA">

      <InstallmentTransactionHeader title="Parcelas" />
      
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
              Total de Parcelas
            </Text>
            <Text fontSize={16} fontWeight="600" color={colors.text}>
              {totalInstallments}
            </Text>
          </XStack>
          
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Valor Total
            </Text>
            <Text fontSize={16} fontWeight="600" color={colors.text}>
              {formatCurrencyFromCents(totalAmount)}
            </Text>
          </XStack>
        </YStack>
      </View>

      {/* Lista de parcelas */}
      <View flex={1} padding={16}>
        {isLoading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text fontSize={16} color={colors.icon}>
              Carregando...
            </Text>
          </YStack>
        ) : error ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Text fontSize={16} color="#E74C3C">
              Erro ao carregar parcelas
            </Text>
          </YStack>
        ) : (
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
        )}
      </View>
    </View>
  );
} 