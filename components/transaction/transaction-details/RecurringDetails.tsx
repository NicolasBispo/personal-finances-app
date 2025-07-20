import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Text, View, XStack, YStack } from "tamagui";
import { BaseTransactionDetails } from "./BaseTransactionDetails";
import { useTransactionDetails } from "./TransactionDetailsProvider";

export const RecurringDetails = () => {
  const { transaction, onUpdate } = useTransactionDetails();
  const colors = Colors.light;

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getRecurrenceText = (pattern?: string) => {
    switch (pattern) {
      case "monthly":
        return "Mensal";
      case "weekly":
        return "Semanal";
      case "yearly":
        return "Anual";
      default:
        return "Personalizada";
    }
  };

  const getRecurrenceIcon = (pattern?: string) => {
    switch (pattern) {
      case "monthly":
        return "calendar-month";
      case "weekly":
        return "calendar-week";
      case "yearly":
        return "calendar-today";
      default:
        return "repeat";
    }
  };

  return (
    <BaseTransactionDetails>
      {/* Informações de Recorrência */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Informações de Recorrência
        </Text>
        
        <YStack space={8}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Tipo
            </Text>
            <View
              backgroundColor="#9B59B620"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#9B59B6">
                Recorrente
              </Text>
            </View>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Frequência
            </Text>
            <XStack alignItems="center" space={6}>
              <MaterialIcons 
                name={getRecurrenceIcon(transaction.recurrencePattern) as any} 
                size={16} 
                color="#9B59B6" 
              />
              <Text fontSize={14} fontWeight="500" color={colors.text}>
                {getRecurrenceText(transaction.recurrencePattern)}
              </Text>
            </XStack>
          </XStack>

          {transaction.nextOccurrence && (
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={14} color={colors.icon}>
                Próxima Ocorrência
              </Text>
              <Text fontSize={14} fontWeight="500" color={colors.text}>
                {formatDate(transaction.nextOccurrence)}
              </Text>
            </XStack>
          )}

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Status da Recorrência
            </Text>
            <View
              backgroundColor="#27AE6020"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#27AE60">
                Ativa
              </Text>
            </View>
          </XStack>
        </YStack>
      </YStack>

      {/* Histórico de Ocorrências */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Histórico de Ocorrências
        </Text>
        
        <YStack space={8}>
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
                  Última Ocorrência
                </Text>
                <Text fontSize={12} color={colors.icon}>
                  {formatDate(transaction.date)}
                </Text>
              </YStack>
              <View
                backgroundColor="#27AE6020"
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={4}
              >
                <Text fontSize={10} fontWeight="600" color="#27AE60">
                  Concluída
                </Text>
              </View>
            </XStack>
          </View>

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
                  Próxima Ocorrência
                </Text>
                <Text fontSize={12} color={colors.icon}>
                  {transaction.nextOccurrence ? formatDate(transaction.nextOccurrence) : "Não agendada"}
                </Text>
              </YStack>
              <View
                backgroundColor="#F39C1220"
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={4}
              >
                <Text fontSize={10} fontWeight="600" color="#F39C12">
                  Pendente
                </Text>
              </View>
            </XStack>
          </View>
        </YStack>
      </YStack>

      {/* Configurações de Recorrência */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Configurações
        </Text>
        
        <YStack space={8}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Auto-renovação
            </Text>
            <View
              backgroundColor="#27AE6020"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#27AE60">
                Ativada
              </Text>
            </View>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Notificações
            </Text>
            <View
              backgroundColor="#27AE6020"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="600" color="#27AE60">
                Ativadas
              </Text>
            </View>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={14} color={colors.icon}>
              Data de Término
            </Text>
            <Text fontSize={14} fontWeight="500" color={colors.text}>
              Indefinida
            </Text>
          </XStack>
        </YStack>
      </YStack>

      {/* Ações Específicas de Recorrência */}
      <YStack space={12} marginTop={16}>
        <Text fontSize={16} fontWeight="600" color={colors.text}>
          Ações Rápidas
        </Text>
        
        <YStack space={8}>
          <XStack space={8}>
            <View
              backgroundColor="#9B59B620"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Pausa a recorrência
                onUpdate({
                  ...transaction,
                  status: "PAUSED",
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="pause" size={20} color="#9B59B6" />
                <Text fontSize={14} fontWeight="600" color="#9B59B6">
                  Pausar
                </Text>
              </XStack>
            </View>
            
            <View
              backgroundColor="#E74C3C20"
              padding={12}
              borderRadius={8}
              flex={1}
              onTouchEnd={() => {
                // Cancela a recorrência
                onUpdate({
                  ...transaction,
                  status: "CANCELLED",
                });
              }}
            >
              <XStack alignItems="center" space={8}>
                <MaterialIcons name="stop" size={20} color="#E74C3C" />
                <Text fontSize={14} fontWeight="600" color="#E74C3C">
                  Cancelar
                </Text>
              </XStack>
            </View>
          </XStack>
        </YStack>
      </YStack>
    </BaseTransactionDetails>
  );
}; 