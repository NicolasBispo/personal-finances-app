import { Colors } from "@/constants/Colors";
import { Transaction } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Button, ButtonText, Text, View, XStack, YStack } from "tamagui";

interface BaseTransactionDetailsProps {
  transaction: Transaction;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  children?: React.ReactNode;
}

export const BaseTransactionDetails = ({
  transaction,
  onUpdate,
  onDelete,
  onCancel,
  isLoading = false,
  isUpdating = false,
  isDeleting = false,
  children,
}: BaseTransactionDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const colors = Colors.light;
  const bottomTabHeight = useBottomTabBarHeight();

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

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: onDelete },
      ]
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    const updateData = {
      ...transaction,
      status: newStatus,
    };

    // Se está marcando como pago/recebido, adiciona a data real
    if (newStatus === "PAID" || newStatus === "RECEIVED") {
      updateData.dateOccurred = new Date();
    }

    onUpdate(updateData);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Fixo */}
      <View padding={16} paddingBottom={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="bold" color={colors.text}>
            {isEditing ? "Editar Transação" : "Detalhes da Transação"}
          </Text>
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            onPress={onCancel}
          >
            <MaterialIcons name="close" size={24} color={colors.icon} />
          </Button>
        </XStack>
      </View>

      {/* Conteúdo Scrollável */}
      <ScrollView 
        style={{ flex: 1, minHeight: 0 }} 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ 
          paddingBottom: bottomTabHeight + 20,
          flexGrow: 1
        }}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        alwaysBounceVertical={false}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      >
        <View padding={16} paddingTop={8}>
          <YStack space={16}>
            {/* Informações Básicas */}
            <YStack space={12}>
              <Text fontSize={18} fontWeight="600" color={colors.text}>
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

            {/* Conteúdo Específico */}
            {children}

            {/* Ações */}
            <YStack space={12} marginTop={16}>
              {/* Alterar Status */}
              <YStack space={8}>
                <Text fontSize={16} fontWeight="600" color={colors.text}>
                  Alterar Status
                </Text>
                <XStack space={8} flexWrap="wrap">
                  {["PENDING", "PAID", "RECEIVED", "CANCELLED"].map((status) => (
                    <Button
                      key={status}
                      size="$3"
                      backgroundColor={transaction.status === status ? getStatusColor(status) : "transparent"}
                      borderWidth={1}
                      borderColor={getStatusColor(status)}
                      onPress={() => handleStatusChange(status)}
                      disabled={isLoading}
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

              {/* Botões de Ação */}
              <XStack space={12}>
                <Button
                  flex={1}
                  backgroundColor={colors.tint}
                  onPress={handleEdit}
                  disabled={isLoading}
                >
                  <ButtonText color="white" fontWeight="600">
                    Editar
                  </ButtonText>
                </Button>
                
                <Button
                  flex={1}
                  backgroundColor="#E74C3C"
                  onPress={handleDelete}
                  disabled={isLoading || isDeleting}
                >
                  <ButtonText color="white" fontWeight="600">
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </ButtonText>
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </View>
      </ScrollView>
    </View>
  );
}; 