import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Button, Stack, Text, View } from "tamagui";

export default function PlannerHeader(props: BottomTabHeaderProps) {
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
            pressStyle={{
              backgroundColor: colors.icon + "20",
            }}
          >
            <MaterialIcons name="chevron-left" size={20} color={colors.icon} />
          </Button>

          {/* Data Selecionada */}
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
              Janeiro 2024
            </Text>
          </Stack>

          {/* Botão Próximo */}
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            borderWidth={1}
            borderColor={colors.icon}
            pressStyle={{
              backgroundColor: colors.icon + "20",
            }}
          >
            <MaterialIcons name="chevron-right" size={20} color={colors.icon} />
          </Button>
        </Stack>
      </Stack>
    </View>
  );
}
