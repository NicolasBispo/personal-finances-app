import { TransactionDetailsBottomSheet } from "@/components/bottom-sheet";
import TabsLayout from "@/components/layouts/TabsLayout";
import TransactionItem from "@/components/transaction/transaction-item";
import { Colors } from "@/constants/Colors";
import { useTransactionQueries } from "@/hooks/useTransactionQueries";
import { useTransactionBottomSheet } from "@/providers/TransactionBottomSheetProvider";
import { Transaction } from "@/types/transaction";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";

export default function ReceivesTab() {
  const colors = Colors.light;
  const { openTransactionSheet } = useTransactionBottomSheet();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const { receivesQuery, dateRange } = useTransactionQueries();
  const { data: transactions, isLoading, error, refetch } = receivesQuery;

  const handleOpenForm = useCallback(() => {
    openTransactionSheet("INCOME", ["receives", "transactions", dateRange.startDate.toISOString().split('T')[0], dateRange.endDate.toISOString().split('T')[0]]);
  }, [openTransactionSheet, dateRange]);

  const handleTransactionPress = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsVisible(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsVisible(false);
    setSelectedTransaction(null);
  }, []);

  const renderEmptyState = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" padding={32}>
      <View
        backgroundColor={colors.tint + "20"}
        padding={24}
        borderRadius={50}
        marginBottom={16}
      >
        <MaterialIcons name="trending-up" size={48} color={colors.tint} />
      </View>
      <Text fontSize={18} fontWeight="600" color={colors.text} textAlign="center" marginBottom={8}>
        Nenhuma receita encontrada
      </Text>
      <Text fontSize={14} color={colors.icon} textAlign="center" marginBottom={24}>
        Comece adicionando sua primeira receita
      </Text>
      <Button
        backgroundColor={colors.tint}
        onPress={handleOpenForm}
        paddingHorizontal={24}
        paddingVertical={12}
        borderRadius={8}
      >
        <XStack alignItems="center" space={8}>
          <MaterialIcons name="add" size={20} color="white" />
          <Text color="white" fontWeight="600">
            Adicionar Receita
          </Text>
        </XStack>
      </Button>
    </YStack>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} onPress={() => handleTransactionPress(item)} />
  );

  const totalIncome = transactions?.reduce((sum, transaction) => sum + transaction.amountInCents, 0) || 0;

  return (
    <TabsLayout>
      <View flex={1} backgroundColor="#F8F9FA">
        {/* Header com estatísticas */}
        <View
          backgroundColor="white"
          padding={16}
          borderBottomWidth={1}
          borderBottomColor="#E0E0E0"
        >
          <YStack space={16}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={20} fontWeight="bold" color={colors.text}>
                Receitas
              </Text>
              <Button
                backgroundColor={colors.tint}
                onPress={handleOpenForm}
                paddingHorizontal={16}
                paddingVertical={8}
                borderRadius={8}
              >
                <XStack alignItems="center" space={6}>
                  <MaterialIcons name="add" size={18} color="white" />
                  <Text color="white" fontWeight="600" fontSize={14}>
                    Nova
                  </Text>
                </XStack>
              </Button>
            </XStack>

            {/* Card de total */}
            <View
              backgroundColor={colors.tint + "10"}
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.tint + "30"}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text fontSize={14} color={colors.icon}>
                    Total de Receitas
                  </Text>
                  <Text fontSize={24} fontWeight="bold" color={colors.tint}>
                    {(totalIncome / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </YStack>
                <View
                  backgroundColor={colors.tint + "20"}
                  padding={12}
                  borderRadius={8}
                >
                  <MaterialIcons name="trending-up" size={24} color={colors.tint} />
                </View>
              </XStack>
            </View>
          </YStack>
        </View>

        {/* Lista de transações */}
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
                Erro ao carregar transações
              </Text>
              <Button
                backgroundColor={colors.tint}
                onPress={() => refetch()}
                marginTop={16}
                paddingHorizontal={16}
                paddingVertical={8}
                borderRadius={8}
              >
                <Text color="white" fontWeight="600">
                  Tentar Novamente
                </Text>
              </Button>
            </YStack>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
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
        {selectedTransaction && (
          <TransactionDetailsBottomSheet
            isVisible={isDetailsVisible}
            onClose={handleCloseDetails}
            transaction={selectedTransaction}
            queryKey={["receives", "transactions", dateRange.startDate.toISOString().split('T')[0], dateRange.endDate.toISOString().split('T')[0]]}
          />
        )}
      </TabsLayout>
  );
}