import { Colors } from "@/constants/Colors";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, ScrollView } from "react-native";
import { Button, ButtonText, Text, View, XStack, YStack } from "tamagui";
import { useTransactionDetails } from "./TransactionDetailsProvider";
import { useTransactionBottomSheet } from "@/providers/TransactionBottomSheetProvider";
import { useExpenses } from "@/providers/ExpensesProvider";

interface BaseTransactionDetailsProps {
  children?: React.ReactNode;
}

export const BaseTransactionDetails = ({
  children,
}: BaseTransactionDetailsProps) => {
  const { transaction, deleteTransactionMutation, bottomSheetControls, deleteInstallmentMutation } = useTransactionDetails();
  const { closeTransactionSheet } = useTransactionBottomSheet();
  const { removeTransactionById } = useExpenses();
  const colors = Colors.light;
  const bottomTabHeight = useBottomTabBarHeight();

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const mainInstallmentId = transaction.parentTransactionId || transaction.id;

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

  const handleDeletePress = () => {2 
    deleteInstallmentMutation.mutate(mainInstallmentId);
    removeTransactionById(transaction.id);
    removeTransactionById(mainInstallmentId);
    closeTransactionSheet();
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este parcelamento? Ao deletar um parcelamento voce apaga todas parcelas associadas a ele. Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: handleDeletePress },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Fixo */}
      <View padding={16} paddingBottom={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="bold" color={colors.text}>
            Detalhes da Transação
          </Text>
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            onPress={bottomSheetControls.close}
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
            <YStack gap={12} marginTop={16}>

              {/* Botões de Ação */}
              <XStack gap={12}>
                
                <Button
                  flex={1}
                  backgroundColor="#E74C3C"
                  onPress={handleDelete}
                  disabled={deleteTransactionMutation.isPending}
                >
                  <ButtonText color="white" fontWeight="600">
                    {deleteTransactionMutation.isPending ? "Excluindo..." : "Excluir"}
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