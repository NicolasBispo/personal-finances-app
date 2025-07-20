import TabsLayout from "@/components/layouts/TabsLayout";
import TransactionItem from "@/components/transaction/transaction-item";
import { Colors } from "@/constants/Colors";
import { ExpensesProvider, useExpenses } from "@/providers/ExpensesProvider";
import { usePlanner } from "@/providers/PlannerProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Button, Text, View, XStack, YStack } from "tamagui";

function ExpensesContent() {
  const colors = Colors.light;
  const {
    transactions,
    isLoading,
    error,
    refetch,
    handleOpenForm,
    handleTransactionPress,
    totalExpenses,
  } = useExpenses();

  const renderEmptyState = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" padding={32}>
      <View
        backgroundColor="#E74C3C20"
        padding={24}
        borderRadius={50}
        marginBottom={16}
      >
        <MaterialIcons name="trending-down" size={48} color="#E74C3C" />
      </View>
      <Text fontSize={18} fontWeight="600" color={colors.text} textAlign="center" marginBottom={8}>
        Nenhuma despesa encontrada
      </Text>
      <Text fontSize={14} color={colors.icon} textAlign="center" marginBottom={24}>
        Comece adicionando sua primeira despesa
      </Text>
      <Button
        backgroundColor="#E74C3C"
        onPress={handleOpenForm}
        paddingHorizontal={24}
        paddingVertical={12}
        borderRadius={8}
      >
        <XStack alignItems="center" space={8}>
          <MaterialIcons name="add" size={20} color="white" />
          <Text color="white" fontWeight="600">
            Adicionar Despesa
          </Text>
        </XStack>
      </Button>
    </YStack>
  );

  const renderTransactionItem = ({ item }: { item: any }) => (
    <TransactionItem transaction={item} onPress={() => handleTransactionPress(item)} />
  );

  return (
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
              Despesas
            </Text>
            <Button
              backgroundColor="#E74C3C"
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
            backgroundColor="#E74C3C10"
            padding={16}
            borderRadius={12}
            borderWidth={1}
            borderColor="#E74C3C30"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Text fontSize={14} color={colors.icon}>
                  Total de Despesas
                </Text>
                <Text fontSize={24} fontWeight="bold" color="#E74C3C">
                  {(totalExpenses / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </YStack>
              <View
                backgroundColor="#E74C3C20"
                padding={12}
                borderRadius={8}
              >
                <MaterialIcons name="trending-down" size={24} color="#E74C3C" />
              </View>
            </XStack>
          </View>
        </YStack>
      </View>

      {/* Lista de transações */}
      <View flex={1} padding={16} paddingBottom={32}>
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
              backgroundColor="#E74C3C"
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
                colors={["#E74C3C"]}
                tintColor="#E74C3C"
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

export default function ExpensesTab() {
  const { planner } = usePlanner();

  // Calcular startDate e endDate baseado no planner
  const dateRange = useMemo(() => {
    const now = new Date();
    
    // Se não há planner, usar o mês atual
    if (!planner) {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate, endDate };
    }

    // Se há planner, usar os dados do planner
    const startDate = new Date(planner.year, planner.month_number - 1, 1);
    const endDate = new Date(planner.year, planner.month_number, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  }, [planner]);

  return (
    <TabsLayout>
      <ExpensesProvider dateRange={dateRange}>
        <ExpensesContent />
      </ExpensesProvider>
    </TabsLayout>
  );
}
