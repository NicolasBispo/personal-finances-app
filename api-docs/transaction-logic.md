# Lógica de Transações - Personal Finances API

## Visão Geral

Este documento explica como funciona a lógica de validação e exibição das transações no sistema de finanças pessoais, considerando os diferentes tipos de transações e suas características específicas.

## Tipos de Transações

### 1. INCOME (Receita)
- **Status válidos**: `PENDING`, `RECEIVED`, `CANCELLED`
- **Status padrão**: `PENDING`
- **Características**:
  - Não pode ter parcelas
  - Não é "pagável", mas sim "recebível"
  - Quando marcada como `RECEIVED`, define `dateOccurred`
  - Exibição: "Receita pendente" ou "Receita recebida"

### 2. EXPENSE (Despesa)
- **Status válidos**: `PENDING`, `PAID`, `CANCELLED`
- **Status padrão**: `PENDING`
- **Características**:
  - Pode ser paga ou não
  - Quando marcada como `PAID`, define `dateOccurred`
  - Exibição: "Despesa pendente" ou "Despesa paga"

### 3. INSTALLMENT (Parcela)
- **Status válidos**: `PENDING`, `PAID`, `CANCELLED`
- **Status padrão**: `PENDING`
- **Características**:
  - Sempre tem pelo menos 2 parcelas
  - Cada parcela é uma transação individual
  - Transação pai representa o total
  - Quando todas as parcelas são pagas, a transação pai é marcada como `PAID`
  - Exibição: "Parcela X/Y pendente" ou "Parcela X/Y paga"

### 4. RECURRING (Recorrente)
- **Status válidos**: `PENDING`, `COMPLETED`, `CANCELLED`
- **Status padrão**: `PENDING`
- **Características**:
  - Tem padrão de recorrência (semanal, mensal, anual)
  - Quando marcada como `COMPLETED`, define `dateOccurred` e calcula próxima ocorrência
  - Exibição: "Recorrente pendente" ou "Recorrente processada"

### 5. TRANSFER (Transferência)
- **Status válidos**: `PENDING`, `COMPLETED`, `CANCELLED`
- **Status padrão**: `COMPLETED` (instantânea)
- **Características**:
  - Processamento instantâneo
  - Quando marcada como `COMPLETED`, define `dateOccurred`
  - Exibição: "Transferência processada"

## Validações por Tipo

### Validações na Criação

```typescript
// INCOME
- Não pode ter totalInstallments
- Não pode ter recurrencePattern

// EXPENSE
- Pode ter totalInstallments (opcional)
- Não pode ter recurrencePattern

// INSTALLMENT
- Deve ter totalInstallments >= 2
- Não pode ter recurrencePattern

// RECURRING
- Deve ter recurrencePattern válido (weekly, monthly, yearly)
- Não pode ter totalInstallments

// TRANSFER
- Não pode ter totalInstallments
- Não pode ter recurrencePattern
```

### Validações na Atualização de Status

```typescript
// INCOME
- PENDING → RECEIVED: OK
- PENDING → CANCELLED: OK
- RECEIVED → CANCELLED: OK

// EXPENSE
- PENDING → PAID: OK
- PENDING → CANCELLED: OK
- PAID → CANCELLED: OK

// INSTALLMENT
- PENDING → PAID: OK (verifica se todas as parcelas foram pagas)
- PENDING → CANCELLED: OK
- PAID → CANCELLED: OK

// RECURRING
- PENDING → COMPLETED: OK (calcula próxima ocorrência)
- PENDING → CANCELLED: OK
- COMPLETED → CANCELLED: OK

// TRANSFER
- PENDING → COMPLETED: OK
- PENDING → CANCELLED: OK
- COMPLETED → CANCELLED: OK
```

## Organização da Exibição

### 1. Filtros Disponíveis
- Por tipo de transação
- Por status
- Por período (data início/fim)
- Por usuário

### 2. Agrupamento Sugerido para Frontend

```typescript
// Por Status
{
  pending: {
    income: [...],
    expenses: [...],
    installments: [...],
    recurring: [...]
  },
  completed: {
    received: [...], // income
    paid: [...],     // expenses, installments
    processed: [...] // recurring, transfer
  }
}

// Por Tipo
{
  income: [...],
  expenses: [...],
  installments: [...],
  recurring: [...],
  transfers: [...]
}
```

### 3. Campos de Exibição por Tipo

```typescript
// INCOME
{
  description: "Salário",
  amountInCents: 5000,
  status: "RECEIVED",
  date: "2024-01-15",
  dateOccurred: "2024-01-15",
  displayStatus: "Receita recebida"
}

// EXPENSE
{
  description: "Conta de luz",
  amountInCents: 150,
  status: "PAID",
  date: "2024-01-10",
  dateOccurred: "2024-01-10",
  displayStatus: "Despesa paga"
}

// INSTALLMENT
{
  description: "Notebook - Parcela 1/12",
  amountInCents: 500,
  status: "PAID",
  installmentNumber: 1,
  totalInstallments: 12,
  parentTransactionId: "uuid",
  displayStatus: "Parcela 1/12 paga"
}

// RECURRING
{
  description: "Netflix",
  amountInCents: 45,
  status: "COMPLETED",
  recurrencePattern: "monthly",
  nextOccurrence: "2024-02-15",
  displayStatus: "Recorrente processada"
}

// TRANSFER
{
  description: "Transferência para poupança",
  amountInCents: 1000,
  status: "COMPLETED",
  dateOccurred: "2024-01-12",
  displayStatus: "Transferência processada"
}
```

## Lógica de Cálculo de Saldo

```typescript
// Receitas (INCOME com status RECEIVED)
totalIncome = sum(income.status === 'RECEIVED')

// Despesas (EXPENSE + INSTALLMENT com status PAID)
totalExpenses = sum(expense.status === 'PAID') + sum(installment.status === 'PAID')

// Saldo
balance = totalIncome - totalExpenses

// Pendências
pendingIncome = sum(income.status === 'PENDING')
pendingExpenses = sum(expense.status === 'PENDING') + sum(installment.status === 'PENDING')
```

## Exemplos de Uso

### Criar uma despesa simples
```json
POST /transactions
{
  "amountInCents": 150,
  "date": "2024-01-15",
  "description": "Conta de luz",
  "type": "EXPENSE",
  "userId": "user-uuid"
}
```

### Criar uma compra parcelada
```json
POST /transactions
{
  "amountInCents": 6000,
  "date": "2024-01-15",
  "description": "Notebook",
  "type": "INSTALLMENT",
  "userId": "user-uuid",
  "totalInstallments": 12
}
```

### Marcar uma despesa como paga
```json
PUT /transactions/{id}/status?userId=user-uuid
{
  "status": "PAID",
  "dateOccurred": "2024-01-15"
}
```

### Marcar uma receita como recebida
```json
PUT /transactions/{id}/status?userId=user-uuid
{
  "status": "RECEIVED",
  "dateOccurred": "2024-01-15"
}
```

## Considerações Importantes

1. **Campos Obrigatórios**: Todos os tipos precisam de `amountInCents`, `date`, `description`, `type` e `userId`

2. **Campos Opcionais**: `totalInstallments` (apenas para INSTALLMENT), `recurrencePattern` (apenas para RECURRING)

3. **Validações de Negócio**: Cada tipo tem suas próprias regras de validação

4. **Status Automático**: TRANSFER é automaticamente marcada como COMPLETED

5. **Relacionamentos**: INSTALLMENT cria automaticamente as parcelas e a transação pai

6. **Índices**: Criados para otimizar consultas por usuário, tipo, status e data 