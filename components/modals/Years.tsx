import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

interface YearPickerProps {
    index?: number;
    ref?: React.Ref<BottomSheetModal>;
  onSelectYear: (year: number) => void;
}

const YearPickerBottomSheet = forwardRef<BottomSheetModal, YearPickerProps>(
  ({ onSelectYear }, ref) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const snapPoints = useMemo(() => ["50%", "80%"], []);
    const {t} = useTranslation();
    const currentYear = new Date().getFullYear();
    const years = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => currentYear - i);
    }, [currentYear]);

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

    const renderYearItem = useCallback(
      ({ item }: { item: number }) => (
        <TouchableOpacity
          style={styles.yearItem}
          onPress={() => {
            onSelectYear(item);
            (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
          }}
        >
          <Text style={styles.yearText}>{item}</Text>
        </TouchableOpacity>
      ),
      [onSelectYear, styles, ref]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.handleIndicator}
        handleStyle={styles.handle}
        backgroundStyle={styles.container}
      >
        <BottomSheetFlashList
          data={years}
          keyExtractor={(item:any) => item.toString()}
          renderItem={renderYearItem}
          estimatedItemSize={67}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.title}>{t("medicalHistory.selectYear")}</Text>
              <FontAwesome name="calendar" size={24} color={theme.text} />
            </View>
          )}
        />
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator,
    },
    title: {
      fontSize: 18,
      fontFamily: "Roboto-Bold",
      color: theme.text,
    },
    contentContainer: {
      backgroundColor: theme.background,
      paddingBottom: 20,
    },
    yearItem: {
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator,
      marginHorizontal: 16,
    },
    yearText: {
      fontSize: 18,
      color: theme.text,
      fontFamily: "Roboto-Regular",
      textAlign: "center",
    },
  });

export default YearPickerBottomSheet;