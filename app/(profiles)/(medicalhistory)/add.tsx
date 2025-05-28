import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import { ThemeColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import CustomInput from "@/components/CustomInput/CustomInput";
import { getStatusColor } from "@/utils/utilsFunctions";
import { medicalHistory, MedicalHistoryEntryInput } from "@/database/schema";
import { Toast } from "toastify-react-native";
import { useDatabase } from "@/hooks/useDatabase";
import { addProfileMedicalHistory } from "@/utils/LocalDatabase";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";
import { useTranslation } from "react-i18next";

const AddMedicalHistoryPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const drizzleDB = useDatabase();
  const {t} = useTranslation();

  const conditionRef = React.useRef<TextInput>(null);
  const treatmentRef = React.useRef<TextInput>(null);
  const notesRef = React.useRef<TextInput>(null);
  const styles = getStyles(theme);
  const handleBack = () => {
    router.back();
  };
  const [formData, setFormData] = React.useState<MedicalHistoryEntryInput>({
    profileId: parseInt(id as string, 10),
    condition: "",
    diagnosis_date: "",
    treatment: "",
    notes: "",
    status: "ongoing",
  });
  const { bottom, top } = useSafeAreaInsets();

  const handleAddMedicalHistory = async () => {
    if (!formData.condition.trim()) {
      Toast.warn(t('medicalHistory.warning'), "top");
      return;
    }

    try {
     
      const result = await addProfileMedicalHistory(drizzleDB, formData);
      if (!result) {
        Toast.error(t('medicalHistory.errorAdd'), "top");
        return;
      }

      Toast.success(t('medicalHistory.errorAdd'), "top");
      setFormData({
        profileId: parseInt(id as string, 10),
        condition: "",
        diagnosis_date: "",
        treatment: "",
        notes: "",
        status: "ongoing",
      });
      router.back();
    } catch (error) {
     
    Toast.error(t('medicalHistory.errorAdd'), "top");
    }
  };


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);


  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);





  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: bottom }]}
      edges={["bottom"]}
    >
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.textLight ? theme.textLight : theme.text}
          />
        </Pressable>
        <Text style={styles.header}>{t('medicalHistory.title')}</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('medicalHistory.conditionDetails')}</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputIconWrapper}>
                <View style={styles.iconContainer}>
                  <FontAwesome5
                    name="heartbeat"
                    size={18}
                    color={theme.progressColor}
                    style={styles.inputIcon}
                  />
                </View>

                <CustomInput
                  placeholder={t('medicalHistory.conditionPlaceholder')}
                  value={formData.condition}
                  onChangeText={(text) =>
                    setFormData({ ...formData, condition: text })
                  }
                  inputRef={conditionRef}
                  multiline={true}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputIconWrapper}>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    name="calendar-plus-o"
                    size={18}
                    color={theme.progressColor}
                    style={styles.inputIcon}
                  />
                </View>

                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={handlePresentModalPress}
                >
                  <Text style={styles.datePickerText}>
                    {formData.diagnosis_date
                      ? `${t('medicalHistory.diagnosisYear')}: ${formData.diagnosis_date}`
                      : t('medicalHistory.selectYear')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('medicalHistory.treatmentDetails')}</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIconWrapper}>
                <View style={styles.iconContainer}>
                  <FontAwesome5
                    name="pills"
                    size={18}
                    color={theme.progressColor}
                  />
                </View>
                <CustomInput
                  placeholder={t('medicalHistory.medicinesDetails')}
                  value={formData.treatment ?? ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, treatment: text })
                  }
                  inputRef={treatmentRef}
                  multiline={true}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputIconWrapper}>
                <View style={styles.iconContainer}>
                  <FontAwesome5
                    name="notes-medical"
                    size={18}
                    color={theme.progressColor}
                  />
                </View>
                <CustomInput
                  placeholder={t('medicalHistory.additionalNotes')}
                  value={formData.notes ?? ""}
                  onChangeText={(text) =>
                    setFormData({ ...formData, notes: text })
                  }
                  inputRef={notesRef}
                  multiline={true}
                />
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('medicalHistory.currentStatus')}</Text>
            <View style={styles.statusOptions}>
              {["Ongoing", "Resolved", "Chronic"].map((statusOption) => {
                const isSelected =
                  formData.status?.toLowerCase() === statusOption.toLowerCase();
                return (
                  <TouchableOpacity
                    key={statusOption}
                    style={[
                      styles.statusOption,
                      isSelected && {
                        backgroundColor: getStatusColor(
                          theme,
                          statusOption.toLowerCase()
                        ),
                      },
                    ]}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        status: statusOption.toLowerCase() as
                          | "ongoing"
                          | "resolved"
                          | "chronic",
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        isSelected && styles.selectedStatusText,
                        isSelected && {
                          color: theme.text,
                        },
                      ]}
                    >
                      {statusOption}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMedicalHistory}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={22}
            color={theme.textLight ? theme.textLight : theme.text}
          />
          <Text style={styles.addButtonText}>{t('medicalHistory.saveButtonText')}</Text>
        </TouchableOpacity>
      </View>

      <CustomBottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
       onSelectYear={(year: number) => {
         setFormData((prev) => ({
        ...prev,
        diagnosis_date: year.toString(),
      }));
          bottomSheetModalRef.current?.dismiss();
        }}
        type="years"
        />

    </SafeAreaView>
  );
};

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: theme.progressColor,
    },
    header: {
      fontSize: 22,
      fontFamily: "Roboto-Bold",
      color: theme.textLight ? theme.textLight : theme.text,
      flex: 1,
      textAlign: "center",
      marginRight: 30,
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    formContainer: {
      padding: 20,
    },
    formSection: {
      marginBottom: 24,
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Roboto-Medium",
      color: theme.text,
      marginBottom: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    inputRow: {
      marginBottom: 16,
      justifyContent: "center",
    },
    inputIconWrapper: {
      flexDirection: "row",
      width: "100%",
    },
    inputIcon: {
      marginRight: 12,
    },
    enhancedInputContainer: {
      flex: 1,
      borderRadius: 12,
      overflow: "hidden",
    },
    enhancedInput: {
      fontSize: 16,
      fontFamily: "Roboto-Regular",
    },
    notesInput: {
      height: 100,
      textAlignVertical: "top",
      paddingTop: 12,
    },
    datePickerButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      justifyContent: "center",
    },
    datePickerText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      justifyContent: "center",
      alignItems: "center",
    },

    statusOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statusOption: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderRadius: 12,
      marginHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      color: theme.text,
      backgroundColor: theme.cardBackground,
    },
    bottomSheetHeader: {
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator,
    },
    bottomSheetTitle: {
      fontSize: 18,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      textAlign: "center",
    },
    bottomSheetContentContainer: {
      backgroundColor: theme.backgroundDark,
      paddingBottom: 20,
    },
    bottomSheetItem: {
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator,
      marginHorizontal: 16,
    },
    bottomSheetItemText: {
      fontSize: 18,
      color: theme.text,
      fontFamily: "Roboto-Regular",
      textAlign: "center",
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusOptionText: {
      fontSize: 14,
      fontFamily: "Roboto-Medium",
      color: theme.textLight || theme.text,
    },
    selectedStatusText: {
      fontFamily: "Roboto-Bold",
    },
    buttonContainer: {
      padding: 16,
      backgroundColor: theme.background,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.progressColor,
      borderRadius: 12,
      paddingVertical: 16,
    },
    addButtonText: {
      color: theme.textLight ? theme.textLight : theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      marginLeft: 10,
    },
    iconContainer: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
      alignSelf: "flex-start",
      marginTop: 8,
    },
  });

export default AddMedicalHistoryPage;
