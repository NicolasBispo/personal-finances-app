import TransactionForm from "@/components/TransactionForm";
import { TransactionService } from "@/services/transactionService";
import { CreateTransactionData } from "@/types/transaction";
import { useCallback } from "react";
import FormBottomSheet from "./FormBottomSheet";

interface TransactionBottomSheetV2Props {
  isVisible: boolean;
  onClose: () => void;
  type: "INCOME" | "EXPENSE";
  queryKey: string[];
}

export default function TransactionBottomSheetV2({
  isVisible,
  onClose,
  type,
  queryKey,
}: TransactionBottomSheetV2Props) {
  const handleCreateTransaction = useCallback((data: CreateTransactionData) => {
    return TransactionService.createTransaction(data);
  }, []);

  return (
    <FormBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      mutationFn={handleCreateTransaction}
      successMessage="Transação criada com sucesso!"
      errorMessage="Erro ao criar transação. Tente novamente."
      queryKey={queryKey}
    >
      <TransactionForm
        onSubmit={(data) => {
          // A mutação será gerenciada pelo FormBottomSheet
          return handleCreateTransaction(data);
        }}
        onCancel={onClose}
        isLoading={false} // Será gerenciado pelo FormBottomSheet
        type={type}
      />
    </FormBottomSheet>
  );
} 