import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Platform, ScrollView } from "react-native";
import { Button, ButtonText, Input, Label, Text, View, XStack, YStack } from "tamagui";
import { z } from "zod";

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => {
    const numericValue = val.replace(/[^\d]/g, "");
    const amountInCents = parseInt(numericValue);
    return !isNaN(amountInCents) && amountInCents > 0;
  }, "Valor deve ser maior que zero"),
  date: z.string().min(1, "Data é obrigatória"),
  dueDate: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]),
  expenseType: z.enum(["EXPENSE", "INSTALLMENT", "RECURRING"]).optional(),
  totalInstallments: z.string().optional().refine((val) => {
    if (!val) return true; // Campo opcional
    const num = parseInt(val);
    return !isNaN(num) && num > 0 && num <= 60; // Máximo 60 parcelas
  }, "Quantidade de parcelas deve ser entre 1 e 60"),
  recurrencePattern: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]).optional(),
}).refine((data) => {
  // Se for INSTALLMENT, totalInstallments é obrigatório
  if (data.expenseType === "INSTALLMENT") {
    return data.totalInstallments && parseInt(data.totalInstallments) >= 2;
  }
  return true;
}, {
  message: "Para compras parceladas, é necessário informar pelo menos 2 parcelas",
  path: ["totalInstallments"]
}).refine((data) => {
  // Se for RECURRING, recurrencePattern é obrigatório
  if (data.expenseType === "RECURRING") {
    return data.recurrencePattern;
  }
  return true;
}, {
  message: "Para despesas recorrentes, é necessário selecionar o padrão de recorrência",
  path: ["recurrencePattern"]
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: { 
    description: string; 
    amountInCents: number; // Valor em centavos
    date: Date; 
    dueDate?: Date;
    type: "INCOME" | "EXPENSE" | "INSTALLMENT" | "RECURRING"; // Tipo correto para a API
    totalInstallments?: number; // Quantidade total de parcelas (apenas para INSTALLMENT)
    recurrencePattern?: "MONTHLY" | "WEEKLY" | "YEARLY"; // Padrão de recorrência (apenas para RECURRING)
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: "INCOME" | "EXPENSE";
}

export default function TransactionForm({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  type = "INCOME" 
}: TransactionFormProps) {
  const [selectedType, setSelectedType] = useState<"INCOME" | "EXPENSE">(type);
  const [selectedExpenseType, setSelectedExpenseType] = useState<"EXPENSE" | "INSTALLMENT" | "RECURRING">("EXPENSE");
  const [selectedRecurrencePattern, setSelectedRecurrencePattern] = useState<"MONTHLY" | "WEEKLY" | "YEARLY">("MONTHLY");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempDueDate, setTempDueDate] = useState<Date>(new Date());
  const colors = Colors.light;
  const bottomTabHeight = useBottomTabBarHeight();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      type: type,
      expenseType: "EXPENSE",
      totalInstallments: "",
      recurrencePattern: "MONTHLY",
    },
  });

  const handleFormSubmit = (data: TransactionFormData) => {
    // Extrai apenas os números do valor formatado
    const numericValue = data.amount.replace(/[^\d]/g, "");
    // Converte para centavos
    const amountInCents = Math.round(parseInt(numericValue));
    
    // Mapeia o tipo correto para a API baseado na seleção do usuário
    let apiType: "INCOME" | "EXPENSE" | "INSTALLMENT" | "RECURRING";
    
    if (selectedType === "INCOME") {
      apiType = "INCOME";
    } else {
      // Para despesas, mapeia baseado no expenseType selecionado
      switch (selectedExpenseType) {
        case "EXPENSE":
          apiType = "EXPENSE";
          break;
        case "INSTALLMENT":
          apiType = "INSTALLMENT";
          break;
        case "RECURRING":
          apiType = "RECURRING";
          break;
        default:
          apiType = "EXPENSE";
      }
    }
    
    const formattedData = {
      description: data.description,
      date: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      type: apiType,
      amountInCents: amountInCents,
      totalInstallments: data.totalInstallments ? parseInt(data.totalInstallments) : undefined,
      recurrencePattern: selectedExpenseType === "RECURRING" ? selectedRecurrencePattern : undefined,
    };
    console.log("handleFormSubmit: formattedData", formattedData);
    onSubmit(formattedData);
  };

  const formatCurrency = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/[^\d]/g, "");
    
    if (numbers === "") return "";
    
    // Converte para número e formata
    const number = parseInt(numbers) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (date) {
        setTempDate(date);
        setValue("date", date.toISOString().split("T")[0]);
      }
    } else {
      if (date) {
        setTempDate(date);
      }
    }
  };

  const handleDueDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDueDatePicker(false);
      if (date) {
        setTempDueDate(date);
        setValue("dueDate", date.toISOString().split("T")[0]);
      }
    } else {
      if (date) {
        setTempDueDate(date);
      }
    }
  };

  const handleConfirmDate = () => {
    setValue("date", tempDate.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  const handleConfirmDueDate = () => {
    setValue("dueDate", tempDueDate.toISOString().split("T")[0]);
    setShowDueDatePicker(false);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  const handleCancelDueDate = () => {
    setShowDueDatePicker(false);
  };

  const handleDatePress = () => {
    setTempDate(new Date(watch("date") || new Date()));
    setShowDatePicker(true);
  };

  const handleDueDatePress = () => {
    setTempDueDate(new Date(watch("dueDate") || new Date()));
    setShowDueDatePicker(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Fixo */}
      <View padding={16} paddingBottom={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={20} fontWeight="bold" color={colors.text}>
            Nova Transação
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
            {/* Tipo de Transação */}
            <YStack space={6}>
              <Label fontSize={14} fontWeight="600" color={colors.text}>
                Tipo de Transação
              </Label>
              <XStack space={8}>
                <Button
                  flex={1}
                  backgroundColor={selectedType === "INCOME" ? colors.tint : "#F5F5F5"}
                  borderWidth={1}
                  borderColor={selectedType === "INCOME" ? colors.tint : "#E0E0E0"}
                  onPress={() => setSelectedType("INCOME")}
                  pressStyle={{
                    backgroundColor: selectedType === "INCOME" ? colors.tint : "#E8E8E8",
                  }}
                  paddingVertical={8}
                >
                  <XStack alignItems="center" space={6}>
                    <MaterialIcons 
                      name="trending-up" 
                      size={18} 
                      color={selectedType === "INCOME" ? "white" : colors.icon} 
                    />
                    <Text 
                      color={selectedType === "INCOME" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={14}
                    >
                      Receita
                    </Text>
                  </XStack>
                </Button>
                
                <Button
                  flex={1}
                  backgroundColor={selectedType === "EXPENSE" ? "#E74C3C" : "#F5F5F5"}
                  borderWidth={1}
                  borderColor={selectedType === "EXPENSE" ? "#E74C3C" : "#E0E0E0"}
                  onPress={() => setSelectedType("EXPENSE")}
                  pressStyle={{
                    backgroundColor: selectedType === "EXPENSE" ? "#E74C3C" : "#E8E8E8",
                  }}
                  paddingVertical={8}
                >
                  <XStack alignItems="center" space={6}>
                    <MaterialIcons 
                      name="trending-down" 
                      size={18} 
                      color={selectedType === "EXPENSE" ? "white" : colors.icon} 
                    />
                    <Text 
                      color={selectedType === "EXPENSE" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={14}
                    >
                      Despesa
                    </Text>
                  </XStack>
                </Button>
              </XStack>
            </YStack>

            {/* Tipo de Despesa (apenas para despesas) */}
            {selectedType === "EXPENSE" && (
              <YStack space={6}>
                <Label fontSize={14} fontWeight="600" color={colors.text}>
                  Tipo de Despesa
                </Label>
                <XStack space={6}>
                  <Button
                    flex={1}
                    backgroundColor={selectedExpenseType === "EXPENSE" ? "#E74C3C" : "#F5F5F5"}
                    borderWidth={1}
                    borderColor={selectedExpenseType === "EXPENSE" ? "#E74C3C" : "#E0E0E0"}
                    onPress={() => setSelectedExpenseType("EXPENSE")}
                    pressStyle={{
                      backgroundColor: selectedExpenseType === "EXPENSE" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                  >
                    <Text 
                      color={selectedExpenseType === "EXPENSE" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={12}
                    >
                      Única
                    </Text>
                  </Button>
                  
                  <Button
                    flex={1}
                    backgroundColor={selectedExpenseType === "INSTALLMENT" ? "#E74C3C" : "#F5F5F5"}
                    borderWidth={1}
                    borderColor={selectedExpenseType === "INSTALLMENT" ? "#E74C3C" : "#E0E0E0"}
                    onPress={() => setSelectedExpenseType("INSTALLMENT")}
                    pressStyle={{
                      backgroundColor: selectedExpenseType === "INSTALLMENT" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                  >
                    <Text 
                      color={selectedExpenseType === "INSTALLMENT" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={12}
                    >
                      Parcelada
                    </Text>
                  </Button>
                  
                  <Button
                    flex={1}
                    backgroundColor={selectedExpenseType === "RECURRING" ? "#E74C3C" : "#F5F5F5"}
                    borderWidth={1}
                    borderColor={selectedExpenseType === "RECURRING" ? "#E74C3C" : "#E0E0E0"}
                    onPress={() => setSelectedExpenseType("RECURRING")}
                    pressStyle={{
                      backgroundColor: selectedExpenseType === "RECURRING" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                  >
                    <Text 
                      color={selectedExpenseType === "RECURRING" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={12}
                    >
                      Recorrente
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            )}

            {/* Descrição */}
            <YStack space={6}>
              <Label fontSize={14} fontWeight="600" color={colors.text}>
                Descrição
              </Label>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Ex: Salário, Aluguel, Compras..."
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    borderWidth={1}
                    borderColor={errors.description ? "#E74C3C" : "#E0E0E0"}
                    backgroundColor="white"
                    paddingHorizontal={12}
                    paddingVertical={8}
                    borderRadius={6}
                    fontSize={14}
                  />
                )}
              />
              {errors.description && (
                <Text color="#E74C3C" fontSize={12}>
                  {errors.description.message}
                </Text>
              )}
            </YStack>

            {/* Valor */}
            <YStack space={6}>
              <Label fontSize={14} fontWeight="600" color={colors.text}>
                Valor { selectedExpenseType === "INSTALLMENT" && "da parcela" }
              </Label>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="R$ 0,00"
                    value={value}
                    onChangeText={(text) => {
                      const formatted = formatCurrency(text);
                      onChange(formatted);
                    }}
                    onBlur={onBlur}
                    borderWidth={1}
                    borderColor={errors.amount ? "#E74C3C" : "#E0E0E0"}
                    backgroundColor="white"
                    paddingHorizontal={12}
                    paddingVertical={8}
                    borderRadius={6}
                    fontSize={14}
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.amount && (
                <Text color="#E74C3C" fontSize={12}>
                  {errors.amount.message}
                </Text>
              )}
            </YStack>

            {/* Quantidade de Parcelas (apenas para despesas parceladas) */}
            {selectedType === "EXPENSE" && selectedExpenseType === "INSTALLMENT" && (
              <YStack space={6}>
                <Label fontSize={14} fontWeight="600" color={colors.text}>
                  Quantidade de Parcelas
                </Label>
                <Controller
                  control={control}
                  name="totalInstallments"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Ex: 12"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      borderWidth={1}
                      borderColor={errors.totalInstallments ? "#E74C3C" : "#E0E0E0"}
                      backgroundColor="white"
                      paddingHorizontal={12}
                      paddingVertical={8}
                      borderRadius={6}
                      fontSize={14}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errors.totalInstallments && (
                  <Text color="#E74C3C" fontSize={12}>
                    {errors.totalInstallments.message}
                  </Text>
                )}
              </YStack>
            )}

            {/* Padrão de Recorrência (apenas para despesas recorrentes) */}
            {selectedType === "EXPENSE" && selectedExpenseType === "RECURRING" && (
              <YStack space={6}>
                <Label fontSize={14} fontWeight="600" color={colors.text}>
                  Padrão de Recorrência
                </Label>
                <XStack space={6}>
                  <Button
                    flex={1}
                    backgroundColor={selectedRecurrencePattern === "WEEKLY" ? "#E74C3C" : "#F5F5F5"}
                    borderWidth={1}
                    borderColor={selectedRecurrencePattern === "WEEKLY" ? "#E74C3C" : "#E0E0E0"}
                    onPress={() => {
                      setSelectedRecurrencePattern("WEEKLY");
                      setValue("recurrencePattern", "WEEKLY");
                    }}
                    pressStyle={{
                      backgroundColor: selectedRecurrencePattern === "WEEKLY" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                  >
                    <Text 
                      color={selectedRecurrencePattern === "WEEKLY" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={12}
                    >
                      Semanal
                    </Text>
                  </Button>
                  
                  <Button
                    flex={1}
                    backgroundColor={selectedRecurrencePattern === "MONTHLY" ? "#E74C3C" : "#F5F5F5"}
                    borderWidth={1}
                    borderColor={selectedRecurrencePattern === "MONTHLY" ? "#E74C3C" : "#E0E0E0"}
                    onPress={() => {
                      setSelectedRecurrencePattern("MONTHLY");
                      setValue("recurrencePattern", "MONTHLY");
                    }}
                    pressStyle={{
                      backgroundColor: selectedRecurrencePattern === "MONTHLY" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                  >
                    <Text 
                      color={selectedRecurrencePattern === "MONTHLY" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={12}
                    >
                      Mensal
                    </Text>
                  </Button>
                  
                  <Button
                    flex={1}
                    backgroundColor={selectedRecurrencePattern === "YEARLY" ? "#E74C3C" : "#F5F5F5"}
                    borderWidth={1}
                    borderColor={selectedRecurrencePattern === "YEARLY" ? "#E74C3C" : "#E0E0E0"}
                    onPress={() => {
                      setSelectedRecurrencePattern("YEARLY");
                      setValue("recurrencePattern", "YEARLY");
                    }}
                    pressStyle={{
                      backgroundColor: selectedRecurrencePattern === "YEARLY" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                  >
                    <Text 
                      color={selectedRecurrencePattern === "YEARLY" ? "white" : colors.text}
                      fontWeight="600"
                      fontSize={12}
                    >
                      Anual
                    </Text>
                  </Button>
                </XStack>
                {errors.recurrencePattern && (
                  <Text color="#E74C3C" fontSize={12}>
                    {errors.recurrencePattern.message}
                  </Text>
                )}
              </YStack>
            )}

            {/* Data */}
            <YStack space={6}>
              <Label fontSize={14} fontWeight="600" color={colors.text}>
                Data
              </Label>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Button
                    backgroundColor="white"
                    borderWidth={1}
                    borderColor={errors.date ? "#E74C3C" : "#E0E0E0"}
                    borderRadius={6}
                    paddingHorizontal={12}
                    paddingVertical={8}
                    onPress={handleDatePress}
                    justifyContent="flex-start"
                  >
                    <XStack alignItems="center" space={6}>
                      <MaterialIcons name="calendar-today" size={18} color={colors.icon} />
                      <Text fontSize={14} color={value ? colors.text : "#999"}>
                        {value ? formatDate(new Date(value)) : "Selecione uma data"}
                      </Text>
                    </XStack>
                  </Button>
                )}
              />
              {errors.date && (
                <Text color="#E74C3C" fontSize={12}>
                  {errors.date.message}
                </Text>
              )}
            </YStack>

            {/* Data de Vencimento (apenas para despesas) */}
            {selectedType === "EXPENSE" && (
              <YStack space={6}>
                <Label fontSize={14} fontWeight="600" color={colors.text}>
                  Data de Vencimento (Opcional)
                </Label>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Button
                      backgroundColor="white"
                      borderWidth={1}
                      borderColor={errors.dueDate ? "#E74C3C" : "#E0E0E0"}
                      borderRadius={6}
                      paddingHorizontal={12}
                      paddingVertical={8}
                      onPress={handleDueDatePress}
                      justifyContent="flex-start"
                    >
                      <XStack alignItems="center" space={6}>
                        <MaterialIcons name="event" size={18} color={colors.icon} />
                        <Text fontSize={14} color={value ? colors.text : "#999"}>
                          {value ? formatDate(new Date(value)) : "Selecione uma data de vencimento"}
                        </Text>
                      </XStack>
                    </Button>
                  )}
                />
                {errors.dueDate && (
                  <Text color="#E74C3C" fontSize={12}>
                    {errors.dueDate.message}
                  </Text>
                )}
              </YStack>
            )}

            {/* Botões */}
            <YStack space={10} marginTop={16} marginBottom={20}>
              <Button
                backgroundColor={selectedType === "INCOME" ? colors.tint : "#E74C3C"}
                onPress={handleSubmit(handleFormSubmit)}
                disabled={isLoading}
                borderRadius={6}
                justifyContent="center"
                alignItems="center"
                paddingVertical={12}
              >
                {isLoading ? (
                  <Text color="white" fontSize={14} fontWeight="600">
                    Salvando...
                  </Text>
                ) : (
                  <>
                    <MaterialIcons name="save" size={18} color="white" style={{ marginRight: 6 }} />
                    <Text color="white" fontSize={14} fontWeight="600">
                      Salvar Transação
                    </Text>
                  </>
                )}
              </Button>
              
              <Button
                backgroundColor="transparent"
                borderWidth={1}
                borderColor="#E0E0E0"
                onPress={onCancel}
                disabled={isLoading}
                borderRadius={6}
                justifyContent="center"
                alignItems="center"
                paddingVertical={12}
              >
                <ButtonText color={colors.text} fontSize={14} fontWeight="600">
                  Cancelar
                </ButtonText>
              </Button>
            </YStack>
          </YStack>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent
          visible={showDatePicker}
          animationType="slide"
          onRequestClose={handleCancelDate}
        >
          <View
            flex={1}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            justifyContent="center"
            alignItems="center"
            paddingBottom={100}
          >
            <View
              backgroundColor={colors.background}
              borderRadius={16}
              padding={20}
              marginHorizontal={20}
              minWidth={300}
              maxHeight="80%"
            >
              <Text
                fontSize={18}
                fontWeight="bold"
                color={colors.text}
                textAlign="center"
                marginBottom={20}
              >
                Selecionar Data
              </Text>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                locale="pt-BR"
                onChange={handleDateChange}
                maximumDate={new Date(2030, 11, 31)}
                minimumDate={new Date(2020, 0, 1)}
                style={{ marginBottom: 20 }}
              />
              
              <XStack space={12}>
                <Button
                  flex={1}
                  backgroundColor="#E0E0E0"
                  onPress={handleCancelDate}
                >
                  <ButtonText color={colors.text}>Cancelar</ButtonText>
                </Button>
                <Button
                  flex={1}
                  backgroundColor={colors.tint}
                  onPress={handleConfirmDate}
                >
                  <ButtonText color="white">Confirmar</ButtonText>
                </Button>
              </XStack>
            </View>
          </View>
        </Modal>
      )}

      {/* Due Date Picker Modal */}
      {showDueDatePicker && (
        <Modal
          transparent
          visible={showDueDatePicker}
          animationType="slide"
          onRequestClose={handleCancelDueDate}
        >
          <View
            flex={1}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            justifyContent="center"
            alignItems="center"
            paddingBottom={100}
          >
            <View
              backgroundColor={colors.background}
              borderRadius={16}
              padding={20}
              marginHorizontal={20}
              minWidth={300}
              maxHeight="80%"
            >
              <Text
                fontSize={18}
                fontWeight="bold"
                color={colors.text}
                textAlign="center"
                marginBottom={20}
              >
                Selecionar Data de Vencimento
              </Text>
              
              <DateTimePicker
                value={tempDueDate}
                mode="date"
                display="spinner"
                locale="pt-BR"
                onChange={handleDueDateChange}
                maximumDate={new Date(2030, 11, 31)}
                minimumDate={new Date(2020, 0, 1)}
                style={{ marginBottom: 20 }}
              />
              
              <XStack space={12}>
                <Button
                  flex={1}
                  backgroundColor="#E0E0E0"
                  onPress={handleCancelDueDate}
                >
                  <ButtonText color={colors.text}>Cancelar</ButtonText>
                </Button>
                <Button
                  flex={1}
                  backgroundColor={colors.tint}
                  onPress={handleConfirmDueDate}
                >
                  <ButtonText color="white">Confirmar</ButtonText>
                </Button>
              </XStack>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}