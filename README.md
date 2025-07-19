# Personal Finances App

## Funcionalidades de Parcelas

### Listar Todas as Parcelas do Usuário
- **Rota**: `/installments`
- **Descrição**: Lista todas as transações parceladas do usuário
- **Navegação**: A partir do menu principal ou tab de parcelas

### Listar Parcelas de uma Transação Específica
- **Rota**: `/installments/transaction/[transactionId]`
- **Descrição**: Lista todas as parcelas de uma transação específica
- **Parâmetros**: 
  - `transactionId`: ID da transação pai
- **Navegação**: 
  ```typescript
  // Exemplo de navegação
  const router = useRouter();
  router.push(`/installments/transaction/${transactionId}`);
  ```

### Detalhes de uma Parcela
- **Rota**: `/installments/[id]`
- **Descrição**: Mostra os detalhes de uma parcela específica
- **Parâmetros**:
  - `id`: ID da parcela

## Como Usar

### Para navegar para a lista de parcelas de uma transação:
```typescript
import { useRouter } from "expo-router";

const router = useRouter();

// Navegar para ver todas as parcelas de uma transação específica
const handleViewInstallments = (transactionId: string) => {
  router.push(`/installments/transaction/${transactionId}`);
};
```

### Estrutura de Dados
As transações parceladas seguem esta estrutura:
```typescript
type Transaction = {
  id: string;
  parentTransactionId?: string; // ID da transação pai (para parcelas)
  installmentNumber?: number; // Número da parcela atual
  totalInstallments?: number; // Total de parcelas
  // ... outros campos
};
```

### Lógica de Navegação
- Se uma transação tem `parentTransactionId`, ela é uma parcela
- Ao clicar em uma parcela na lista geral, o app navega para a lista de parcelas da transação pai
- Se uma transação não tem `parentTransactionId`, ela é a transação pai e navega para seus detalhes

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
