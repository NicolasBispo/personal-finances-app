import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Button, Text, View, XStack } from "tamagui";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const InstallmentTransactionHeader = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
}: CustomHeaderProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      backgroundColor="white"
      paddingHorizontal={16}
      paddingVertical={12}
      paddingTop={48} // Compensar pela safe area
      borderBottomWidth={1}
      borderBottomColor="#E0E0E0"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" space={12} flex={1}>
          {showBackButton && (
            <Button
              size="$3"
              circular
              backgroundColor="transparent"
              onPress={handleBackPress}
              padding={4}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </Button>
          )}
          <Text fontSize={18} fontWeight="600" color={colors.text} flex={1}>
            {title}
          </Text>
        </XStack>
        {rightComponent && (
          <View>
            {rightComponent}
          </View>
        )}
      </XStack>
    </View>
  );
}; 