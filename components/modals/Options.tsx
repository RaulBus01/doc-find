import React, { forwardRef, useCallback, useMemo, useState, useEffect } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import BottomSheetModalButton from "../BottomSheetModalButton";

interface OptionsBottomSheetProps {
  index?: number;
  ref?: React.Ref<BottomSheetModal>;
  onDelete?: () => void;
  onEdit?: () => void;
  showEdit?: boolean;
}

const OptionsBottomSheet = forwardRef<BottomSheetModal, OptionsBottomSheetProps>(
  ({ onDelete, onEdit, showEdit = true, index }, ref) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const snapPoints = useMemo(() => ["20%", "25%"], []);
    
 
    const [isModalVisible, setModalVisible] = useState(false);


    const handleBackPress = useCallback(() => {
      if (isModalVisible) {
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        return true;
      }
      return false;
    }, [isModalVisible, ref]);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
      return () => backHandler.remove();
    }, [handleBackPress]);

   
    const handleOnAnimate = useCallback(
      (fromIndex: number, toIndex: number) => {
        setModalVisible(toIndex >= 0);
      },
      []
    );

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

    return (
      <BottomSheetModal
        ref={ref}
        index={index}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.handleIndicator}
        handleStyle={styles.handle}
        backgroundStyle={styles.container}
        onDismiss={() => setModalVisible(false)}
        onAnimate={handleOnAnimate}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.separator} />
          {onDelete && (
            <BottomSheetModalButton
              title="Delete"
              icon="trash"
              onPress={() => {
                onDelete();
                (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
              }}
            />
          )}
       
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    handleIndicator: {
      backgroundColor: theme.progressColor,
    },
    handle: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: theme.background,
      paddingBottom: 20,
    },
    separator: {
      width: "90%",
      height: 1,
      backgroundColor: theme.progressColor,
      marginVertical: 10,
      alignSelf: "center",
    },
  });

export default OptionsBottomSheet;