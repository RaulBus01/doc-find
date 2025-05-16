import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View, Text, StyleSheet, Pressable, TouchableOpacity, 
  ActivityIndicator, ScrollView, TextInput
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { useDatabase } from "@/hooks/useDatabase";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Ionicons, FontAwesome5, FontAwesome 
} from "@expo/vector-icons";
import { getProfileMedicalHistoryById, updateMedicalHistoryEntry } from "@/utils/LocalDatabase";
import { MedicalHistoryEntryInput } from "@/database/schema";
import CustomInput from "@/components/CustomInput/CustomInput";
import { getStatusColor } from "@/utils/utilsFunctions";
import { Toast } from "toastify-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";

const EditMedicalPage = () => {
  const { id, profileId } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const drizzleDB = useDatabase();
  const [formData, setFormData] = useState<MedicalHistoryEntryInput>({
    id: parseInt(id as string),
    profileId: parseInt(profileId as string),
    condition: "",
    diagnosis_date: "",
    treatment: "",
    notes: "",
    status: "ongoing",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  
  const styles = getStyles(theme);
  const { bottom, top } = useSafeAreaInsets();
  
  const conditionRef = React.useRef<TextInput>(null);
  const treatmentRef = React.useRef<TextInput>(null);
  const notesRef = React.useRef<TextInput>(null);
  
  const handleBack = () => {
    router.back();
  };


    
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);


  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  

  

const [originalData, setOriginalData] = useState<MedicalHistoryEntryInput | null>(null);
  const getMedicalProfile = async () => {
    try {
      setLoading(true);
      const result = await getProfileMedicalHistoryById(drizzleDB, parseInt(id as string));
      if (result && result.length > 0) {
        const medicalHistory = result[0];
        setFormData({
          ...formData,
          condition: medicalHistory.condition,
          diagnosis_date: medicalHistory.diagnosis_date,
          treatment: medicalHistory.treatment,
          notes: medicalHistory.notes,
          status: medicalHistory.status,
        });
        setOriginalData(medicalHistory);
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
      Toast.error("Error loading medical history", "top");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if(!originalData) return false;
    return (
      formData.condition !== originalData.condition ||
      formData.diagnosis_date !== originalData.diagnosis_date ||
      formData.treatment !== originalData.treatment ||
      formData.notes !== originalData.notes ||
      formData.status !== originalData.status
    );
};
    

  useEffect(() => {
    getMedicalProfile();
  }, []);

  const handleSave = async () => {
    if (!formData.condition.trim() || formData.diagnosis_date === "") {
    Toast.error("Please fill in all required fields", "top");
      return;
    }
    
    setSaving(true);
    try {
    

      const result = await updateMedicalHistoryEntry(drizzleDB, formData);
      
      if (!result) {
        Toast.error("Failed to update medical condition", "top");
        return;
      }

      Toast.success("Medical condition updated successfully", "top");
      router.back();
    } catch (error) {
      console.error("Error updating medical history:", error);
      Toast.error("Failed to update medical condition", "top");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.progressColor} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: bottom }]}
        edges={["bottom"]}
    >
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight ? theme.textLight :theme.text} />
        </Pressable>
        <Text style={styles.header}>Edit Medical History</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Condition Details</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputIconWrapper}>
                <View style={styles.iconContainer}>
                  <FontAwesome5
                    name="heartbeat"
                    size={18}
                    color={theme.progressColor}
                  />
                </View>

                <CustomInput
                  placeholder="Medical condition"
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
                  />
                </View>

                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={handlePresentModalPress}
                >
                  <Text style={styles.datePickerText}>
                    {formData.diagnosis_date
                      ? `Diagnosis Year: ${formData.diagnosis_date}`
                      : "Select Diagnosis Year"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Treatment Information</Text>
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
                  placeholder="Treatment (optional)"
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
                  placeholder="Additional notes (optional)"
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
            <Text style={styles.sectionTitle}>Current Status</Text>
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
       
          style={!hasChanges() || saving ? styles.addButtonDisabled : styles.addButton}
          
          onPress={handleSave}
          activeOpacity={0.7}
          
          disabled={saving || !hasChanges()}
        >
          {saving ? (
            <ActivityIndicator color={theme.text} size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={22} color={theme.textLight ? theme.textLight : theme.text} />
              <Text style={styles.addButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
 
         <CustomBottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
      onSelectYear={(year: number) => {
          setFormData((prev) => ({ ...prev, diagnosis_date: year.toString() }));
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
      backgroundColor: theme.background,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
    
    },
    datePickerText: {
      color: theme.text,
      fontSize: 16,
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
      fontFamily: 'Roboto-Regular',
      textAlign: 'center',
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
    addButtonDisabled: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.progressColor,
      borderRadius: 12,
      paddingVertical: 16,
      opacity: 0.5,
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

export default EditMedicalPage;