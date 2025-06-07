import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons} from "@expo/vector-icons"; 
import { useRouter } from "expo-router";
import { HealthIndicatorInput,  ProfileInput } from "@/database/schema";
import { MultiStepForm } from "@/components/CustomMultiStepForm/MultiStepForm";
import { useDatabase } from '@/hooks/useDatabase';

import { ThemeColors } from "@/constants/Colors";
import  {
  BottomSheetModal,

} from '@gorhom/bottom-sheet';

import { addProfile } from "@/utils/LocalDatabase";

import { useTranslation } from "react-i18next";
import { getHealthIndicatorValue,getGenderValue,  genderValueKeys } from '@/utils/HealthIndicatorInterface'; 
import YearPickerBottomSheet from "@/components/modals/Years";
import { useAuth } from "@/hooks/useAuth";

const NewProfile = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const handleRoutingBack = () => {
    router.back();
  };
  const {user } = useAuth();


  const drizzleDB = useDatabase();
  const {t} = useTranslation();

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
      title: `${t('profileNew.profileNameTitle')}`,
      component: (
        <TextInput
          style={styles.textInput}
          value={formData.fullname}
          onChangeText={(text: any) =>
            setFormData((prev: any) => ({ ...prev, fullname: text }))
          }
          placeholder={t('profileNew.profileNamePlaceholder')}
          placeholderTextColor={theme.text}
        />
      ),
      validate: () => formData.fullname.length > 0,
    },
    {
      key: "gender",
      title: `${t('profileNew.profileGenderPlaceholder')}`,
      component: (
        <View style={styles.choiceContainer}>
          {['Male', 'Female'].map((englishGender) => {
            const translatedGender = getGenderValue(englishGender as keyof typeof genderValueKeys, t);
            return (
              <Pressable
                key={englishGender}
                style={[
                  styles.genderButton,
                  formData.gender === englishGender && styles.selectedChoice
                ]}
                onPress={() => {
                  setFormData((prev) => ({ ...prev, gender: englishGender as "" | "Male" | "Female" }));
                }}
              >
                <Text style={[
                  styles.genderText,
                  formData.gender === englishGender && styles.selectedGenderText
                ]}>{translatedGender}</Text>
              </Pressable>
            );
          })}
        </View>
      ),
      validate: () => !!formData.gender,
    },
    {
      key: "birthYear", 
      title: `${t('profileNew.profileBirthYearTitle')}`, 
      component: (
        <>
          <Pressable style={styles.pickerTrigger} onPress={handlePresentModalPress}>
            <Text style={styles.pickerTriggerText}>
              {formData.birthYear > 0 ? formData.birthYear : t('profileNew.profileAgePlaceholder')}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.text} />
          </Pressable>
        </>
      ),
      validate: () => formData.birthYear > 0, 
    },
    {
      key: "smoker",
      title: `${formData.fullname} ${t('profileNew.profileSmokerTitle')} ?`,
      component: (
        <View style={styles.choiceContainer}>
          {['Yes', 'No', 'I used to'].map((englishChoice) => {
            const translatedChoice = getHealthIndicatorValue(englishChoice as any, t);
            return (
              <Pressable
                key={englishChoice}
                style={[
                  styles.genderButton,
                  formData.smoker === englishChoice && [styles.selectedChoice, getChoiceStyle(englishChoice)]
                ]}
                onPress={() => {
                  setFormData((prev) => ({ ...prev, smoker: englishChoice }));
                }}
              >
                <Text style={[
                  styles.genderText,
                  formData.smoker === englishChoice && styles.selectedGenderText
                ]}>{translatedChoice}</Text>
              </Pressable>
            );
          })}
        </View>
      ),
      validate: () => !!formData.smoker,
      hideNextButton: true,
    },
    {
      key: "hypertensive",
      title: `${formData.fullname} ${t('profileNew.profileHypertensionTitle')} ?`,
      component: (
        <View style={styles.choiceContainer}>
          {['Yes', 'No', 'I don\'t know'].map((englishChoice) => {
            const translatedChoice = getHealthIndicatorValue(englishChoice as any, t);
            return (
              <Pressable
                key={englishChoice}
                style={[
                  styles.genderButton,
                  formData.hypertensive === englishChoice && [styles.selectedChoice, getChoiceStyle(englishChoice)]
                ]}
                onPress={() => {
                  setFormData((prev) => ({ ...prev, hypertensive: englishChoice }));
                }}
              >
                <Text style={[
                  styles.genderText,
                  formData.hypertensive === englishChoice && styles.selectedGenderText
                ]}>{translatedChoice}</Text>
              </Pressable>
            );
          })}
        </View>
      ),
      validate: () => !!formData.hypertensive,
      hideNextButton: true,
    },
    {
      key: "diabetic",
      title: `${formData.fullname} ${t('profileNew.profileDiabetesTitle')} ?`,
      component: (
        <View style={styles.choiceContainer}>
          {['Yes', 'No', 'I don\'t know'].map((englishChoice) => {
            const translatedChoice = getHealthIndicatorValue(englishChoice as any, t);
            return (
              <Pressable
                key={englishChoice}
                style={[
                  styles.genderButton,
                  formData.diabetic === englishChoice && [styles.selectedChoice, getChoiceStyle(englishChoice)]
                ]}
                onPress={() => {
                  setFormData((prev) => ({ ...prev, diabetic: englishChoice }));
                }}
              >
                <Text style={[
                  styles.genderText,
                  formData.diabetic === englishChoice && styles.selectedGenderText
                ]}>{translatedChoice}</Text>
              </Pressable>
            );
          })}
        </View>
      ),
      validate: () => !!formData.diabetic,
      hideNextButton: true,
    },
    {
      key: "finish",
      title: `${t('profileNew.profileSummaryTitle')}`,
      component: (
        <View style={styles.summaryContainer}>
          {Object.entries({
            [t('profileNew.profileSummaryName')]: formData.fullname || 'Not Set',
            [t('profileNew.profileSummaryGender')]: formData.gender ? getGenderValue(formData.gender as keyof typeof genderValueKeys, t) : 'Not Set',
            [t('profileNew.profileSummaryBirthYear')]: formData.birthYear > 0 ? formData.birthYear : 'Not Set',
            [t('profileNew.profileSummarySmoker')]: formData.smoker ? getHealthIndicatorValue(formData.smoker as any, t) : 'Not Set',
            [t('profileNew.profileSummaryHypertension')]: formData.hypertensive ? getHealthIndicatorValue(formData.hypertensive as any, t) : 'Not Set',
            [t('profileNew.profileSummaryDiabetes')]: formData.diabetic ? getHealthIndicatorValue(formData.diabetic as any, t) : 'Not Set'
          }).map(([key, value], index, arr) => {
        
            return (
              <View
                key={key}
                style={[styles.summaryRow, index === arr.length - 1 && styles.summaryRowLast]}
              >
               
                <View style={styles.summaryLabelContainer}>
                 
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
      const age = birthYear > 0 ? currentYear - birthYear : 0; 

      const profileToInsert = { ...profileData, age, auth0Id:user?.sub as string} as ProfileInput;
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
        <Text style={styles.header}>{t('profileNew.profileHeaderTitle')}</Text>
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

    
      <YearPickerBottomSheet
        ref={bottomSheetModalRef}
        index={1}
        onSelectYear={(year: number) => {
          setFormData((prev) => ({ ...prev, birthYear: year }));
          bottomSheetModalRef.current?.dismiss();
        }}
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
