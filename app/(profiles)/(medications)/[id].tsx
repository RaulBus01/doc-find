import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Alert,Keyboard, Switch, TouchableOpacity } from "react-native";
import {  Pressable, ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useDatabase } from "@/hooks/useDatabase";
import { profileMedications, medications, Medication } from "@/database/schema";
import { eq, and, like } from "drizzle-orm";
import Animated, { useAnimatedRef, FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons, FontAwesome5, Fontisto } from "@expo/vector-icons";
import CustomInput from "@/components/CustomInput/CustomInput";
import { Toast } from "toastify-react-native";
import { ThemeColors } from "@/constants/Colors";
import { addProfileMedication, deleteMedication, getExistingMedicationsByName, getExistingMedicationsById, getMedicationsSuggestions, getProfileMedications, insertMedication } from "@/utils/LocalDatabase";
import { useTranslation } from "react-i18next";
import { LegendList } from "@legendapp/list";


export default function MedicationScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const drizzleDB = useDatabase();
  const router = useRouter();
  const {t} = useTranslation();

  
  const nameInputRef = React.useRef<TextInput>(null);

  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState<boolean>(false);
  const [profileMedicationsList, setProfileMedicationsList] = useState<any[]>([]);
  const [suggestedMedications, setSuggestedMedications] = useState<Medication[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fetchProfileMedications = async () => {
    try {
      if (!id) {
        Toast.show({
          type: "error",
          text1: t('toast.error'),
          text2: t('medications.error'),
        })
        return;
      }
      
      const result = await getProfileMedications(drizzleDB, parseInt(id as string, 10));
 
      setProfileMedicationsList(result || []);
    } catch (error) {
      setProfileMedicationsList([]);
          Toast.show({
          type: "error",
          text1: t('toast.error'),
          text2: t('medications.error'),
        })
    }
  };
  
  const searchMedications = async (text: string) => {
    try{
    setMedicationName(text);
    
    if (text.length < 2) {
      setSuggestedMedications([]);
      setShowSuggestions(false);
      return;
    }

    const results = await getMedicationsSuggestions(drizzleDB, text);
 
    if (results.length === 0) {
      setShowSuggestions(false);
      return;
    }
    setSuggestedMedications(results);
    setShowSuggestions(results.length > 0);
    }
    catch (error) {
        Toast.show({
          type: "error",
          text1: t('toast.error'),
          text2: t('medications.error'),
        })
      setSuggestedMedications([]);
      setShowSuggestions(false);
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
      Toast.show({
        type: "warn",
        text1: t('toast.warning'),
        text2: t('medications.warning'),
      })
      return;
    }
    
    try {
      // First check if this medication already exists
      const existingMedication =  await getExistingMedicationsByName(drizzleDB, medicationName.trim());
    
      
      let medicationId: number;
      
      if (!existingMedication) {
        // Create new medication if it doesn't exist
        const insertResult =  await insertMedication(drizzleDB, medicationName.trim());
        if (!insertResult) {
          Toast.show({
            type: "error",
            text1: t('toast.error'),
            text2: t('medications.errorAdd'),
          });
          return;
        }
          
        medicationId = insertResult.id;
      } else {
        medicationId = existingMedication.id;
      }
      // Check if user already has this medication
      const existingProfileMed = await getExistingMedicationsById(drizzleDB, parseInt(id as string, 10), medicationId);
        
      if (existingProfileMed) {

        Toast.show({
          type: "warn",
          text1: t('toast.warning'),
          text2: t('medications.warningExists'),
        });
        return;
      }
      // Add medication to profile
      await addProfileMedication(drizzleDB, parseInt(id as string, 10), medicationId, dosage);
 
      Toast.show({
        type: "success",
        text1: t('toast.success'),
        text2: t('medications.successAdd'),
      });
      setMedicationName("");
      setDosage(false);
      fetchProfileMedications();
      
    } catch (error) {
   
      Toast.show({
        type: "error",
        text1: t('toast.error'),
        text2: t('medications.errorAdd'),
      });
    }
  };
  const handleDeleteMedication = (medicationId: number) => async () => {
    try {
     
      const result = await deleteMedication(drizzleDB, parseInt(id as string, 10), medicationId);
      if (!result) {
     
        Toast.show({
          type: "error",
          text1: t('toast.error'),
          text2: t('medications.deleteError'),
        });

        return;
      }

      Toast.show({
        type: "success",
        text1: t('toast.success'),
        text2: t('medications.successDelete'),
      });
      fetchProfileMedications();
    }
    catch (error) {

      Toast.show({
        type: "error",
        text1: t('toast.error'),
        text2: t('medications.deleteError'),
      });
    }
  }

  const styles = getStyles(theme);
  const { bottom, top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
         {/* Header */}
         <View style={[styles.headerContainer, { paddingTop: top }]}>
           <Text style={styles.header}>{t('medications.title')}</Text>
           <Pressable onPress={handleBack} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={theme.textLight ? theme.textLight : theme.text} />
           </Pressable>
         </View>
      
      {/* Medication List */}
  
          <LegendList
            data={profileMedicationsList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item } : {item:any}) => (
              <View style={styles.medicationCard}>
                <View style={styles.medicationIconContainer}>
                  <FontAwesome5 name="prescription-bottle" size={20} color="#fff" />
                </View>
                <View style={styles.medicationDetails}>
                  <Text style={styles.medicationName}>{item.name}</Text>
                  <Text style={styles.medicationDosage}>
                    {item.permanent ? t('medications.dosageText') : t('medications.dosageText2')}
                  </Text>
                </View>
                <Pressable onPress={handleDeleteMedication(item.medicationId)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color="#ff0000" />
                </Pressable>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30, paddingTop: 20,paddingHorizontal: 16 }}
            style={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <FontAwesome5 name="prescription-bottle" size={40} color="#fff" />
                </View>
                <Text style={styles.emptyText}>{t('medications.emptyText')}</Text>
                <Text style={styles.emptySubtext}>{t('medications.addText')}</Text>
              </View>
            }
            />


       
        
        
      
      {/* Add Medication Form */}
      <View style={styles.formContainer}>
        {showSuggestions && (
          <Animated.View 
            entering={FadeIn.duration(200)} 
            exiting={FadeOut.duration(200)}
            style={styles.suggestionsContainer}
          >
            <Text style={styles.suggestionHelpText}>{t('medications.tapToSelect')}</Text>
            {suggestedMedications.map((med:Medication) => {
              return (
                <TouchableOpacity
                  key={med.id}
                  style={styles.suggestionItem}
                  onPress={() => selectMedication(med)}
                >
                  <Text style={styles.suggestionText}>{med?.name}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}
        
        <View style={styles.inputRow}>
          <CustomInput
            placeholder={t('medications.medicationName')}
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
            multiline={false}
          />
        </View>
        
        <View style={styles.dosageRow}>
          <View style={styles.dosageTextContainer}>
            <Fontisto name="drug-pack" size={24} color={theme.text} />
            <Text style={styles.dosageText}>{t('medications.dosageText')} ?</Text>
          </View>
          <Switch
            value={dosage}
            onValueChange={(value) => setDosage(value)}
            trackColor={{ true: theme.progressColor, false: theme.blue }}
            thumbColor={theme.background}
          />
        </View>
        
        <Pressable 
          style={styles.addButton} 
          onPress={handleAddMedication}
          
        >
          <Ionicons name="add" size={22} color={theme.textLight ? theme.textLight : theme.text} />
          <Text style={styles.addButtonText}>{t('medications.addButtonText')}</Text>
        </Pressable>
      </View>
    </View>
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
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: "relative",
    backgroundColor: theme.blue,
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
    textAlign: "center",
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
    borderTopWidth: 0.25,
    borderLeftWidth: 0.25,
    borderRightWidth: 0.25,
    borderColor: theme.separator,
  

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
    backgroundColor: theme.blue,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
 
  },
  addButtonText: {
    color: theme.textLight ? theme.textLight : theme.text,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    marginLeft: 8,
  },
  suggestionsContainer: {
  
    position: "absolute",
    bottom:"120%",
    left: 16,
    right: 16,
    backgroundColor: theme.background,
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