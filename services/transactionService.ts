import { apiClient } from "@/config/api-client";
import { CreateTransactionData, Transaction, TransactionType } from "@/types/transaction";



type SearchTransactionParams = {
  endDate?: string;
  startDate?: string;
  type?: TransactionType | TransactionType[]; 
}

export const TransactionService = {
  getAllTransactions: async (searchParams: SearchTransactionParams) => {
    const type = Array.isArray(searchParams.type) ? searchParams.type.join(',') : searchParams.type;

    console.log("getAllTransactions: searchParams", searchParams, "type", type);
    const response = await apiClient.get<Transaction[]>('/transactions', { params: { ...searchParams, type } });
    return response.data
  },

  getIncomeTransactions: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams({ type: 'INCOME' });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get<Transaction[]>(`/transactions?${params.toString()}`);
    return response.data
  },

  getExpenseTransactions: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams({ type: 'EXPENSE' });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get<Transaction[]>(`/transactions?${params.toString()}`);
    return response.data
  },

  createTransaction: async (data: CreateTransactionData) => {
    console.log("createTransaction: data", data);
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data
  },

  updateTransaction: async (id: string, data: Partial<CreateTransactionData>) => {
    console.log("updateTransaction: id", id, "data", data);
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
    return response.data
  },

  deleteTransaction: async (id: string) => {
    console.log("deleteTransaction: id", id);
    await apiClient.delete(`/transactions/${id}`);
  },
};