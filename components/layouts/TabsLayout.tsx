import { useTransactionBottomSheet } from "@/providers/TransactionBottomSheetProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import PlannerControls from "../planner/PlannerControls";
import TransactionBottomSheet from "../TransactionBottomSheet";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isVisible, type, queryKey, closeTransactionSheet } = useTransactionBottomSheet();

  return (
    <SafeAreaView style={{ flex: 1, position: 'relative' }}>
      <PlannerControls />
      {children}
      
      <TransactionBottomSheet
        isVisible={isVisible}
        onClose={closeTransactionSheet}
        type={type}
        queryKey={queryKey}
      />
    </SafeAreaView>
  );
}
