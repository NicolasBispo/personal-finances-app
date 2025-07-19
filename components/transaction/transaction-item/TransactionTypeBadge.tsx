import { Button, ButtonText } from "tamagui";
import { useTransactionItem } from "./TransactionItemProvider";
import { useMemo } from "react";
import { TransactionType } from "@/types/transaction";

export const TransactionTypeBadge = () => {
  const { transaction, transactionTypeDisplay } = useTransactionItem();

  const backgroundColor = useMemo(() => {
    switch (transaction.type) {
      case TransactionType.INCOME:
        return "green";
      default:
        return "gray";
    }
  }, [transaction]);

  return (
    <Button disabled borderRadius={24} backgroundColor={backgroundColor}>
      <ButtonText>{transactionTypeDisplay}</ButtonText>
    </Button>
  );
};
