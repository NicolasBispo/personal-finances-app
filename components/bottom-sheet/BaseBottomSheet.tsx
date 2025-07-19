import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo } from "react";
import { Platform, ViewStyle } from "react-native";

interface BaseBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[];
  backgroundStyle?: ViewStyle;
  handleIndicatorStyle?: ViewStyle;
  style?: ViewStyle;
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  keyboardBehavior?: "interactive" | "extend" | "height";
  keyboardBlurBehavior?: "none" | "restore";
  animateOnMount?: boolean;
  enableDynamicSizing?: boolean;
}

export default function BaseBottomSheet({
  isVisible,
  onClose,
  children,
  snapPoints = ["85%"],
  backgroundStyle = { backgroundColor: "white" },
  handleIndicatorStyle = { backgroundColor: "#E0E0E0" },
  style = { zIndex: 9999, elevation: 9999 },
  enablePanDownToClose = true,
  enableOverDrag = false,
  enableContentPanningGesture = true,
  enableHandlePanningGesture = true,
  keyboardBehavior = Platform.OS === "ios" ? "interactive" : "extend",
  keyboardBlurBehavior = "restore",
  animateOnMount = true,
  enableDynamicSizing = false,
}: BaseBottomSheetProps) {
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

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
      index={isVisible ? 0 : -1}
      snapPoints={memoizedSnapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={enablePanDownToClose}
      enableOverDrag={enableOverDrag}
      enableContentPanningGesture={enableContentPanningGesture}
      enableHandlePanningGesture={enableHandlePanningGesture}
      backdropComponent={renderBackdrop}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
      style={style}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      animateOnMount={animateOnMount}
      enableDynamicSizing={enableDynamicSizing}
    >
      <BottomSheetView style={{ flex: 1, height: '100%' }}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
} 