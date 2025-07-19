import { Transaction } from "@/types/transaction";
import { TransactionItemProvider } from "./TransactionItemProvider";
import { TransactionItemRender } from "./TransactionItemRender";

type TransactionItemProps = {
  transaction: Transaction;
  onPress?: () => void;
};

export default function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  return (
    <TransactionItemProvider transaction={transaction} onPress={onPress}>
      <TransactionItemRender />
    </TransactionItemProvider>
  );
}
