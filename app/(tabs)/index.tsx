import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button, ButtonText, XStack } from 'tamagui';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Personal Finances App</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Acesso Rápido</ThemedText>
        <XStack space={12} flexWrap="wrap">
          <Button
            backgroundColor="#9B59B6"
            onPress={() => router.push("/installments")}
            paddingHorizontal={16}
            paddingVertical={8}
            borderRadius={8}
          >
            <XStack alignItems="center" space={6}>
              <MaterialIcons name="credit-card" size={18} color="white" />
              <ButtonText color="white" fontWeight="600" fontSize={14}>
                Parcelas
              </ButtonText>
            </XStack>
          </Button>
        </XStack>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sistema de Autenticação</ThemedText>
        <ThemedText>
          Exemplo de autenticação usando React Query, React Hook Form e Tamagui.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Funcionalidades Implementadas</ThemedText>
        <ThemedText>
          • React Hook Form para gerenciamento de formulários{'\n'}
          • TanStack Query para cache e sincronização de dados{'\n'}
          • Axios para requisições HTTP{'\n'}
          • Tamagui para componentes de UI modernos{'\n'}
          • Sistema de autenticação completo com AuthProvider{'\n'}
          • Sistema de parcelas com navegação stack
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
