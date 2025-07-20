import { InstallmentTransactionHeader } from "@/components/layouts/InstallmentTransactionHeader";
import { Colors } from "@/constants/Colors";
import { TransactionService } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Alert, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { Button, ButtonText, Text, View, XStack, YStack } from "tamagui";

export default function InstallmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  // Query para buscar a transação específica
  const transactionQuery = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => TransactionService.getTransactionById(id!),
    enabled: !!id,
  });

  console.log('query data na pagina de detalhes da parcela', transactionQuery.data);
  console.log('query error na pagina de detalhes da parcela', transactionQuery.error);

  // Estados de loading e erro
  const isLoading = transactionQuery.isLoading;
  const error = transactionQuery.error;
  const refetch = () => {
    transactionQuery.refetch();
  };

  // Dados da query
  const transaction = transactionQuery.data;

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
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

  const calculateTotalAmount = (transaction: Transaction) => {
    if (transaction.totalInstallments && transaction.amountInCents) {
      return transaction.totalInstallments * transaction.amountInCents;
    }
    return transaction.amountInCents;
  };

  const calculateProgress = (transaction: Transaction) => {
    if (transaction.installmentNumber && transaction.totalInstallments) {
      return (transaction.installmentNumber / transaction.totalInstallments) * 100;
    }
    return 0;
  };

  const getRemainingInstallments = (transaction: Transaction) => {
    if (transaction.installmentNumber && transaction.totalInstallments) {
      return transaction.totalInstallments - transaction.installmentNumber;
    }
    return 0;
  };

  const handleStatusChange = useCallback((newStatus: string) => {
    if (!transaction) return;

    const updateData = {
      ...transaction,
      status: newStatus,
    };

    // Se está marcando como pago/recebido, adiciona a data real
    if (newStatus === "PAID" || newStatus === "RECEIVED") {
      updateData.dateOccurred = new Date();
    }

    // Aqui você chamaria a função de atualização
    console.log("Atualizando transação:", updateData);
  }, [transaction]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta parcela? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => {
          console.log("Excluindo transação:", transaction?.id);
        }},
      ]
    );
  }, [transaction]);

  if (isLoading) {
    return (
      <View flex={1} backgroundColor="#F8F9FA">
        <InstallmentTransactionHeader title="Detalhes da Parcela" showBackButton />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize={16} color={colors.icon}>
            Carregando...
          </Text>
        </YStack>
      </View>
    );
  }

  if (error || !transaction) {
    return (
      <View flex={1} backgroundColor="#F8F9FA">
        <InstallmentTransactionHeader title="Detalhes da Parcela" showBackButton />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize={16} color="#E74C3C">
            Parcela não encontrada
          </Text>
        </YStack>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor="#F8F9FA">
      <InstallmentTransactionHeader title="Detalhes da Parcela" showBackButton />
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View padding={16}>
          <YStack space={20}>
            {/* Informações Básicas */}
            <View
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <YStack space={12}>
                <Text fontSize={20} fontWeight="600" color={colors.text}>
                  {transaction.description}
                </Text>
                
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={24} fontWeight="700" color={colors.text}>
                    {formatCurrencyFromCents(transaction.amountInCents)}
                  </Text>
                  <View
                    backgroundColor={getStatusColor(transaction.status) + "20"}
                    paddingHorizontal={12}
                    paddingVertical={6}
                    borderRadius={8}
                  >
                    <Text
                      fontSize={14}
                      fontWeight="600"
                      color={getStatusColor(transaction.status)}
                    >
                      {getStatusText(transaction.status)}
                    </Text>
                  </View>
                </XStack>

                <YStack space={8}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={14} color={colors.icon}>
                      Data da Transação
                    </Text>
                    <Text fontSize={14} fontWeight="500" color={colors.text}>
                      {formatDate(transaction.date)}
                    </Text>
                  </XStack>

                  {transaction.dueDate && (
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={14} color={colors.icon}>
                        Data de Vencimento
                      </Text>
                      <Text fontSize={14} fontWeight="500" color={colors.text}>
                        {formatDate(transaction.dueDate)}
                      </Text>
                    </XStack>
                  )}

                  {transaction.dateOccurred && (
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={14} color={colors.icon}>
                        Data Real
                      </Text>
                      <Text fontSize={14} fontWeight="500" color={colors.text}>
                        {formatDate(transaction.dateOccurred)}
                      </Text>
                    </XStack>
                  )}
                </YStack>
              </YStack>
            </View>

            {/* Informações de Parcelas */}
            <View
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <Text fontSize={16} fontWeight="600" color={colors.text} marginBottom={12}>
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
                    {formatCurrencyFromCents(calculateTotalAmount(transaction))}
                  </Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={14} color={colors.icon}>
                    Parcelas Restantes
                  </Text>
                  <Text fontSize={14} fontWeight="600" color="#F39C12">
                    {getRemainingInstallments(transaction)}
                  </Text>
                </XStack>
              </YStack>

              {/* Barra de Progresso */}
              <YStack space={4} marginTop={12}>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} color={colors.icon}>
                    Progresso
                  </Text>
                  <Text fontSize={12} fontWeight="600" color={colors.text}>
                    {Math.round(calculateProgress(transaction))}%
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
                    width={`${calculateProgress(transaction)}%`}
                  />
                </View>
              </YStack>
            </View>

            {/* Próximas Parcelas */}
            <View
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <Text fontSize={16} fontWeight="600" color={colors.text} marginBottom={12}>
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

                {getRemainingInstallments(transaction) > 1 && (
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
                          {getRemainingInstallments(transaction) - 1} parcelas restantes
                        </Text>
                      </YStack>
                      <Text fontSize={14} fontWeight="600" color={colors.text}>
                        {formatCurrencyFromCents(transaction.amountInCents * (getRemainingInstallments(transaction) - 1))}
                      </Text>
                    </XStack>
                  </View>
                )}
              </YStack>
            </View>

            {/* Alterar Status */}
            <View
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <Text fontSize={16} fontWeight="600" color={colors.text} marginBottom={12}>
                Alterar Status
              </Text>
              
              <YStack space={8}>
                <XStack space={8} flexWrap="wrap">
                  {["PENDING", "PAID", "RECEIVED", "CANCELLED"].map((status) => (
                    <Button
                      key={status}
                      size="$3"
                      backgroundColor={transaction.status === status ? getStatusColor(status) : "transparent"}
                      borderWidth={1}
                      borderColor={getStatusColor(status)}
                      onPress={() => handleStatusChange(status)}
                    >
                      <ButtonText
                        color={transaction.status === status ? "white" : getStatusColor(status)}
                        fontSize={12}
                      >
                        {getStatusText(status)}
                      </ButtonText>
                    </Button>
                  ))}
                </XStack>
              </YStack>
            </View>

            {/* Ações Rápidas */}
            <View
              backgroundColor="white"
              padding={16}
              borderRadius={12}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <Text fontSize={16} fontWeight="600" color={colors.text} marginBottom={12}>
                Ações Rápidas
              </Text>
              
              <YStack space={8}>
                <XStack space={8}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.tint + "20",
                      padding: 12,
                      borderRadius: 8,
                      flex: 1,
                    }}
                    onPress={() => handleStatusChange("PAID")}
                  >
                    <XStack alignItems="center" space={8}>
                      <MaterialIcons name="payment" size={20} color={colors.tint} />
                      <Text fontSize={14} fontWeight="600" color={colors.tint}>
                        Pagar Parcela
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#9B59B620",
                      padding: 12,
                      borderRadius: 8,
                      flex: 1,
                    }}
                    onPress={() => {
                      const newDate = new Date(transaction.date);
                      newDate.setDate(newDate.getDate() + 7);
                      console.log("Adiando parcela para:", newDate);
                    }}
                  >
                    <XStack alignItems="center" space={8}>
                      <MaterialIcons name="schedule" size={20} color="#9B59B6" />
                      <Text fontSize={14} fontWeight="600" color="#9B59B6">
                        Adiar Parcela
                      </Text>
                    </XStack>
                  </TouchableOpacity>
                </XStack>
              </YStack>
            </View>

            {/* Botões de Ação */}
            <YStack space={12}>
              <Button
                backgroundColor={colors.tint}
                onPress={() => console.log("Editando transação")}
              >
                <ButtonText color="white" fontWeight="600">
                  Editar
                </ButtonText>
              </Button>
              
              <Button
                backgroundColor="#E74C3C"
                onPress={handleDelete}
              >
                <ButtonText color="white" fontWeight="600">
                  Excluir
                </ButtonText>
              </Button>
            </YStack>
          </YStack>
        </View>
      </ScrollView>
    </View>
  );
} 