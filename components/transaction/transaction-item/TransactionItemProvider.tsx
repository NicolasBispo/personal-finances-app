import { Colors } from "@/constants/Colors";
import { Transaction, TransactionType } from "@/types/transaction";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { ExpenseItem } from "./ExpenseItem";
import { IncomeItem } from "./IncomeItem";
import { InstallmentItem } from "./InstallmentItem";
import { RecurringItem } from "./RecurringItem";

type TransactionItemContextType = {
  transaction: Transaction;
  setTransaction: (transaction: Transaction) => void;
  renderTransactionItem: (transaction: Transaction) => ReactNode;
  transactionItemIcon: ReactNode;
  isIncome: boolean;
  transactionTypeDisplay: string | null;
  onPress?: () => void;
};

const TransactionItemContext = createContext<TransactionItemContextType | null>(
  null
);

type TransactionItemProviderProps = {
  transaction: Transaction;
  children: ReactNode;
  onPress?: () => void;
};

export const TransactionItemProvider = ({
  transaction: initialTransaction,
  children,
  onPress,
}: TransactionItemProviderProps) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "light" ? Colors.light : Colors.dark;
  const [transaction, setTransaction] =
    useState<Transaction>(initialTransaction);

    const isIncome = transaction.type === TransactionType.INCOME;

  const renderTransactionItem = useCallback((transaction: Transaction) => {
    switch (transaction.type) {
      case TransactionType.INCOME:
        return <IncomeItem />;
      case TransactionType.EXPENSE:
        return <ExpenseItem />;
      case TransactionType.RECURRING:
        return <RecurringItem />;
      case TransactionType.INSTALLMENT:
        return <InstallmentItem />;
      default:
        return null;
    }
  }, []);

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

  


  const transactionItemIcon = useMemo(() => {
    const isIncome = transaction.type === TransactionType.INCOME;
    return (
      <MaterialIcons
        name={isIncome ? "trending-up" : "trending-down"}
        size={20}
        color={isIncome ? colors.tint : "#E74C3C"}
      />
    );
  }, [transaction.type, colors]);

  return (
    <TransactionItemContext.Provider
      value={{ transaction, setTransaction, renderTransactionItem, transactionItemIcon, isIncome, transactionTypeDisplay, onPress }}
    >
      {children}
    </TransactionItemContext.Provider>
  );
};

export const useTransactionItem = () => {
  const context = useContext(TransactionItemContext);
  if (!context) {
    throw new Error(
      "useTransactionItem must be used within a TransactionItemProvider"
    );
  }
  return context;
};
