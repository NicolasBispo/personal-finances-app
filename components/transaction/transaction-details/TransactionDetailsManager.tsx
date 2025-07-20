import { Transaction } from "@/types/transaction";
import { TransactionDetailsProvider, useTransactionDetails } from "./TransactionDetailsProvider";

interface TransactionDetailsManagerProps {
  transaction: Transaction;
  bottomSheetControls: {
    close: () => void;
  };
}

const TransactionDetailsRenderer = () => {
  const { renderDetailsComponent } = useTransactionDetails();
  return renderDetailsComponent();
};

export const TransactionDetailsManager = ({
  transaction,
  bottomSheetControls,
}: TransactionDetailsManagerProps) => {
  return (
    <TransactionDetailsProvider
      transaction={transaction}
      bottomSheetControls={bottomSheetControls}
    >
      <TransactionDetailsRenderer />
    </TransactionDetailsProvider>
  );
}; 