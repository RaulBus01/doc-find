import { BackHandler, StyleSheet, View } from "react-native";
import React, { forwardRef, useCallback, useEffect, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import BottomSheetModalButton from "./BottomSheetModalButton";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";

export type Ref = BottomSheetModal;
interface CustomBottomSheetModalProps {
  index?: number;
  onDelete: () => void;
  onEdit?: () => void;
  type?:"more" | "years",
}

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(
  
  (props, ref) => {
    const { onDelete, onEdit,index } = props;
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
        index={index}
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
          <View style={styles.separator} />
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
const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: theme.background,
    },
    handleIndicator: {
      backgroundColor: theme.progressColor,
    },
    handle: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    separator:{
      width: "90%",
      height: 1,
      backgroundColor: theme.progressColor,
      marginVertical: 10,
      justifyContent: "center",
      alignSelf: "center",
    }
    ,
    content: {
      flex: 1,
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: theme.background,
      paddingBottom: 20,
    },
  });

export default CustomBottomSheetModal;
