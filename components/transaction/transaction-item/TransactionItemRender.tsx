import { TransactionItemContainer } from "./TransactionItemContainer";
import { useTransactionItem } from "./TransactionItemProvider";

export const TransactionItemRender = () => {
  const { renderTransactionItem, transaction, onPress } = useTransactionItem();
  return (
    <TransactionItemContainer onPress={onPress}>
      {renderTransactionItem(transaction)}
    </TransactionItemContainer>
  );
};
