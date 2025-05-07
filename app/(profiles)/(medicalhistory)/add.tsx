import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import CustomInput from "@/components/CustomInput/CustomInput";
import { getStatusColor } from "@/utils/utilsFunctions";
import {medicalHistory, MedicalHistoryEntryInput } from "@/database/schema";
import { Toast } from "toastify-react-native";
import { useDatabase } from "@/hooks/useDatabase";

const AddMedicalHistoryPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const drizzleDB  = useDatabase();
  
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
    diagnosis_date: new Date().toISOString(),
    treatment: "",
    notes: "",
    status: "ongoing",
  });
  const { bottom, top } = useSafeAreaInsets();
  const handleAddMedicalHistory = async () => {
    if (!formData.condition.trim()) {
      Toast.warn("Please enter a medical condition", "top");
      return;
    }

    try {
      await drizzleDB
        .insert(medicalHistory)
        .values({
          profileId: parseInt(id as string, 10),
          condition: formData.condition.trim(),
          diagnosis_date: formData.diagnosis_date?.toString(),
          treatment: formData.treatment?.trim(),
          notes: formData.notes?.trim(),
          status: formData.status?.toLowerCase() as "ongoing" | "resolved" | "chronic",
        })
        .execute();

      Toast.success("Medical condition added successfully", "top");
      setFormData({
        profileId: parseInt(id as string, 10),
        condition: "",
        diagnosis_date: new Date().toISOString(),
        treatment: "",
        notes: "",
        status: "ongoing",
      });
      router.back();
    } catch (error) {
      console.error("Error adding medical history:", error);
      Toast.error("Failed to add medical condition", "top");
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Text style={styles.header}>Medical History</Text>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.textLight ? theme.textLight : theme.text}
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <CustomInput
            placeholder="Medical condition"
            value={formData.condition}
            onChangeText={(text) => setFormData({ ...formData, condition: text })}
            inputRef={conditionRef}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.datePickerButton} 
          
        >
          <MaterialIcons name="event" size={22} color={theme.text} />
          <Text style={styles.datePickerText}>
            {formData.diagnosis_date}
          </Text>
        </TouchableOpacity>
        
        {/* {showDatePicker && (
          <DateTimePicker
            value={diagnosisDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
         */}
        <View style={styles.inputRow}>
          <CustomInput
            placeholder="Treatment (optional)"
            value={formData.treatment ?? ""}
            onChangeText={(text) => setFormData({ ...formData, treatment: text })}
            inputRef={treatmentRef}
          />
        </View>
        
        <View style={styles.inputRow}>
          <CustomInput
            placeholder="Additional notes (optional)"
            value={formData.notes ?? ""}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            inputRef={notesRef}
            multiline
            numberOfLines={3}
           
          />
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View style={styles.statusOptions}>
            {['Ongoing', 'Resolved', 'Chronic'].map((statusOption) => (
              <TouchableOpacity
                key={statusOption}
                style={[
                  styles.statusOption,
                  { backgroundColor: formData.status?.toLowerCase() === statusOption.toLowerCase() ? 
                    getStatusColor(theme,statusOption.toLowerCase()) : 'transparent' }
                ]}
                onPress={() => setFormData({ ...formData, status: statusOption.toLowerCase() as "ongoing" | "resolved" | "chronic" })}
              >
                <Text style={[
                  styles.statusOptionText,
                  { color: formData.status?.toLowerCase() === statusOption.toLowerCase() ? '#fff' : theme.text }
                ]}>
                  {statusOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <Pressable 
          style={styles.addButton} 
          onPress={handleAddMedicalHistory}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Medical Condition</Text>
        </Pressable>
      </View>
    </View>
  );
};
const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      position: "relative",
      backgroundColor: theme.progressColor,
    },
    header: {
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      color: theme.textLight ? theme.textLight : theme.text,
    },
    backButton: {
      position: "absolute",
      left: 15,
      top: 20,
      bottom: 0,
      justifyContent: "center",
      paddingHorizontal: 10,
      zIndex: 1,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      textAlign: "center",
    },
    historyCard: {
      flexDirection: "row",
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      alignItems: "flex-start",
    },
    historyIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.blue,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      marginTop: 2,
    },
    historyDetails: {
      flex: 1,
    },
    conditionName: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      marginBottom: 4,
    },
    historyMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    historyDate: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.7,
      fontFamily: "Roboto-Regular",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    statusText: {
      color: "#fff",
      fontSize: 12,
      fontFamily: "Roboto-Medium",
      textTransform: "capitalize",
    },
    treatmentText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      marginBottom: 4,
    },
    notesText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      fontStyle: "italic",
    },
    deleteButton: {
      padding: 8,
      marginLeft: 8,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.text,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyText: {
      color: theme.text,
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      marginBottom: 8,
    },
    emptySubtext: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.7,
      textAlign: "center",
      marginHorizontal: 40,
    },
    formContainer: {
      padding: 16,
    },
    inputRow: {
      marginBottom: 16,
    },
    notesInput: {
      height: 80,
      textAlignVertical: "top",
    },
    datePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    datePickerText: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Regular",
      marginLeft: 10,
    },
    statusContainer: {
      marginBottom: 20,
    },
    statusLabel: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      marginBottom: 8,
      marginLeft: 8,
    },
    statusOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    statusOption: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.separator,
    },
    statusOptionText: {
      fontSize: 14,
      fontFamily: "Roboto-Medium",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.blue,
      borderRadius: 12,
      paddingVertical: 14,
      marginTop: 4,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      marginLeft: 8,
    },
    floatingButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: theme.blue,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    formTitle: {
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      marginBottom: 16,
      textAlign: "center",
    },
  });

export default AddMedicalHistoryPage;
