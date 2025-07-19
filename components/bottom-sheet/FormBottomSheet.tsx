import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import BaseBottomSheet from "./BaseBottomSheet";
import { useBottomSheet } from "./useBottomSheet";

interface FormBottomSheetProps<TData, TMutationData> {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  mutationFn: (data: TMutationData) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  queryKey?: string[];
  snapPoints?: string[];
  backgroundStyle?: any;
  handleIndicatorStyle?: any;
  style?: any;
}

export default function FormBottomSheet<TData, TMutationData>({
  isVisible,
  onClose,
  children,
  mutationFn,
  onSuccess,
  onError,
  successMessage = "Operação realizada com sucesso!",
  errorMessage = "Erro ao realizar operação. Tente novamente.",
  queryKey,
  snapPoints,
  backgroundStyle,
  handleIndicatorStyle,
  style,
}: FormBottomSheetProps<TData, TMutationData>) {
  const queryClient = useQueryClient();
  const { handleCloseForm, handleSheetChanges } = useBottomSheet({ isVisible, onClose });

  useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
      handleCloseForm();
      onClose();
      Alert.alert("Sucesso", successMessage);
      onSuccess?.(data);
    },
    onError: (error) => {
      Alert.alert("Erro", errorMessage);
      console.error("Erro na operação:", error);
      onError?.(error);
    },
  });

  return (
    <BaseBottomSheet
      isVisible={isVisible}
      onClose={onClose}
      snapPoints={snapPoints}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      style={style}
      onChange={handleSheetChanges}
    >
      {children}
    </BaseBottomSheet>
  );
}

// Hook para usar com FormBottomSheet
export function useFormBottomSheet<TData, TMutationData>(
  mutationFn: (data: TMutationData) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
    queryKey?: string[];
  }
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options?.queryKey) {
        queryClient.invalidateQueries({ queryKey: options.queryKey });
      }
      Alert.alert("Sucesso", options?.successMessage || "Operação realizada com sucesso!");
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      Alert.alert("Erro", options?.errorMessage || "Erro ao realizar operação. Tente novamente.");
      console.error("Erro na operação:", error);
      options?.onError?.(error);
    },
  });

  return mutation;
} 