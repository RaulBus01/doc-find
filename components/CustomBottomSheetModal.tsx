import { BackHandler, StyleSheet } from "react-native";
import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import BottomSheetModalButton from "./BottomSheetModalButton";
import { useTheme } from "@/context/ThemeContext";

export type Ref = BottomSheetModal;
interface CustomBottomSheetModalProps {
  onDelete: () => void;
  onEdit?: () => void;
}

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(
  
  (props, ref) => {
    const { onDelete, onEdit } = props;
    const snapPoints = useMemo(() => ["20%", "25%"], []);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const [isModalVisible, setModalVisible] = React.useState(false);

    const handleBackPress = useCallback(() => {
      if (isModalVisible && ref) {
        (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
        return true; // Prevent default behavior (app exit)
      }
      return false;
    }, [isModalVisible, ref]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          enableTouchThrough={false}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );
    useEffect(() => {
      // Add the event listener for handling back button
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress', 
        handleBackPress
      );
      
      // Clean up function to remove the listener when component unmounts
      return () => backHandler.remove();
    }, [handleBackPress]);
    const handleOnAnimate = useCallback((fromIndex: number, toIndex: number) => {
      setModalVisible(toIndex >= 0);
    }, []);
    return (
      <BottomSheetModal
        index={0}
        ref={ref}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        
        enablePanDownToClose={true}
        keyboardBehavior="interactive"
        handleIndicatorStyle={styles.handleIndicator}
        handleStyle={styles.handle}
        backgroundStyle={styles.container}
        onDismiss={() => setModalVisible(false)}
        onAnimate={handleOnAnimate}
      >
        <BottomSheetView style={styles.content}>
          <BottomSheetModalButton
            title="Delete"
            icon="trash"
            onPress={() => {
              onDelete();
              (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
            }}
          />
          { onEdit &&
          <BottomSheetModalButton
            title="Edit"
            icon="create-outline"
            onPress={() => {
              onEdit();
              (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
            }}
          />
          }
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: theme.tint,
    },
    handleIndicator: {
      backgroundColor: theme.tint,
    },
    handle: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: theme.tint,
      paddingBottom: 20,
    },
  });

export default CustomBottomSheetModal;
