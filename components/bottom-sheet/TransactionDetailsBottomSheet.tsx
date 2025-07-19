import { TransactionDetailsManager } from "@/components/transaction/transaction-details";
import { Transaction } from "@/types/transaction";
import BaseBottomSheet from "./BaseBottomSheet";
import { useTransactionDetails } from "./useTransactionDetails";

interface TransactionDetailsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  transaction: Transaction;
  queryKey: string[];
}

export default function TransactionDetailsBottomSheet({
  isVisible,
  onClose,
  transaction,
  queryKey,
}: TransactionDetailsBottomSheetProps) {
  const { updateMutation, deleteMutation, isUpdating, isDeleting } = useTransactionDetails({
    transaction,
    queryKey,
    onSuccess: onClose,
  });

  const handleUpdateTransaction = (data: any) => {
    updateMutation.mutate(data);
  };

  const handleDeleteTransaction = () => {
    deleteMutation.mutate();
  };

  return (
    <BaseBottomSheet
      isVisible={isVisible}
      onClose={onClose}
    >
      <TransactionDetailsManager
        transaction={transaction}
        onUpdate={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
        onCancel={onClose}
        isLoading={isUpdating || isDeleting}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </BaseBottomSheet>
  );
} 