import { 
  View, Text, Pressable, StyleSheet, TextInput, 
  ScrollView, TouchableOpacity, ActivityIndicator 
} from "react-native";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { useDatabase } from "@/hooks/useDatabase";
import { ProfileInput } from "@/database/schema";
import { 
  getProfileById, 
  getProfileHealthIndicatorById,
  updateProfile,
  updateHealthIndicator
} from "@/utils/LocalDatabase";
import { Toast } from "toastify-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { 
  getHealthIndicatorLabel, 
  getHealthIndicatorValue,
  healthIndicatorValueKeys,
  getGenderValue,
  genderValueKeys
} from "@/utils/HealthIndicatorInterface";
import YearPickerBottomSheet from "@/components/modals/Years";
import { useAuth } from "@/hooks/useAuth";

const EditProfilePage = () => {
  const { id } = useLocalSearchParams();
  const profileId = id as string;
  const { user} = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const { bottom, top } = useSafeAreaInsets();
  const drizzleDB = useDatabase();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileInput>({} as ProfileInput);
  const [healthData, setHealthData] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    birthYear: -1,
    smoker: "",
    hypertensive: "",
    diabetic: "",
  });
  
  // Original data for comparison
  const [originalData, setOriginalData] = useState({
    fullname: "",
    gender: "",
    birthYear: -1,
    smoker: "",
    hypertensive: "",
    diabetic: "",
  });

  // Bottom sheet for year selection
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  
  const currentYear = new Date().getFullYear();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profile = await getProfileById(drizzleDB, Number(profileId), user?.sub as string);
        if (!profile) {
     
          Toast.show({
            type: "error",
            text1: t('toast.error'),
            text2: t('profileEdit.profileNotFoundText'),
          });
          router.back();
          return;
        }
        setProfileData(profile);

        // Fetch health indicators
        const health = await getProfileHealthIndicatorById(drizzleDB, Number(profileId));
        if (!health) {

          Toast.show({
            type: "error",
            text1:t('toast.error'),
            text2: t('profileEdit.healthDataNotFoundText'),
          });

          router.back();
          return;
        }
        setHealthData(health);
        
        // Calculate birth year from age
        const birthYear = currentYear - profile.age;
        
        const initialData = {
          fullname: profile.fullname,
          gender: profile.gender,
          birthYear: birthYear,
          smoker: health.smoker,
          hypertensive: health.hypertensive,
          diabetic: health.diabetic,
        };
        
        setFormData(initialData);
        setOriginalData(initialData);
      } catch (error) {
      
         Toast.show({
      type: "error",
      text1:t('toast.error'),
      text2: t('profileEdit.errorLoadingProfile')
    });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [profileId]);

  const handleBack = () => {
    router.back();
  };
  
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  
  const {t} = useTranslation();
  
  

  
  const hasChanges = () => {
    return (
      formData.fullname !== originalData.fullname ||
      formData.gender !== originalData.gender ||
      formData.birthYear !== originalData.birthYear ||
      formData.smoker !== originalData.smoker ||
      formData.hypertensive !== originalData.hypertensive ||
      formData.diabetic !== originalData.diabetic
    );
  };
  
  const handleSave = async () => {
    if (!formData.fullname.trim()) {
      Toast.show({
      type: "warn",
      text1:t('toast.warning'),
      text2: t('profileEdit.nameRequired')
    });
      return;
    }
    
    if (!formData.gender) {
      Toast.show({
      type: "warn",
      text1:t('toast.warning'),
      text2: t('profileEdit.genderRequired')
    });
      return;
    }
    
    if (formData.birthYear <= 0) {
      Toast.show({
      type: "warn",
      text1:t('toast.warning'),
      text2: t('profileEdit.birthYearRequired'),
    });
      return;
    }
    
    try {
      setSaving(true);
      
      // Calculate age from birth year
      const age = currentYear - formData.birthYear;
      
      // Update profile data
      const profileResult = await updateProfile(drizzleDB, parseInt(profileId), {
        fullname: formData.fullname,
        gender: formData.gender as "Male" | "Female",
        age
      });
      
      // Update health indicators
      const healthResult = await updateHealthIndicator(drizzleDB, parseInt(profileId), {
        profileId: parseInt(profileId),
        smoker: formData.smoker,
        hypertensive: formData.hypertensive,
        diabetic: formData.diabetic
      });
      
      if (profileResult && healthResult) {
        Toast.show({
        type: "success",
        text1: t('toast.success'),
        text2: t('profileEdit.updatedSuccessfully'),
      });
        router.back();
      } else {
      
       Toast.show({
        type: "error",
        text1: t('toast.error'),
        text2: t('profileEdit.errorUpdatingProfile'),
      });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
       Toast.show({
          type: "error",
          text1:t('toast.error'),
          text2: t('profileEdit.healthDataNotFoundText'),
        });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.blue} />
      </View>
    );
  }
  const getChoiceStyle = (choice: string) => {
    switch (choice) {
      case "Yes":
        return styles.indicatorActive;
      case "No":
        return styles.indicatorNegative;
      case "I don't know":
        return styles.indicatorWarning;
      case "I used to":
        return styles.indicatorWarning;
      default:
        return {};
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: bottom }]}
      edges={["bottom"]}
    >
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight ? theme.textLight : theme.text} />
        </Pressable>
        <Text style={styles.header}>{t('editProfile.headerTitle')}</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Personal Info Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('editProfile.personalTitle')}</Text>
            
            {/* Name Field */}
            <View style={styles.inputRow}>
              <Text style={styles.fieldLabel}>{t('editProfile.nameTitle')}</Text>
              <TextInput
                style={styles.textInput}
                value={formData.fullname}
                onChangeText={(text) => setFormData({...formData, fullname: text})}
                placeholder={t('editProfile.nameTitle')}
                placeholderTextColor={theme.textLight}
              />
            </View>
            
            {/* Gender Selection */}
            <Text style={styles.fieldLabel}>{t('editProfile.genderTitle')}</Text>
            <View style={styles.choiceContainer}>
              {["Male", "Female"].map((englishGender) => {
                const translatedGender = getGenderValue(englishGender as keyof typeof genderValueKeys, t);
                return (
                  <Pressable
                    key={englishGender}
                    style={[
                      styles.choiceButton,
                      formData.gender === englishGender && styles.selectedChoice
                    ]}
                    onPress={() => {
                      setFormData({...formData, gender: englishGender as "Male" | "Female"});
                    }}
                  >
                    <FontAwesome5 
                      name={englishGender === "Male" ? "male" : "female"} 
                      size={16} 
                      color={formData.gender === englishGender ? "#fff" : theme.text} 
                    />
                    <Text style={[
                      styles.choiceText,
                      formData.gender === englishGender && styles.selectedChoiceText
                    ]}>{translatedGender}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Birth Year */}
            <Text style={styles.fieldLabel}>{t('editProfile.birthYear')}</Text>
            <Pressable 
              style={styles.pickerTrigger} 
              onPress={handlePresentModalPress}
            >
              <Text style={styles.pickerTriggerText}>
                {formData.birthYear > 0 ? formData.birthYear : t('editProfile.selectBirthYear')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.text} />
            </Pressable>
          </View>
          
          {/* Health Indicators Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('editProfile.healthIndicatorsTitle')}</Text>
            
            {/* Smoker Status */}
            <Text style={styles.fieldLabel}>{getHealthIndicatorLabel('smoker', t)}</Text>
            <View style={styles.choiceContainer}>
              {["Yes", "No", "I used to"].map((englishChoice) => {
                const translatedChoice = getHealthIndicatorValue(englishChoice as keyof typeof healthIndicatorValueKeys, t);
                return (
                  <Pressable
                    key={englishChoice}
                    style={[
                      styles.choiceButton,
                      formData.smoker === englishChoice && getChoiceStyle(englishChoice)
                    ]}
                    onPress={() => {
                      setFormData({...formData, smoker: englishChoice as "Yes" | "No" | "I used to"});
                    }}
                  >
                    <Text style={[
                      styles.choiceText,
                      formData.smoker === englishChoice && styles.selectedChoiceText
                    ]}>{translatedChoice}</Text>
                  </Pressable>
                );
              })}
            </View>
            
            {/* Hypertension Status */}
            <Text style={styles.fieldLabel}>{getHealthIndicatorLabel('hypertensive', t)}</Text>
            <View style={styles.choiceContainer}>
              {["Yes", "No", "I don't know"].map((englishChoice) => {
                const translatedChoice = getHealthIndicatorValue(englishChoice as keyof typeof healthIndicatorValueKeys, t);
                return (
                  <Pressable
                    key={englishChoice}
                    style={[
                      styles.choiceButton,
                      formData.hypertensive === englishChoice && getChoiceStyle(englishChoice)
                    ]}
                    onPress={() => {
                      setFormData({...formData, hypertensive: englishChoice as "Yes" | "No" | "I don't know"});
                    }}
                  >
                    <Text style={[
                      styles.choiceText,
                      formData.hypertensive === englishChoice && styles.selectedChoiceText
                    ]}>{translatedChoice}</Text>
                  </Pressable>
                );
              })}
            </View>
            
            {/* Diabetes Status */}
            <Text style={styles.fieldLabel}>{getHealthIndicatorLabel('diabetic', t)}</Text>
            <View style={styles.choiceContainer}>
              {["Yes", "No", "I don't know"].map((englishChoice) => {
                const translatedChoice = getHealthIndicatorValue(englishChoice as keyof typeof healthIndicatorValueKeys, t);
                return (
                  <Pressable
                    key={englishChoice}
                    style={[
                      styles.choiceButton,
                      formData.diabetic === englishChoice && getChoiceStyle(englishChoice)
                    ]}
                    onPress={() => {
                      setFormData({...formData, diabetic: englishChoice as "Yes" | "No" | "I don't know"});
                    }}
                  >
                    <Text style={[
                      styles.choiceText,
                      formData.diabetic === englishChoice && styles.selectedChoiceText
                    ]}>{translatedChoice}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!hasChanges() || saving) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasChanges() || saving}
          activeOpacity={0.7}
        >
          {saving ? (
            <ActivityIndicator color={theme.text} size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={22} color={theme.textLight ? theme.textLight : theme.text} />
              <Text style={styles.saveButtonText}>{t('editProfile.saveTitle')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Bottom Sheet for Year Selection */}
      <YearPickerBottomSheet
        ref={bottomSheetModalRef}
        index={1}
        onSelectYear={(year: number) => {
          setFormData((prev) => ({ ...prev, birthYear: year }));
          bottomSheetModalRef.current?.dismiss();
        }}
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
      backgroundColor: theme.blue,
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
      alignItems: "center",
      width: "100%",
    },
    iconContainer: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    textInput: {
      flex: 1,
      height: 50,
      backgroundColor: theme.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: "Roboto-Regular",
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.separator,
    },
    fieldLabel: {
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    choiceContainer: {
      flexDirection: "row",
      marginBottom: 16,
    },
    choiceButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
      height: 48,
      borderRadius: 12,
      marginHorizontal: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: theme.separator,
    },
    choiceText: {
      fontSize: 14,
      fontFamily: "Roboto-Medium",
      color: theme.text,
      marginLeft: 6,
    },
  
    selectedChoiceText: {
      color: theme.text,
      fontFamily: "Roboto-Bold",
    },
    pickerTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
      backgroundColor: theme.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.separator,
    },
    pickerTriggerText: {
      fontSize: 16,
      fontFamily: "Roboto-Regular",
      color: theme.text,
    },
    buttonContainer: {
      padding: 16,
      backgroundColor: theme.background,
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.blue,
      borderRadius: 12,
      paddingVertical: 16,
    },
    saveButtonDisabled: {
      backgroundColor: theme.blue,
      opacity: 0.5,
    },
    saveButtonText: {
      color: theme.textLight ? theme.textLight : theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      marginLeft: 10,
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
    selectedChoice: {
      backgroundColor: theme.blue,
      borderColor: theme.blue,
    },
    indicatorNegative: {
      backgroundColor: theme.GreenIconBackground,
      borderColor: theme.GreenIconBackground,
    },
     indicatorActive: {
      backgroundColor: theme.RedIconBackground,
      borderColor: theme.RedIconBackground,
    },
    indicatorWarning: {
      backgroundColor: theme.YellowIconBackground,
      borderColor: theme.YellowIconBackground,
    },
  });

export default EditProfilePage;