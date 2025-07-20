# ExpensesProvider

O `ExpensesProvider` é um contexto React que gerencia o estado das despesas de forma global, facilitando o trânsito de dados entre componentes e permitindo atualizações otimistas na UI.

## Características

- **Gerenciamento de Estado Global**: Centraliza toda a lógica de despesas
- **Atualizações Otimistas**: Permite atualizar a UI instantaneamente sem refetch
- **Integração com React Query**: Mantém cache e sincronização com o servidor
- **Bottom Sheet Integrado**: Gerencia automaticamente o bottom sheet de detalhes

## Como Usar

### 1. Envolver o componente com o Provider

```tsx
import { ExpensesProvider } from "@/providers/ExpensesProvider";

function ExpensesTab() {
  const { planner } = usePlanner();
  const dateRange = useMemo(() => {
    // Lógica para calcular dateRange baseado no planner
  }, [planner]);

  return (
    <TabsLayout>
      <ExpensesProvider dateRange={dateRange}>
        <ExpensesContent />
      </ExpensesProvider>
    </TabsLayout>
  );
}
```

### 2. Usar o hook useExpenses

```tsx
import { useExpenses } from "@/providers/ExpensesProvider";

function ExpensesContent() {
  const {
    transactions,
    isLoading,
    error,
    refetch,
    handleOpenForm,
    handleTransactionPress,
    totalExpenses,
    updateTransactions,
    removeTransactionById,
  } = useExpenses();

  // Seu código aqui...
}
```

## API do Context

### Estado

- `transactions: Transaction[] | undefined` - Lista de transações
- `isLoading: boolean` - Estado de carregamento
- `error: any` - Erro da query
- `selectedTransaction: Transaction | null` - Transação selecionada para detalhes
- `isDetailsVisible: boolean` - Visibilidade do bottom sheet de detalhes
- `totalExpenses: number` - Total de despesas em centavos
- `dateRange: { startDate: Date; endDate: Date }` - Range de datas
- `queryKey: string[]` - Chave da query para React Query

### Funções

#### Navegação e UI
- `handleOpenForm: () => void` - Abre o formulário de nova despesa
- `handleTransactionPress: (transaction: Transaction) => void` - Abre detalhes da transação
- `handleCloseDetails: () => void` - Fecha o bottom sheet de detalhes
- `refetch: () => void` - Recarrega os dados do servidor

#### Atualizações Otimistas
- `updateTransactions: (updatedTransactions: Transaction[]) => void` - Atualiza toda a lista de transações
- `removeTransactionById: (transactionId: string) => void` - Remove uma transação específica

## Exemplos de Uso

### Remover uma Transação

```tsx
const handleDeleteTransaction = (transactionId: string) => {
  // Remove otimisticamente da UI
  removeTransactionById(transactionId);
  
  // Chama a API para remover do servidor
  TransactionService.deleteTransaction(transactionId)
    .catch(() => {
      // Se der erro, restaura o estado original
      refetch();
    });
};
```

### Atualizar uma Transação

```tsx
const handleUpdateTransaction = (updatedTransaction: Transaction) => {
  if (!transactions) return;
  
  // Atualiza a transação na lista
  const updatedTransactions = transactions.map(transaction => 
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
  
  // Atualiza otimisticamente na UI
  updateTransactions(updatedTransactions);
  
  // Chama a API para atualizar no servidor
  TransactionService.updateTransaction(updatedTransaction)
    .catch(() => {
      // Se der erro, restaura o estado original
      refetch();
    });
};
```

### Adicionar uma Nova Transação

```tsx
const handleAddTransaction = (newTransaction: Transaction) => {
  if (!transactions) return;
  
  // Adiciona otimisticamente na UI
  const updatedTransactions = [newTransaction, ...transactions];
  updateTransactions(updatedTransactions);
  
  // Chama a API para salvar no servidor
  TransactionService.createTransaction(newTransaction)
    .catch(() => {
      // Se der erro, restaura o estado original
      refetch();
    });
};
```

## Vantagens

1. **Performance**: Atualizações otimistas tornam a UI mais responsiva
2. **Reutilização**: Lógica centralizada pode ser usada em qualquer componente
3. **Manutenibilidade**: Código mais organizado e fácil de manter
4. **Consistência**: Estado sempre sincronizado entre componentes
5. **Flexibilidade**: Fácil de estender com novas funcionalidades

## Integração com React Query

O provider utiliza React Query para:
- Cache automático dos dados
- Sincronização em background
- Gerenciamento de estado de loading/error
- Invalidação automática de cache

As funções `updateTransactions` e `removeTransactionById` usam `queryClient.setQueryData()` para atualizações otimistas, mantendo a consistência com o cache do React Query. 