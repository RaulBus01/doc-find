import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { healthIndicators, ProfileInput, profiles } from "@/database/schema";
import { MultiStepForm } from "@/components/CustomMultiStepForm/MultiStepForm";
import { useDatabase } from '@/hooks/useDatabase';


// Reusable Choice Component
const NewProfile = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const handleRoutingBack = () => {
    router.back();
  };

  const drizzleDB = useDatabase();
  const pickerRef = useRef(null);

  const [formData, setFormData] = useState({
    fullname: "",
    gender: "",
    age: -1,
    smoker: "",
    hypertensive: "",
    diabetic: "",
  });

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
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderButton,
                formData.gender === gender && styles.selectedGender
              ]}
              onPress={() => {
                setFormData((prev) => ({ ...prev, gender: gender as "" | "Male" | "Female" }));
              }}
            >
              <Text style={[
                styles.genderText,
                formData.gender === gender && styles.selectedGenderText
              ]}>{gender}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
      validate: () => !!formData.gender,
    },
    {
      key: "age",
      title: `What year was ${formData.fullname} born?`,
      component: (
        <View style={styles.pickerOuterContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              ref={pickerRef}
              selectedValue={formData.age > 0 ? formData.age : undefined}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor={theme.text}
              
              onValueChange={(itemValue) => {
                setFormData(prev => ({
                  ...prev,
                  age: itemValue
                }));
              }}
            >
             
              <Picker.Item label="Select birth year" value={-1}  style={styles.pickerItem}/>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <Picker.Item key={year} label={`${year}`} value={new Date().getFullYear() - year} style={styles.pickerItem} />
              ))}
              
            </Picker>
        
          </View>
        </View>
      ),
      validate: () => formData.age > 0,
    },
    {key: "smoker",
    title: `Is ${formData.fullname} a smoker?`,
    component: (
      <View style={styles.choiceContainer}>
        {["Yes", "No","I used to"].map((choice) => (
          <TouchableOpacity
            key={choice}
            style={[
              styles.genderButton,
              formData.smoker === choice && styles.selectedGender
            ]}
            onPress={() => {
              setFormData((prev) => ({ ...prev, smoker: choice as "Yes" | "No" | "I used to" }));
         
            }}
          >
            <Text style={[
              styles.genderText,
              formData.smoker === choice && styles.selectedGenderText
            ]}>{choice}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            key={choice}
            style={[
              styles.genderButton,
              formData.hypertensive === choice && styles.selectedGender
            ]}
            onPress={() => {
              setFormData((prev) => ({ ...prev, hypertensive: choice  as "Yes" | "No" | "I don't know" }));
    
            }}
          >
            <Text style={[
              styles.genderText,
              formData.hypertensive === choice && styles.selectedGenderText
            ]}>{choice}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity
            key={choice}
            style={[
              styles.genderButton,
              formData.diabetic === choice && styles.selectedGender
            ]}
            onPress={() => {
              setFormData((prev) => ({ ...prev, diabetic: choice as "Yes" | "No" | "I don't know" }));
            }}
          >
            <Text style={[
              styles.genderText,
              formData.diabetic === choice && styles.selectedGenderText
            ]}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    validate: () => !!formData.diabetic,
    hideNextButton: true,

    },
    {key:"finish",
    title: "Profile Summary",
    component: (
      <View style={styles.summaryContainer}>
    
        {Object.entries({
          "Name:": formData.fullname,
          "Gender:": formData.gender,
          "Date of Birth:": formData.age,
          "Smoker:": formData.smoker,
          "Hypertensive:": formData.hypertensive,
          "Diabetic:": formData.diabetic
        }).map(([key, value]) => (
          <View key={key} style={styles.summaryRow}>
            <Text style={styles.summaryTextHeader}>{key}</Text>
            <Text style={styles.summaryText}>{value}</Text>
          </View>
        ))}
        
       
     
        
      </View>
          
      ),

    },


  ];

  const handleComplete = async () => {

    // Handle form submission
   try{
    const {diabetic,hypertensive,smoker,...profileData} = formData;
    
    // Convert age string to a number (timestamp) for database storage

    
    await drizzleDB.transaction(async (tx)=>{
      const newProfile = await tx.insert(profiles).values(profileData).returning({ id: profiles.id }).execute();
      
      const newProfileId = newProfile[0].id;
      await tx.insert(healthIndicators).values({
        profile_id:newProfileId,
        diabetic,
        hypertensive,
        smoker
      }).execute();
    });
    
    console.log("Profile created successfully");
    router.replace("/(tabs)");
  }catch(error){
    console.error("Error creating profile:",error);
  }
  
}


    
  
  return (
    <LinearGradient
      colors={[
        theme.darkbackground,
        theme.mediumbackground,
        theme.background,
        theme.textlight,
      ]}
      locations={[0, 0.35, 0.56, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <LinearGradient
        style={styles.headerContainer}
        colors={[theme.textlight, theme.tint, theme.mediumbackground]}
        locations={[0, 0.44, 0.9]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text style={styles.header}>Add Profile</Text>
        <TouchableOpacity onPress={handleRoutingBack} style={styles.backButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </LinearGradient>
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onComplete={handleComplete}
        onNext={handleNext}
        onBack={handleBack}
      />
    </LinearGradient>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      position: "relative",
    },
    header: {
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      flex: 1,
      textAlign: "center",
    },
    backButton: {
      position: "absolute",
      right: 15,
      zIndex: 1,
      padding: 5,
    },
    choiceContainer: {
      flexDirection: "column",
      gap: 20,
      justifyContent: "space-between",
    },
    textInput: {
      borderColor: theme.text,
      borderBottomWidth: 1,
      color: theme.text,
      padding: 10,
      borderRadius: 8,
      marginBottom: 20,
    },
    genderButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.text,
      alignItems: 'center',
    },
    selectedGender: {
      backgroundColor: theme.tint,
      borderColor: theme.tint,
    },
    genderText: {
      color: theme.text,
      fontSize: 16,
    },
    selectedGenderText: {
      color: theme.background,
      fontWeight: 'bold',
    },
    summaryContainer: {
      flexDirection: "column",
      gap: 20,
      justifyContent: "space-between",
    },
    summaryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    summaryTextHeader: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    summaryText: {
      color: theme.text,
      fontSize: 16,
    },
    yearSelectorContainer: {
      height: 300,
      width: '100%',
    },
    yearScrollView: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.text,
      borderRadius: 8,
    },
    yearScrollContent: {
      paddingVertical: 10,
    },
    yearButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || 'rgba(255,255,255,0.2)',
      alignItems: 'center',
    },
    selectedYear: {
      backgroundColor: theme.tint,
    },
    yearText: {
      color: theme.text,
      fontSize: 16,
    },
    selectedYearText: {
      color: theme.background,
      fontWeight: 'bold',
    },
    pickerOuterContainer: {
      overflow: 'hidden',
      borderBottomWidth: 1,
      borderColor: theme.text,
      marginVertical: 10,
    },
    pickerContainer: {
      width: '100%',
    
      overflow: 'hidden',
      borderRadius: 25, // This may not work on Android
    },
    picker: {
      width: '100%',
      color: theme.text,
      // For Android center alignment
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    pickerItem: {
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.background,
      textAlign: 'center',
      fontFamily: 'Roboto-Regular',
      
    },
  
  });

export default NewProfile;
