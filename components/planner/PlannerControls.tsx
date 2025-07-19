import { Colors } from "@/constants/Colors";
import { usePlanner } from "@/providers/PlannerProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useEffect, useState } from "react";
import { Modal, Platform } from "react-native";
import { Button, Stack, Text, View } from "tamagui";

export default function PlannerControls() {
  const { planner, setPlanner } = usePlanner();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  // Inicializar planner apenas uma vez na montagem
  useEffect(() => {
    if (!planner) {
      const now = new Date();
      setPlanner({
        id: 1,
        month_name: now.toLocaleDateString("pt-BR", { month: "long" }),
        month_number: now.getMonth() + 1,
        year: now.getFullYear(),
      });
    }
  }, [planner, setPlanner]);

  // Sincronizar selectedDate com planner
  useEffect(() => {
    if (planner) {
      setSelectedDate(new Date(planner.year, planner.month_number - 1, 1));
    }
  }, [planner]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setSelectedDate(newDate);
    setPlanner({
      id: planner?.id || 1,
      month_name: newDate.toLocaleDateString("pt-BR", { month: "long" }),
      month_number: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    });
  }, [selectedDate, planner?.id, setPlanner]);

  const formatMonthYear = useCallback((date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }, []);

  const handleDateChange = useCallback((event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
        setPlanner({
          id: planner?.id || 1,
          month_name: date.toLocaleDateString("pt-BR", { month: "long" }),
          month_number: date.getMonth() + 1,
          year: date.getFullYear(),
        });
      }
    } else {
      // iOS - apenas atualiza a data temporária
      if (date) {
        setTempDate(date);
      }
    }
  }, [planner?.id, setPlanner]);

  const handleDatePress = useCallback(() => {
    setTempDate(selectedDate);
    setShowDatePicker(true);
  }, [selectedDate]);

  const handleConfirmDate = useCallback(() => {
    setSelectedDate(tempDate);
    setPlanner({
      id: planner?.id || 1,
      month_name: tempDate.toLocaleDateString("pt-BR", { month: "long" }),
      month_number: tempDate.getMonth() + 1,
      year: tempDate.getFullYear(),
    });
    setShowDatePicker(false);
  }, [tempDate, planner?.id, setPlanner]);

  const handleCancelDate = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const colors = Colors.light;

  return (
    <View
      backgroundColor={colors.background}
      paddingHorizontal={16}
      paddingVertical={12}
      borderBottomWidth={1}
      borderBottomColor="#E5E5E5"
    >
      <Stack space={8}>
        {/* Título */}
        <Text
          fontSize={20}
          fontWeight="bold"
          color={colors.text}
          textAlign="center"
        >
          Planejamento Financeiro
        </Text>

        {/* Date Picker */}
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={8}
        >
          {/* Botão Anterior */}
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            borderWidth={1}
            borderColor={colors.icon}
            onPress={() => navigateMonth("prev")}
            pressStyle={{
              backgroundColor: colors.icon + "20",
            }}
          >
            <MaterialIcons name="chevron-left" size={20} color={colors.icon} />
          </Button>

          {/* Data Selecionada - Agora clicável */}
          <Button
            backgroundColor="transparent"
            borderWidth={0}
            onPress={handleDatePress}
            pressStyle={{
              backgroundColor: "#F0F0F0",
            }}
          >
            <Stack
              flexDirection="row"
              alignItems="center"
              space={8}
              paddingHorizontal={16}
              paddingVertical={8}
              backgroundColor="#F5F5F5"
              borderRadius={12}
              borderWidth={1}
              borderColor="#E0E0E0"
            >
              <MaterialIcons
                name="calendar-today"
                size={18}
                color={colors.tint}
              />
              <Text
                fontSize={16}
                fontWeight="600"
                color={colors.text}
                textTransform="capitalize"
              >
                {formatMonthYear(selectedDate)}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={18}
                color={colors.tint}
              />
            </Stack>
          </Button>

          {/* Botão Próximo */}
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            borderWidth={1}
            borderColor={colors.icon}
            onPress={() => navigateMonth("next")}
            pressStyle={{
              backgroundColor: colors.icon + "20",
            }}
          >
            <MaterialIcons name="chevron-right" size={20} color={colors.icon} />
          </Button>
        </Stack>
      </Stack>

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
          >
            <View
              backgroundColor={colors.background}
              borderRadius={16}
              padding={20}
              marginHorizontal={20}
              minWidth={300}
            >
              <Text
                fontSize={18}
                fontWeight="bold"
                color={colors.text}
                textAlign="center"
                marginBottom={20}
              >
                Selecionar Mês e Ano
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
              
              <Stack flexDirection="row" space={12}>
                <Button
                  flex={1}
                  backgroundColor="#E0E0E0"
                  color={colors.text}
                  onPress={handleCancelDate}
                >
                  Cancelar
                </Button>
                <Button
                  flex={1}
                  backgroundColor={colors.tint}
                  color="white"
                  onPress={handleConfirmDate}
                >
                  Confirmar
                </Button>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
} 