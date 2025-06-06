import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Keyboard, Switch, TouchableOpacity } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useDatabase } from "@/hooks/useDatabase";
import { profileAllergies, allergies, Allergy } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomInput from "@/components/CustomInput/CustomInput";
import  { Toast } from "toastify-react-native";
import { ThemeColors } from "@/constants/Colors";
import { getProfileAllergies,getAllergiesSuggestions,deleteAllergy, getExistingAllergiesByName, getExistingAllergiesById, insertAllergy } from "@/utils/LocalDatabase";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";

export default function AllergiesScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const drizzleDB = useDatabase();
  const router = useRouter();
  const {t} = useTranslation();
  
  const nameInputRef = React.useRef<TextInput>(null);

  const [allergyName, setAllergyName] = useState("");
  const [isSevere, setIsSevere] = useState<boolean>(false);
  const [profileAllergiesList, setProfileAllergiesList] = useState<any[]>([]);
  const [suggestedAllergies, setSuggestedAllergies] = useState<Allergy[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fetchProfileAllergies = async () => {
    try {
      if (!id) {
        Toast.error(t('allergies.error'), "top");
        return;
      }
      
      const result = await getProfileAllergies(drizzleDB, parseInt(id as string, 10));
      setProfileAllergiesList(result || []);
    } catch (error) {
      setProfileAllergiesList([]);
        Toast.error(t('allergies.error'), "top");
    }
  };
  
  const searchAllergies = async (text: string) => {
    try {
      setAllergyName(text);
      
      if (text.length < 2) {
        setSuggestedAllergies([]);
        setShowSuggestions(false);
        return;
      }

      const results = await getAllergiesSuggestions(drizzleDB, text);
      
      if (results.length === 0) {
        setShowSuggestions(false);
        return;
      }
      setSuggestedAllergies(results);
      setShowSuggestions(results.length > 0);
    }
    catch (error) {
      Toast.error(t('allergies.error'), "top");
      setSuggestedAllergies([]);
      setShowSuggestions(false);
    }
  };
  
  const selectAllergy = (allergy: any) => {
    setAllergyName(allergy.name);
    setShowSuggestions(false);
    setSuggestedAllergies([]);
    setTimeout(() => {
      Keyboard.dismiss();
    }, 100);
  };
  
  useEffect(() => {
    fetchProfileAllergies();
  }, []);

  const handleBack = () => {
    router.back();
  };
  
  const handleAddAllergy = async () => {
    if (!allergyName.trim()) {
      Toast.warn(t('allergies.warning'), "top");
      return;
    }
    
    try {
      // First check if this allergy already exists
      const existingAllergyName =  await getExistingAllergiesByName(drizzleDB, allergyName.trim());
      
      
      let allergyId: number;
      
      if (!existingAllergyName) {
        // Create new allergy if it doesn't exist
        const insertResult = await insertAllergy(drizzleDB, allergyName.trim());
        if (!insertResult) {
              Toast.error(t('allergies.errorAdd'), "top");
          return;
        }
        allergyId = insertResult.id;
      } else {
        allergyId = existingAllergyName.id;
      }
      
      // Check if user already has this allergy
      const existingProfileAllergy =  await getExistingAllergiesById(drizzleDB, parseInt(id as string, 10), allergyId);
        
      if (existingProfileAllergy) {
        Toast.error(t('allergies.warningExists'), "top");
        return;
      }
      
      // Add allergy to profile
      await drizzleDB
        .insert(profileAllergies)
        .values({
          profileId: parseInt(id as string, 10),
          allergyId: allergyId,
          severity: isSevere ? "severe" : "mild",

        })
        .execute();
      
      Toast.success(t('allergies.successAdd'), "top");
      setAllergyName("");
      setIsSevere(false);
      fetchProfileAllergies();
      
    } catch (error) {
      console.error("Error adding allergy:", error);
      Toast.error(t('allergies.errorAdd'), "top");
    }
  };

  const handleDeleteAllergy = (allergyId: number) => async () => {
    try {
      const result = await deleteAllergy(drizzleDB, parseInt(id as string, 10), allergyId);
      if (!result) {
         Toast.error(t('allergies.deleteError'), "top");
        return;
      }
       Toast.success(t('allergies.successDelete'), "top");
      fetchProfileAllergies();
    }
    catch (error) {
      console.error("Error deleting allergy:", error);
      Toast.error(t('allergies.deleteError'), "top");
    }
  }

  const styles = getStyles(theme);
  const { bottom, top } = useSafeAreaInsets();

  return (
   <View style={[styles.container, { paddingBottom: bottom }]}>
        {/* Header */}
        <View style={[styles.headerContainer, { paddingTop: top }]}>
          <Text style={styles.header}>{t('allergies.title')}</Text>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textLight ? theme.textLight : theme.text} />
          </Pressable>
        </View>
      
      {/* Allergies List */}
      <FlashList
        data={profileAllergiesList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.allergyCard}>
            <View style={[styles.allergyIconContainer, item.severe ? styles.severeIcon : {}]}>
              <MaterialCommunityIcons name="allergy" size={20} color="#fff" />
            </View>
            <View style={styles.allergyDetails}>
              <Text selectable={true} style={styles.allergyName}>{item.name}</Text>
              <Text selectable={true} style={styles.allergySeverity}>
                {item.severe ? "Severe reaction" : "Mild reaction"}
              </Text>
            </View>
            <Pressable onPress={handleDeleteAllergy(item.allergyId)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color={theme.red} />
            </Pressable>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30, paddingTop: 20 }}
        style={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="allergy" size={40} color="#fff" />
            </View>
            <Text style={styles.emptyText}>{t('allergies.emptyText')}</Text>
            <Text style={styles.emptySubtext}>{t('allergies.addText')}</Text>
          </View>
        }
      />
      
      {/* Add Allergy Form */}
      <View style={styles.formContainer}>
        {showSuggestions && (
          <Animated.View 
            entering={FadeIn.duration(200)} 
            exiting={FadeOut.duration(200)}
            style={styles.suggestionsContainer}
          >
            <Text style={styles.suggestionHelpText}>{t('allergies.tapToSelect')}</Text>
            {suggestedAllergies.map((allergy) => (
              <TouchableOpacity
                key={allergy.id}
                style={styles.suggestionItem}
                onPress={() => selectAllergy(allergy)}
              >
                <Text style={styles.suggestionText}>{allergy.name}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
        
        <View style={styles.inputRow}>
          <CustomInput
            placeholder={t('allergies.allergyName')}
            value={allergyName}
            onChangeText={searchAllergies}
            onInputFocus={() => {
              if (allergyName.length >= 2 && suggestedAllergies.length > 0) {
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
        
        <View style={styles.severityRow}>
          <View style={styles.severityTextContainer}>
            <MaterialCommunityIcons name="hospital-box-outline" size={24} color={theme.text} />
            <Text style={styles.severityText}>{t('allergies.severityText')} ?</Text>
          </View>
          <Switch
            value={isSevere}
            onValueChange={(value) => setIsSevere(value)}
            trackColor={{ true: theme.progressColor, false: theme.blue }}
            thumbColor={theme.background}
          />
        </View>
        
        <Pressable 
          style={styles.addButton} 
          onPress={handleAddAllergy}
        >
          <Ionicons name="add" size={22} color={theme.textLight ? theme.textLight : theme.text} />
          <Text style={styles.addButtonText}>{t('allergies.addButtonText')}</Text>
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
    backgroundColor: theme.red,
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
  allergyCard: {
    flexDirection: "row",
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  allergyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.blue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  severeIcon: {
    backgroundColor: "#E53935",  
  },
  allergyDetails: {
    flex: 1,
  },
  allergyName: {
    color: theme.text,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    marginBottom: 4,
  },
  allergySeverity: {
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
     textAlign: "center",
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
  severityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  severityTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  severityText: {
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
    bottom: "120%",
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