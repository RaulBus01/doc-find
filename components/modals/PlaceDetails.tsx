import React, { forwardRef, useCallback, useMemo, useImperativeHandle, useState,useEffect } from "react";
import { StyleSheet, BackHandler} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { GooglePlaceDetails } from "@/interface/Interface";


export type PlaceDetailsBottomSheetRef = BottomSheetModal & {
  present: (data: GooglePlaceDetails) => void;
};

interface PlaceDetailsBottomSheetProps {
    index?: number;
   children?: (props: { data: GooglePlaceDetails }) => React.ReactNode;
  ref: React.Ref<PlaceDetailsBottomSheetRef>;

}

const PlaceDetailsBottomSheet = forwardRef<PlaceDetailsBottomSheetRef, PlaceDetailsBottomSheetProps>(
  ({ children,index}, ref) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const snapPoints = useMemo(() => ["56%", "70%"], []);
    
    const [isModalVisible, setModalVisible] = useState(false);
    const [placeData, setPlaceData] = useState<GooglePlaceDetails | null>(null);
    
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: (data: GooglePlaceDetails) => {
        setPlaceData(data);
        bottomSheetRef.current?.present();
      },
      dismiss: () => bottomSheetRef.current?.dismiss(),
      close: () => bottomSheetRef.current?.close(),
      expand: () => bottomSheetRef.current?.expand(),
      collapse: () => bottomSheetRef.current?.collapse(),
      snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    } as PlaceDetailsBottomSheetRef));

    const handleBackPress = useCallback(() => {
      if (isModalVisible) {
        bottomSheetRef.current?.dismiss();
        return true;
      }
      return false;
    }, [isModalVisible]);

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


    return (
     <BottomSheetModal
        index={index}
        ref={bottomSheetRef}
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
         {children && placeData && (
          children({ data: placeData })
        )}
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
    scrollView: {
      padding: 20,
      backgroundColor: theme.background,
    },
  });

PlaceDetailsBottomSheet.displayName = "PlaceDetailsBottomSheet";

export default PlaceDetailsBottomSheet;