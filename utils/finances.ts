export const formatCurrencyFromCents = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};