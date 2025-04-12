import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Alert,Keyboard, Switch } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useDatabase } from "@/hooks/useDatabase";
import { profileMedications, medications } from "@/database/schema";
import { eq, and, like } from "drizzle-orm";
import Animated, { useAnimatedRef, FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons, FontAwesome5, Fontisto } from "@expo/vector-icons";
import CustomInput from "@/components/CustomInput/CustomInput";
import { Toast } from "toastify-react-native";
import { ThemeColors } from "@/constants/Colors";

export default function MedicationScreen() {
  // Keep existing state and functions
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const drizzleDB = useDatabase();
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  const nameInputRef = React.useRef<TextInput>(null);

  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState<boolean>(false);
  const [profileMedicationsList, setProfileMedicationsList] = useState<any[]>([]);
  const [suggestedMedications, setSuggestedMedications] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Keep existing functions
  const fetchProfileMedications = async () => {
    
    const results = await drizzleDB.query.profileMedications.findMany({
      where: eq(profileMedications.profileId, parseInt(id as string, 10)),
      with:{
        medication: true,
      }
    });
    console.log(results[0]);
    setProfileMedicationsList(results);
  };
  
  const searchMedications = async (text: string) => {
    setMedicationName(text);
    
    if (text.length < 2) {
      setSuggestedMedications([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      const results = await drizzleDB
        .select()
        .from(medications)
        .where(like(medications.name, `%${text}%`))
        .limit(3)
        .all();
        
      setSuggestedMedications(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error("Error searching medications:", error);
    }
  };
  
  const selectMedication = (medication: any) => {
    setMedicationName(medication.name);
    setShowSuggestions(false);
    setSuggestedMedications([]);
    setTimeout(() => {
      Keyboard.dismiss();
    }, 100);
  };
  
  useEffect(() => {
    fetchProfileMedications();
  }, []);

  const handleBack = () => {
    router.back();
  };
  
  const handleAddMedication = async () => {
    if (!medicationName.trim()) {
      Toast.warn("Please enter a medication name", "top");
      return;
    }
    
    try {
      // First check if this medication already exists
      const existingMedication = await drizzleDB
        .select()
        .from(medications)
        .where(eq(medications.name, medicationName.trim()))
        .get();
      
      let medicationId: number;
      
      if (!existingMedication) {
        // Create new medication if it doesn't exist
        const insertResult = await drizzleDB
          .insert(medications)
          .values({
            name: medicationName.trim(),
            description: ""
          })
          .returning({ id: medications.id })
          .get();
          
        medicationId = insertResult.id;
      } else {
        medicationId = existingMedication.id;
      }
      
      // Check if user already has this medication
      const existingProfileMed = await drizzleDB
        .select()
        .from(profileMedications)
        .where(
          and(
            eq(profileMedications.profileId, parseInt(id as string, 10)),
            eq(profileMedications.medicationId, medicationId)
          )
        )
        .get();
        
      if (existingProfileMed) {
        Toast.warn("Medication already exists in profile", 'top');
        return;
      }
      
      // Add medication to profile
      await drizzleDB
        .insert(profileMedications)
        .values({
          profileId: parseInt(id as string, 10),
          medicationId: medicationId,
          permanent: dosage ? 1 : 0,
        })
        .execute();
      
      Toast.success("Medication added successfully", "top");
      setMedicationName("");
      setDosage(false);
      fetchProfileMedications();
      
    } catch (error) {
      console.error("Error adding medication:", error);
      Alert.alert("Error", "Failed to add medication");
    }
  };
  const handleDeleteMedication = (medicationId: number) => async () => {
    try {
   
      await drizzleDB
          .delete(profileMedications)
          .where(
            and(
              eq(profileMedications.profileId, parseInt(id as string, 10)),
              eq(profileMedications.medicationId, medicationId)
            )
          )
          .execute();

        

    
      Toast.success("Medication deleted successfully", "top");
      
      fetchProfileMedications();
    }
    catch (error) {
      console.error("Error deleting medication:", error);
      Toast.error("Failed to delete medication", "top");
    }
  }

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Medications</Text>
        <View style={{ width: 30 }} />
      </View>
      
      {/* Medication List */}
      <Animated.ScrollView 
        ref={scrollRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {profileMedicationsList.length > 0 ? (
          profileMedicationsList.map((medication) => (
            <Animated.View 
              entering={FadeIn.duration(500)} 
              key={medication.id} 
              style={styles.medicationCard}
            >
              <View style={styles.medicationIconContainer}>
                <FontAwesome5 name="pills" size={18} color="#fff" />
              </View>
              <View style={styles.medicationDetails}>
                <Text style={styles.medicationName}>{medication.medication.name}</Text>
                <Text style={styles.medicationDosage}>
                  {medication.permanent === 1 ? "Take daily" : "As needed"}
                </Text>
              </View>
              <Pressable style={styles.deleteButton} onPress={handleDeleteMedication(medication.medicationId)}>
                <Ionicons name="trash-outline" size={20} color={theme.text + '80'} />
              </Pressable>
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <FontAwesome5 name="prescription-bottle" size={40} color="#fff" />
            </View>
            <Text style={styles.emptyText}>No medications found</Text>
            <Text style={styles.emptySubtext}>Add medications using the form below</Text>
          </View>
        )}
      </Animated.ScrollView>
      
      {/* Add Medication Form */}
      <View style={styles.formContainer}>
        {showSuggestions && (
          <Animated.View 
            entering={FadeIn.duration(200)} 
            exiting={FadeOut.duration(200)}
            style={styles.suggestionsContainer}
          >
            <Text style={styles.suggestionHelpText}>Tap to select a medication</Text>
            {
              
            suggestedMedications.map((med) => (
              <Pressable
                key={med.id}
                style={styles.suggestionItem}
                onPress={() => selectMedication(med)}
              >
                <Text style={styles.suggestionText}>{med.name}</Text>
              </Pressable>
            ))}
            
          </Animated.View>
        )}
        
        <View style={styles.inputRow}>
          <CustomInput
            placeholder="Medication name"
            value={medicationName}
            onChangeText={searchMedications}
            onInputFocus={() => {
              if (medicationName.length >= 2 && suggestedMedications.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onInputBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            inputRef={nameInputRef}
          />
        </View>
        
        <View style={styles.dosageRow}>
          <View style={styles.dosageTextContainer}>
            <Fontisto name="drug-pack" size={24} color={theme.text} />
            <Text style={styles.dosageText}>Take daily?</Text>
          </View>
          <Switch
            value={dosage}
            onValueChange={(value) => setDosage(value)}
            trackColor={{ false: theme.progressColor, true: theme.blue }}
            thumbColor={theme.background}
          />
        </View>
        
        <Pressable 
          style={styles.addButton} 
          onPress={handleAddMedication}
          
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,

  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 20,
    fontFamily: "Roboto-Bold",
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  medicationCard: {
    flexDirection: "row",
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",

  },
  medicationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.text,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,

  },
  medicationDetails: {
    flex: 1,
  },
  medicationName: {
    color: theme.text,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    marginBottom: 4,
  },
  medicationDosage: {
    color: theme.text,
    fontSize: 14,
    opacity: 0.7,
    fontFamily: "Roboto-Regular",
  },
  deleteButton: {
    padding: 8,
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
    backgroundColor: theme.cardBackground,
    borderTopWidth: 1,
    borderTopColor: theme.separator,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

  },
  inputRow: {
    marginBottom: 16,
  },
  dosageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  dosageTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dosageText: {
    color: theme.text,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginLeft: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.text,
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
  suggestionsContainer: {
  
    position: "absolute",
    bottom:"120%",
    left: 16,
    right: 16,
    backgroundColor: theme.text,
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 8,
    zIndex: 100,
    maxHeight: 200,
 
    borderColor: theme.text,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopColor: theme.text,
    borderTopWidth: 1,

  },
  suggestionText: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    textAlign: "center",
    color: theme.text,
  },
  suggestionHelpText: {
    fontSize: 16,
    color: theme.text + '80',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  }
});