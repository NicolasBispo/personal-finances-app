import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { TransactionService } from "@/services/transactionService";
import { Transaction } from "@/types/transaction";

interface UseTransactionDetailsProps {
  transaction: Transaction;
  queryKey: string[];
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTransactionDetails({
  transaction,
  queryKey,
  onSuccess,
  onError,
}: UseTransactionDetailsProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: {
      description: string;
      amountInCents: number;
      date: Date;
      dueDate?: Date;
      type: "INCOME" | "EXPENSE";
      expenseType?: "EXPENSE" | "INSTALLMENT" | "RECURRING";
    }) => TransactionService.updateTransaction(transaction.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      Alert.alert("Sucesso", "Transação atualizada com sucesso!");
      onSuccess?.();
    },
    onError: (error) => {
      Alert.alert("Erro", "Erro ao atualizar transação. Tente novamente.");
      console.error("Erro ao atualizar transação:", error);
      onError?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => TransactionService.deleteTransaction(transaction.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      Alert.alert("Sucesso", "Transação excluída com sucesso!");
      onSuccess?.();
    },
    onError: (error) => {
      Alert.alert("Erro", "Erro ao excluir transação. Tente novamente.");
      console.error("Erro ao excluir transação:", error);
      onError?.(error);
    },
  });

  return {
    updateMutation,
    deleteMutation,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
} 