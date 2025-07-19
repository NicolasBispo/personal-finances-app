import { Colors } from "@/constants/Colors";
import { Transaction } from "@/types/transaction";
import { formatCurrencyFromCents } from "@/utils/finances";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Modal, Platform, ScrollView } from "react-native";
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
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionDetailsFormProps {
  transaction: Transaction;
  onUpdate: (data: { 
    description: string; 
    amountInCents: number;
    date: Date; 
    dueDate?: Date;
    type: "INCOME" | "EXPENSE";
    expenseType?: "EXPENSE" | "INSTALLMENT" | "RECURRING";
    totalInstallments?: number; // Quantidade total de parcelas (apenas para INSTALLMENT)
  }) => void;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function TransactionDetailsForm({ 
  transaction,
  onUpdate, 
  onDelete,
  onCancel, 
  isLoading = false,
  isUpdating = false,
  isDeleting = false,
}: TransactionDetailsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState<"INCOME" | "EXPENSE">(transaction.type as "INCOME" | "EXPENSE");
  const [selectedExpenseType, setSelectedExpenseType] = useState<"EXPENSE" | "INSTALLMENT" | "RECURRING">(
    transaction.type === "EXPENSE" ? "EXPENSE" : "EXPENSE"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date(transaction.date));
  const [tempDueDate, setTempDueDate] = useState<Date>(transaction.dueDate ? new Date(transaction.dueDate) : new Date());
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
      description: transaction.description,
      amount: formatCurrencyFromCents(transaction.amountInCents),
      date: new Date(transaction.date).toISOString().split("T")[0],
      dueDate: transaction.dueDate ? new Date(transaction.dueDate).toISOString().split("T")[0] : "",
      type: transaction.type as "INCOME" | "EXPENSE",
      expenseType: transaction.type === "EXPENSE" ? "EXPENSE" : "EXPENSE",
      totalInstallments: transaction.totalInstallments ? transaction.totalInstallments.toString() : "",
    },
  });

  const handleFormSubmit = (data: TransactionFormData) => {
    const numericValue = data.amount.replace(/[^\d]/g, "");
    const amountInCents = Math.round(parseInt(numericValue));
    
    const formattedData = {
      description: data.description,
      date: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      type: selectedType,
      expenseType: selectedType === "EXPENSE" ? selectedExpenseType : undefined,
      amountInCents: amountInCents,
      totalInstallments: data.totalInstallments ? parseInt(data.totalInstallments) : undefined,
    };
    
    onUpdate(formattedData);
    setIsEditing(false);
  };

  

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    
    if (numbers === "") return "";
    
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
    // Reset form to original values
    setValue("description", transaction.description);
    setValue("amount", formatCurrencyFromCents(transaction.amountInCents));
    setValue("date", new Date(transaction.date).toISOString().split("T")[0]);
    setValue("dueDate", transaction.dueDate ? new Date(transaction.dueDate).toISOString().split("T")[0] : "");
    setValue("totalInstallments", transaction.totalInstallments ? transaction.totalInstallments.toString() : "");
    setSelectedType(transaction.type as "INCOME" | "EXPENSE");
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
                  onPress={() => isEditing && setSelectedType("INCOME")}
                  pressStyle={{
                    backgroundColor: selectedType === "INCOME" ? colors.tint : "#E8E8E8",
                  }}
                  paddingVertical={8}
                  disabled={!isEditing}
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
                  onPress={() => isEditing && setSelectedType("EXPENSE")}
                  pressStyle={{
                    backgroundColor: selectedType === "EXPENSE" ? "#E74C3C" : "#E8E8E8",
                  }}
                  paddingVertical={8}
                  disabled={!isEditing}
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
                    onPress={() => isEditing && setSelectedExpenseType("EXPENSE")}
                    pressStyle={{
                      backgroundColor: selectedExpenseType === "EXPENSE" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                    disabled={!isEditing}
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
                    onPress={() => isEditing && setSelectedExpenseType("INSTALLMENT")}
                    pressStyle={{
                      backgroundColor: selectedExpenseType === "INSTALLMENT" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                    disabled={!isEditing}
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
                    onPress={() => isEditing && setSelectedExpenseType("RECURRING")}
                    pressStyle={{
                      backgroundColor: selectedExpenseType === "RECURRING" ? "#E74C3C" : "#E8E8E8",
                    }}
                    paddingVertical={6}
                    disabled={!isEditing}
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
                    editable={isEditing}
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
                Valor
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
                    editable={isEditing}
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
                      editable={isEditing}
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
                    onPress={isEditing ? handleDatePress : undefined}
                    justifyContent="flex-start"
                    disabled={!isEditing}
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
                      onPress={isEditing ? handleDueDatePress : undefined}
                      justifyContent="flex-start"
                      disabled={!isEditing}
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

            {/* Botões de Ação */}
            <YStack space={12} paddingTop={16}>
              {!isEditing ? (
                <XStack space={12}>
                  <Button
                    flex={1}
                    backgroundColor={colors.tint}
                    onPress={handleEdit}
                    disabled={isLoading}
                  >
                    <XStack alignItems="center" space={6}>
                      <MaterialIcons name="edit" size={18} color="white" />
                      <ButtonText color="white" fontWeight="600">
                        Editar
                      </ButtonText>
                    </XStack>
                  </Button>
                  
                  <Button
                    flex={1}
                    backgroundColor="#E74C3C"
                    onPress={handleDelete}
                    
                    disabled={isLoading || isDeleting}
                  >
                    <XStack alignItems="center" space={6}>
                      <MaterialIcons name="delete" size={18} color="white" />
                      <ButtonText color="white" fontWeight="600">
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </ButtonText>
                    </XStack>
                  </Button>
                </XStack>
              ) : (
                <XStack space={12}>
                  <Button
                    flex={1}
                    backgroundColor={colors.tint}
                    onPress={handleSubmit(handleFormSubmit)}
                    paddingVertical={12}
                    disabled={isLoading || isUpdating}
                  >
                    <XStack alignItems="center" space={6}>
                      <MaterialIcons name="save" size={18} color="white" />
                      <ButtonText color="white" fontWeight="600">
                        {isUpdating ? "Salvando..." : "Salvar"}
                      </ButtonText>
                    </XStack>
                  </Button>
                  
                  <Button
                    flex={1}
                    backgroundColor="#6C757D"
                    onPress={handleCancelEdit}
                    paddingVertical={12}
                    disabled={isLoading || isUpdating}
                  >
                    <XStack alignItems="center" space={6}>
                      <MaterialIcons name="cancel" size={18} color="white" />
                      <ButtonText color="white" fontWeight="600">
                        Cancelar
                      </ButtonText>
                    </XStack>
                  </Button>
                </XStack>
              )}
            </YStack>
          </YStack>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showDatePicker && (
        <Modal transparent animationType="fade">
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View backgroundColor="white" borderRadius={12} padding={20} width="90%">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
              <XStack space={12} justifyContent="flex-end" marginTop={16}>
                <Button onPress={handleCancelDate} backgroundColor="transparent">
                  <ButtonText color={colors.text}>Cancelar</ButtonText>
                </Button>
                <Button onPress={handleConfirmDate} backgroundColor={colors.tint}>
                  <ButtonText color="white">Confirmar</ButtonText>
                </Button>
              </XStack>
            </View>
          </View>
        </Modal>
      )}

      {showDueDatePicker && (
        <Modal transparent animationType="fade">
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View backgroundColor="white" borderRadius={12} padding={20} width="90%">
              <DateTimePicker
                value={tempDueDate}
                mode="date"
                display="default"
                onChange={handleDueDateChange}
              />
              <XStack space={12} justifyContent="flex-end" marginTop={16}>
                <Button onPress={handleCancelDueDate} backgroundColor="transparent">
                  <ButtonText color={colors.text}>Cancelar</ButtonText>
                </Button>
                <Button onPress={handleConfirmDueDate} backgroundColor={colors.tint}>
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