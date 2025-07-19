import { usePlanner } from "@/providers/PlannerProvider";
import { TransactionService } from "@/services/transactionService";
import { TransactionType } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTransactionQueries = () => {
  const { planner } = usePlanner();

  // Calcular startDate e endDate baseado no planner
  const dateRange = useMemo(() => {
    if (!planner) {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startDate, endDate };
    }

    const startDate = new Date(planner.year, planner.month_number - 1, 1);
    const endDate = new Date(planner.year, planner.month_number, 0, 23, 59, 59, 999);
    
    return { startDate, endDate };
  }, [planner]);

  // Query para despesas
  const expensesQuery = useQuery({
    queryKey: ["expenses", "transactions", dateRange.startDate.toISOString().split('T')[0], dateRange.endDate.toISOString().split('T')[0]],
    queryFn: () => TransactionService.getAllTransactions({
      startDate: dateRange.startDate.toISOString().split('T')[0],
      endDate: dateRange.endDate.toISOString().split('T')[0],
      type: [TransactionType.EXPENSE, TransactionType.RECURRING, TransactionType.INSTALLMENT],
    }),
  });

  // Query para receitas
  const receivesQuery = useQuery({
    queryKey: ["receives", "transactions", dateRange.startDate.toISOString().split('T')[0], dateRange.endDate.toISOString().split('T')[0]],
    queryFn: () => TransactionService.getIncomeTransactions(
      dateRange.startDate.toISOString().split('T')[0],
      dateRange.endDate.toISOString().split('T')[0]
    ),
  });

  return {
    expensesQuery,
    receivesQuery,
    dateRange,
    planner,
  };
}; 