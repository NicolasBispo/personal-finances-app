import { usePlanner } from "@/providers/PlannerProvider";
import { TransactionService } from "@/services/transactionService";
import { TransactionType } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTransactionQueries = () => {
  const { planner } = usePlanner();

  // Calcular startDate e endDate baseado no planner
  const dateRange = useMemo(() => {
    const now = new Date();
    
    // Se não há planner, usar o mês atual
    if (!planner) {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      console.log('dateRange na condicao 1 (sem planner):', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startDateObj: startDate,
        endDateObj: endDate
      });
      return { startDate, endDate };
    }

    // Se há planner, usar os dados do planner
    const startDate = new Date(planner.year, planner.month_number - 1, 1);
    const endDate = new Date(planner.year, planner.month_number, 0, 23, 59, 59, 999);
    console.log('dateRange na condicao 2 (com planner):', {
      planner,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startDateObj: startDate,
      endDateObj: endDate
    });
    return { startDate, endDate };
  }, [planner]);

  console.log('dateRange final:', {
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString(),
    startDateObj: dateRange.startDate,
    endDateObj: dateRange.endDate
  });

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