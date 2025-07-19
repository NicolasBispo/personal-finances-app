import { useCallback, useEffect, useState } from "react";

interface UseBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export function useBottomSheet({ isVisible, onClose }: UseBottomSheetProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
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

  return {
    isFormOpen,
    handleCloseForm,
    handleSheetChanges,
  };
} 