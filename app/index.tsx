import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading, isLoadingToken, isAuthenticating } = useAuth();
  
  // Mostra loading enquanto está carregando token ou dados do usuário
  if (isLoading || isLoadingToken || isAuthenticating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Se está autenticado, redireciona para a área protegida
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Se não está autenticado, redireciona para login
  return <Redirect href="/(auth)/login" />;
}
