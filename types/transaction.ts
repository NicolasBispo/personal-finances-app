import { User } from "./auth";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  RECURRING = "RECURRING",
  INSTALLMENT = "INSTALLMENT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  RECEIVED = "RECEIVED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type Transaction = {
  id: string;
  amountInCents: number; // Valor em centavos
  date: Date; // Data planejada/esperada
  dueDate?: Date; // Data de vencimento (opcional)
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  dateOccurred?: Date; // Data real quando aconteceu
  userId: string;
  user: User;

  // Campos específicos para parcelas
  installmentNumber?: number; // Número da parcela atual
  totalInstallments?: number; // Total de parcelas
  parentTransactionId?: string; // ID da transação pai (para parcelas)
  parentTransaction?: Transaction; // Relação com transação pai
  installments?: Transaction[]; // Lista de parcelas

  // Campos específicos para recorrentes
  recurrencePattern?: string; // "monthly", "weekly", "yearly"
  nextOccurrence?: Date; // Próxima ocorrência

  createdAt: Date;
  updatedAt: Date;
};

// Tipo para criação de transação
export type CreateTransactionData = {
  description: string;
  amountInCents: number; // Valor em centavos
  date: Date;
  dueDate?: Date;
  type: "INCOME" | "EXPENSE" | "INSTALLMENT" | "RECURRING"; // Tipo correto para a API
  totalInstallments?: number; // Quantidade total de parcelas (apenas para INSTALLMENT)
};
