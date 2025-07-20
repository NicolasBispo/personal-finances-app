import { Transaction, TransactionStatus, TransactionType } from "@/types/transaction";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { BaseTransactionDetails } from "./BaseTransactionDetails";
import { ExpenseDetails } from "./ExpenseDetails";
import { IncomeDetails } from "./IncomeDetails";
import { InstallmentDetails } from "./InstallmentDetails";
import { RecurringDetails } from "./RecurringDetails";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { TransactionService } from "@/services/transactionService";
import { InstallmentService } from "@/services/installmentService";

type TransactionDetailsContextType = {
  transaction: Transaction;
  setTransaction: (transaction: Transaction) => void;
  renderDetailsComponent: () => ReactNode;
  isIncome: boolean;
  transactionTypeDisplay: string | null;
  updateTransactionStatus: (status: TransactionStatus) => void;
  deleteTransactionMutation: UseMutationResult<void, Error, void, unknown>;
  deleteInstallmentMutation: UseMutationResult<void, Error, string, unknown>;
  bottomSheetControls: {
    close: () => void;
  };
};

const TransactionDetailsContext = createContext<TransactionDetailsContextType | null>(
  null
);

type TransactionDetailsProviderProps = {
  transaction: Transaction;
  children: ReactNode;
  bottomSheetControls: {
    close: () => void;
  };
};

export const TransactionDetailsProvider = ({
  transaction: initialTransaction,
  children,
  bottomSheetControls,
}: TransactionDetailsProviderProps) => {
  const [transaction, setTransaction] =
    useState<Transaction>(initialTransaction);

  const isIncome = transaction.type === TransactionType.INCOME;

  const deleteTransactionMutation = useMutation({
    mutationFn: () => TransactionService.deleteTransaction(transaction.id),
  })


  const deleteInstallmentMutation = useMutation({
    mutationFn: (installmentId: string) => InstallmentService.deleteInstallment(installmentId),
  })

  const renderDetailsComponent = useCallback(() => {
    switch (transaction.type) {
      case TransactionType.EXPENSE:
        return <ExpenseDetails  />;

      case TransactionType.INCOME:
        return <IncomeDetails />;

      case TransactionType.INSTALLMENT:
        return <InstallmentDetails />;

      case TransactionType.RECURRING:
        return <RecurringDetails  />;

      default:
        return <BaseTransactionDetails  />;
    }
  }, [transaction]);

  const transactionTypeDisplay = useMemo(() => {
    switch (transaction.type) {
      case TransactionType.INCOME:
        return "Receita";
      case TransactionType.EXPENSE:
        return "Despesa";
      case TransactionType.RECURRING:
        return "Recorrente";
      case TransactionType.INSTALLMENT:
        return "Parcelada";
      case TransactionType.TRANSFER:
        return "Transferência";
      default:
        return null;
    }
  }, [transaction]);

  const { mutate: updateTransactionStatus } = useMutation({
    mutationFn: (status: TransactionStatus) =>
      TransactionService.updateTransactionStatus(transaction.id, status),
    onSuccess: (data) => {
      return data
    },
  });

  const value = useMemo(() => {
    return {
      transaction,
        setTransaction,
        renderDetailsComponent,
        isIncome,
        transactionTypeDisplay,
        deleteTransactionMutation,
        updateTransactionStatus,
        bottomSheetControls,
        deleteInstallmentMutation,
    }
  }, [transaction, setTransaction, renderDetailsComponent, isIncome, transactionTypeDisplay, deleteTransactionMutation, updateTransactionStatus, bottomSheetControls, deleteInstallmentMutation])

  return (
    <TransactionDetailsContext.Provider
      value={value}
    >
      {children}
    </TransactionDetailsContext.Provider>
  );
};

export const useTransactionDetails = () => {
  const context = useContext(TransactionDetailsContext);
  if (!context) {
    throw new Error(
      "useTransactionDetails must be used within a TransactionDetailsProvider"
    );
  }
  return context;
}; 