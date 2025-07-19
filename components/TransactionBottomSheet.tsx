import TransactionForm from "@/components/TransactionForm";
import { TransactionService } from "@/services/transactionService";
import { CreateTransactionData } from "@/types/transaction";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

interface TransactionBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  type: "INCOME" | "EXPENSE";
  queryKey: string[];
}

export default function TransactionBottomSheet({
  isVisible,
  onClose,
  type,
  queryKey,
}: TransactionBottomSheetProps) {
  const queryClient = useQueryClient();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionData) => TransactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsFormOpen(false);
      bottomSheetRef.current?.close();
      onClose();
      Alert.alert("Sucesso", "Transação criada com sucesso!");
    },
    onError: (error) => {
      Alert.alert("Erro", "Erro ao criar transação. Tente novamente.");
      console.error("Erro ao criar transação:", error);
    },
  });

  const snapPoints = useMemo(() => ["85%"], []);

  const handleCreateTransaction = useCallback((data: CreateTransactionData) => {
    createTransactionMutation.mutate(data);
  }, [createTransactionMutation]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsFormOpen(false);
      onClose();
    }
  }, [onClose]);

  // Abrir o bottom sheet quando isVisible mudar para true
  useEffect(() => {
    if (isVisible) {
      setIsFormOpen(true);
    } else {
      setIsFormOpen(false);
    }
  }, [isVisible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!isVisible) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      enableOverDrag={false}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "white",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#E0E0E0",
      }}
      style={{
        zIndex: 9999,
        elevation: 9999,
      }}
      keyboardBehavior={Platform.OS === "ios" ? "interactive" : "extend"}
      keyboardBlurBehavior="restore"
      animateOnMount={true}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={{ flex: 1, height: '100%' }}>
        <TransactionForm
          onSubmit={handleCreateTransaction}
          onCancel={handleCloseForm}
          isLoading={createTransactionMutation.isPending}
          type={type}
        />
      </BottomSheetView>
    </BottomSheet>
  );
} 