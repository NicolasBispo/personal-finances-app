import { createContext, ReactNode, useContext, useState } from "react";

interface TransactionBottomSheetContextType {
  isVisible: boolean;
  type: "INCOME" | "EXPENSE";
  queryKey: string[];
  openTransactionSheet: (type: "INCOME" | "EXPENSE", queryKey: string[]) => void;
  closeTransactionSheet: () => void;
}

const TransactionBottomSheetContext = createContext<TransactionBottomSheetContextType | undefined>(undefined);

interface TransactionBottomSheetProviderProps {
  children: ReactNode;
}

export function TransactionBottomSheetProvider({ children }: TransactionBottomSheetProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [queryKey, setQueryKey] = useState<string[]>([]);

  const openTransactionSheet = (transactionType: "INCOME" | "EXPENSE", transactionQueryKey: string[]) => {
    setType(transactionType);
    setQueryKey(transactionQueryKey);
    setIsVisible(true);
  };

  const closeTransactionSheet = () => {
    setIsVisible(false);
  };

  return (
    <TransactionBottomSheetContext.Provider
      value={{
        isVisible,
        type,
        queryKey,
        openTransactionSheet,
        closeTransactionSheet,
      }}
    >
      {children}
    </TransactionBottomSheetContext.Provider>
  );
}

export function useTransactionBottomSheet() {
  const context = useContext(TransactionBottomSheetContext);
  if (context === undefined) {
    throw new Error("useTransactionBottomSheet must be used within a TransactionBottomSheetProvider");
  }
  return context;
} 