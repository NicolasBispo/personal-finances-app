import { TransactionDetailsBottomSheet } from "@/components/bottom-sheet";
import { useTransactionBottomSheet } from "@/providers/TransactionBottomSheetProvider";
import { TransactionService } from "@/services/transactionService";
import { Transaction, TransactionType } from "@/types/transaction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ExpensesContextData {
  // Estado das transações
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  
  // Estado do bottom sheet de detalhes
  selectedTransaction: Transaction | null;
  isDetailsVisible: boolean;
  
  // Funções
  handleOpenForm: () => void;
  handleTransactionPress: (transaction: Transaction) => void;
  handleCloseDetails: () => void;
  
  // Funções de atualização otimista
  updateTransactions: (updatedTransactions: Transaction[]) => void;
  removeTransactionById: (transactionId: string) => void;
  
  // Dados calculados
  totalExpenses: number;
  dateRange: { startDate: Date; endDate: Date };
  queryKey: string[];
}

const ExpensesContext = createContext<ExpensesContextData | undefined>(undefined);

interface ExpensesProviderProps {
  children: React.ReactNode;
  dateRange: { startDate: Date; endDate: Date };
}

export function ExpensesProvider({ children, dateRange }: ExpensesProviderProps) {
  const { openTransactionSheet } = useTransactionBottomSheet();
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // Query key para as transações
  const queryKey = useMemo(() => [
    "expenses", 
    "transactions", 
    dateRange.startDate.toISOString().split('T')[0], 
    dateRange.endDate.toISOString().split('T')[0]
  ], [dateRange]);

  // Query para buscar as transações
  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => TransactionService.getAllTransactions({
      startDate: dateRange.startDate.toISOString().split('T')[0],
      endDate: dateRange.endDate.toISOString().split('T')[0],
      type: [TransactionType.EXPENSE, TransactionType.RECURRING, TransactionType.INSTALLMENT],
    }),
  });

  // Calcular total de despesas
  const totalExpenses = useMemo(() => 
    transactions?.reduce((sum, transaction) => sum + transaction.amountInCents, 0) || 0,
    [transactions]
  );

  // Função para abrir o formulário de nova despesa
  const handleOpenForm = useCallback(() => {
    openTransactionSheet("EXPENSE", queryKey);
  }, [openTransactionSheet, queryKey]);

  // Função para abrir detalhes da transação
  const handleTransactionPress = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsVisible(true);
  }, []);

  // Função para fechar detalhes da transação
  const handleCloseDetails = useCallback(() => {
    setIsDetailsVisible(false);
    setSelectedTransaction(null);
  }, []);

  // Função para atualizar transações otimisticamente
  const updateTransactions = useCallback((updatedTransactions: Transaction[]) => {
    queryClient.setQueryData(queryKey, updatedTransactions);
  }, [queryClient, queryKey]);

  // Função para remover transação por ID otimisticamente
  const removeTransactionById = useCallback((transactionId: string) => {
    queryClient.setQueryData(queryKey, (oldData: Transaction[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.filter(transaction => transaction.id !== transactionId);
    });
  }, [queryClient, queryKey]);

  const contextValue: ExpensesContextData = {
    transactions,
    isLoading,
    error,
    refetch,
    selectedTransaction,
    isDetailsVisible,
    handleOpenForm,
    handleTransactionPress,
    handleCloseDetails,
    updateTransactions,
    removeTransactionById,
    totalExpenses,
    dateRange,
    queryKey,
  };

  return (
    <ExpensesContext.Provider value={contextValue}>
      {children}
      {selectedTransaction && (
        <TransactionDetailsBottomSheet
          isVisible={isDetailsVisible}
          onClose={handleCloseDetails}
          transaction={selectedTransaction}
        />
      )}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
} 