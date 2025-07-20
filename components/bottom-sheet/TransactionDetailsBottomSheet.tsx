import { TransactionDetailsManager } from "@/components/transaction/transaction-details";
import { Transaction } from "@/types/transaction";
import BaseBottomSheet from "./BaseBottomSheet";

interface TransactionDetailsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function TransactionDetailsBottomSheet({
  isVisible,
  onClose,
  transaction,
}: TransactionDetailsBottomSheetProps) {
  return (
    <BaseBottomSheet
      isVisible={isVisible}
      onClose={onClose}
    >
      <TransactionDetailsManager
        transaction={transaction}
        bottomSheetControls={
          {
            close: onClose,
          }
        }
      />
    </BaseBottomSheet>
  );
} 