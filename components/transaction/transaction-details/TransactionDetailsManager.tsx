import { Transaction, TransactionType } from "@/types/transaction";
import { BaseTransactionDetails } from "./BaseTransactionDetails";
import { ExpenseDetails } from "./ExpenseDetails";
import { IncomeDetails } from "./IncomeDetails";
import { InstallmentDetails } from "./InstallmentDetails";
import { RecurringDetails } from "./RecurringDetails";

interface TransactionDetailsManagerProps {
  transaction: Transaction;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const TransactionDetailsManager = ({
  transaction,
  onUpdate,
  onDelete,
  onCancel,
  isLoading,
  isUpdating,
  isDeleting,
}: TransactionDetailsManagerProps) => {
  const renderDetailsComponent = () => {
    switch (transaction.type) {
      case TransactionType.EXPENSE:
        return (
          <ExpenseDetails
            transaction={transaction}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        );

      case TransactionType.INCOME:
        return (
          <IncomeDetails
            transaction={transaction}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        );

      case TransactionType.INSTALLMENT:
        return (
          <InstallmentDetails
            transaction={transaction}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        );

      case TransactionType.RECURRING:
        return (
          <RecurringDetails
            transaction={transaction}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        );

      default:
        return (
          <BaseTransactionDetails
            transaction={transaction}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onCancel={onCancel}
            isLoading={isLoading}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        );
    }
  };

  return renderDetailsComponent();
}; 