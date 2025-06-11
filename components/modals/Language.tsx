import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetFlashList,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguagePickerProps {
  onLanguageSelect: (languageCode: string) => void;
  currentLanguage: string;
}

const LANGUAGES: Language[] = [
  { code: "en-US", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ro-RO", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt-PT", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
];

const LanguagePicker = forwardRef<BottomSheetModal, LanguagePickerProps>(
  ({ onLanguageSelect, currentLanguage }, ref) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = getStyles(theme);
    const snapPoints = useMemo(() => ["40%", "60%", "80%"], []);

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

    const handleLanguageSelect = (languageCode: string) => {
      onLanguageSelect(languageCode);
      (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
    };

    const renderLanguageItem = useCallback(
      ({ item: language }: { item: Language }) => (
        <TouchableOpacity
          style={[
            styles.languageOption,
            currentLanguage === language.code &&
              styles.selectedLanguageOption,
          ]}
          onPress={() => handleLanguageSelect(language.code)}
        >
          <Text style={styles.flag}>{language.flag}</Text>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageNativeName}>
              {language.nativeName}
            </Text>
          </View>
          {currentLanguage === language.code && (
            <Ionicons
              name="checkmark"
              size={20}
              color={theme.progressColor}
            />
          )}
        </TouchableOpacity>
      ),
        [currentLanguage, handleLanguageSelect, styles, theme]
    );


    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.handleIndicator}
        handleStyle={styles.handle}
        backgroundStyle={styles.container}
      >
     
        <BottomSheetView style={styles.scrollView}>
          <BottomSheetFlashList
            data={LANGUAGES}
            keyExtractor={(item:any) => item.code}
            estimatedItemSize={95}
            renderItem={renderLanguageItem}
            ListHeaderComponent={() => (
              <View style={styles.header}>
                <Text style={styles.title}>
                  {t("selectLanguage")}
                </Text>
              </View>
            )}
          />
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
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    title: {
      fontSize: 18,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      textAlign: "center",
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 20,
    },
    languageOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginVertical: 4,
    },
    selectedLanguageOption: {
      backgroundColor: theme.progressColor + "20",
    },
    flag: {
      fontSize: 24,
      marginRight: 16,
    },
    languageInfo: {
      flex: 1,
    },
    languageName: {
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      color: theme.text,
    },
    languageNativeName: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      marginTop: 2,
    },
  });

export default LanguagePicker;
