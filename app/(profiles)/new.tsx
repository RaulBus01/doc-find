import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"; // Import FontAwesome5
import { useRouter } from "expo-router";
import { HealthIndicatorInput,  ProfileInput } from "@/database/schema";
import { MultiStepForm } from "@/components/CustomMultiStepForm/MultiStepForm";
import { useDatabase } from '@/hooks/useDatabase';
import { useUserData } from "@/context/UserDataContext";
import { ThemeColors } from "@/constants/Colors";
import  {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import { healthIndicatorConfig } from "@/utils/HealthIndicatorInterface"; // Import the config
import { addProfile } from "@/utils/LocalDatabase";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";

const NewProfile = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const handleRoutingBack = () => {
    router.back();
  };
  const {userId} = useUserData();

  const generalSummaryIcons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    "Name:": "text-outline", 
    "Gender:": "person-outline", 
    "Birth Year:": "calendar-outline",
  };
  const drizzleDB = useDatabase();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);


  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    birthYear: -1, 
    smoker: "",
    hypertensive: "",
    diabetic: "",
  });
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
  
  const handleNext = (step: number) => {
    setCurrentStep(step + 1);
  };

  const handleBack = (step: number) => {
    setCurrentStep(step - 1);
  };


  

  const steps = [
    {
      key: "name",
      title: "What is your name?",
      component: (
        <TextInput
          style={styles.textInput}
          value={formData.fullname}
          onChangeText={(text: any) =>
            setFormData((prev: any) => ({ ...prev, fullname: text }))
          }
          placeholder="Enter your name"
          placeholderTextColor={theme.text}
        />
      ),
      validate: () => formData.fullname.length > 0,
    },
    {
      key: "gender",
      title: `${formData.fullname} select your gender`,
      component: (
        <View style={styles.choiceContainer}>
          {["Male", "Female"].map((gender) => (
            <Pressable
              key={gender}
              style={[
                styles.genderButton,
                formData.gender === gender && styles.selectedChoice
              ]}
              onPress={() => {
                setFormData((prev) => ({ ...prev, gender: gender as "" | "Male" | "Female" }));
              }}
            >
              <Text style={[
                styles.genderText,
                formData.gender === gender && styles.selectedGenderText
              ]}>{gender}</Text>
            </Pressable>
          ))}
        </View>
      ),
      validate: () => !!formData.gender,
    },
    {
      key: "birthYear", 
      title: `What year was ${formData.fullname || 'the person'} born?`, // Updated title
      component: (
        <>
          <Pressable style={styles.pickerTrigger} onPress={handlePresentModalPress}>
            <Text style={styles.pickerTriggerText}>
              {formData.birthYear > 0 ? formData.birthYear : "Select birth year"}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.text} />
          </Pressable>
        </>
      ),
      validate: () => formData.birthYear > 0, 
    },
    {key: "smoker",
    title: `Is ${formData.fullname} a smoker?`,
    component: (
      <View style={styles.choiceContainer}>
        {["Yes", "No", "I used to"].map((choice) => (
          <Pressable
            key={choice}
            style={[
              styles.genderButton,
              formData.smoker === choice && [styles.selectedChoice, getChoiceStyle(choice)]
            ]}
            onPress={() => {
              setFormData((prev) => ({ ...prev, smoker: choice as "Yes" | "No" | "I used to" }));
            }}
          >
            <Text style={[
              styles.genderText,
              formData.smoker === choice && styles.selectedGenderText
            ]}>{choice}</Text>
          </Pressable>
        ))}
      </View>
    ),
    validate: () => !!formData.smoker,
    hideNextButton: true,

    },
    {key: "hypertensive",
    title: `Is ${formData.fullname} hypertensive?`,
    component: (
      <View style={styles.choiceContainer}>
        {["Yes", "No","I don't know"].map((choice) => (
          <Pressable
            key={choice}
            style={[
              styles.genderButton,
              formData.hypertensive === choice && [styles.selectedChoice, getChoiceStyle(choice)]
            ]}
            onPress={() => {
              setFormData((prev) => ({ ...prev, hypertensive: choice  as "Yes" | "No" | "I don't know" }));
            }}
          >
            <Text style={[
              styles.genderText,
              formData.hypertensive === choice && styles.selectedGenderText
            ]}>{choice}</Text>
          </Pressable>
        ))}
      </View>
    ),
    validate: () => !!formData.hypertensive,
    hideNextButton: true,

    },
    {key: "diabetic",
    title: `Is ${formData.fullname} diabetic?`,
    component: (
      <View style={styles.choiceContainer}>
        {["Yes", "No","I don't know"].map((choice) => (
            <Pressable
            key={choice}
            style={[
              styles.genderButton,
              formData.diabetic === choice && [styles.selectedChoice, getChoiceStyle(choice)]
            ]}
            onPress={() => {
              setFormData((prev) => ({ ...prev, diabetic: choice as "Yes" | "No" | "I don't know" }));
            }}
            >
            <Text style={[
              styles.genderText,
              formData.diabetic === choice && styles.selectedGenderText
            ]}>{choice}</Text>
            </Pressable>
        ))}
      </View>
    ),
    validate: () => !!formData.diabetic,
    hideNextButton: true,

    },
    {
      key:"finish",
      title: "Profile Summary",
      component: (
        <View style={styles.summaryContainer}>
          {Object.entries({
            "Name:": formData.fullname || 'Not Set',
            "Gender:": formData.gender || 'Not Set',
            "Birth Year:": formData.birthYear > 0 ? formData.birthYear : 'Not Set',
            "Smoker:": formData.smoker || 'Not Set',
            "Hypertensive:": formData.hypertensive || 'Not Set',
            "Diabetic:": formData.diabetic || 'Not Set'
          }).map(([key, value], index, arr) => {
            let iconComponent = null;
            const healthKey = key.replace(':', '').toLowerCase();

            // Check if it's a health indicator key
            if (healthKey in healthIndicatorConfig) {
              const config = healthIndicatorConfig[healthKey as keyof typeof healthIndicatorConfig];
              iconComponent = (
                <FontAwesome5 name={config.icon} size={18} color={theme.text} style={styles.summaryIcon} />
              );
            }
            // Otherwise, check the general icons
            else if (generalSummaryIcons[key]) {
              const iconName = generalSummaryIcons[key];
              iconComponent = (
                <Ionicons name={iconName} size={18} color={theme.text} style={styles.summaryIcon} />
              );
            }
            // Fallback icon if none match
            else {
              iconComponent = (
                <Ionicons name="help-circle-outline" size={18} color={theme.text} style={styles.summaryIcon} />
              );
            }

            return (
              <View
                key={key}
                style={[styles.summaryRow, index === arr.length - 1 && styles.summaryRowLast]}
              >
               
                <View style={styles.summaryLabelContainer}>
                  {iconComponent} 
                  <Text style={styles.summaryTextHeader}>{key}</Text>
                </View>
                <Text style={styles.summaryText}>{value}</Text>
              </View>
            );
          })}
        </View>
      ),
    },
  ];
 const currentYear = new Date().getFullYear();
  const handleComplete = async () => {

    try{
   
      const {diabetic, hypertensive, smoker, birthYear, ...profileData} = formData;
      const age = birthYear > 0 ? currentYear - birthYear : 0; // Calculate age

      const profileToInsert = { ...profileData, age, auth0Id:userId as string} as ProfileInput;
      const healthData = {
        profileId: 0, 
        diabetic: diabetic,
        hypertensive: hypertensive,
        smoker: smoker
      } as HealthIndicatorInput;
      const result = await addProfile(drizzleDB, profileToInsert, healthData);
      if (!result) {
        console.error("Error adding profile to database");
        return;
      }
      router.replace("/(tabs)");
    }catch(error){
      console.error("Error creating profile:",error);
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Text style={styles.header}>Add Profile</Text>
        <Pressable onPress={handleRoutingBack} style={styles.backButton}>
          <Ionicons name="close" size={24} color={theme.textLight ? theme.textLight : theme.text} />
        </Pressable>
      </View>
  
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onComplete={handleComplete}
        onNext={handleNext}
        onBack={handleBack}
      />

    
      <CustomBottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        onSelectYear={(year: number) => {
          setFormData((prev) => ({ ...prev, birthYear: year }));
          bottomSheetModalRef.current?.dismiss();
        }}
        type="years"
        />

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
      justifyContent: 'center', 
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
      justifyContent: 'center', 
      paddingHorizontal: 10, 
      zIndex: 1,
    },

    textInput: {
      height: 55, 
      borderColor: theme.separator,
      borderWidth: 1,
      color: theme.text,
      paddingHorizontal: 15, 
      borderRadius: 12, 
      fontSize: 16,
      fontFamily: 'Roboto-Regular',
      backgroundColor: theme.cardBackground, 
      marginVertical: 10, 
    },

    choiceContainer: {
      flexDirection: "column",
      gap: 12, 
      marginVertical: 10, 
    },
    genderButton: { 
      flexDirection: 'row', 
      justifyContent: 'center',
      alignItems: 'center',

      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12, 
      borderWidth: 1.5, 
      borderColor: theme.separator,
      backgroundColor: theme.cardBackground, 
    },
    genderText: { 
      color: theme.text,
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
    },
    selectedChoice: { 
      backgroundColor: theme.blue, 
      flexDirection: 'row', 
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12, 
      borderWidth: 1.5, 
      borderColor: theme.separator,
    },
    selectedGenderText: { 
      color: theme.text,
      fontFamily: 'Roboto-Bold',
    },

    pickerTrigger: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 55, 
      paddingHorizontal: 15, 
      marginVertical: 10, 
      borderRadius: 12,
      borderWidth: 1, 
      borderColor: theme.separator,
      backgroundColor: theme.cardBackground, 
    },
    pickerTriggerText: {
      fontSize: 16,
      color: theme.text,
      fontFamily: 'Roboto-Regular',
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
   
   
    
  
    summaryContainer: {
      flexDirection: "column",
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      paddingHorizontal: 16, 
      paddingVertical: 8, 
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.separator 
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator 
    },
    summaryRowLast: {
       borderBottomWidth: 0,
    },
    summaryLabelContainer: { 
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10, 
    },
    summaryIcon: { 
      opacity: 0.7,
      width: 20, 
      textAlign: 'center', 
    },
    summaryTextHeader: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      opacity: 0.8,
    },
    summaryText: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Regular",
      textAlign: 'right',
      flexShrink: 1, 
    },
   
  });

export default NewProfile;
