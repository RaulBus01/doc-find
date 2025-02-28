import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ProfileForm } from "@/database/schema";
import { MultiStepForm } from "@/components/CustomMultiStepForm/MultiStepForm";
import RNDateTimePicker from "@react-native-community/datetimepicker";

import { useDatabase } from '@/hooks/useDatabase';
import { profiles } from "@/database/schema";
import { sum } from "drizzle-orm";


const NewProfile = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const handleRoutingBack = () => {
    router.back();
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const displayDatePicker = () => {
    console.log("Displaying date picker");
    setShowDatePicker((prev) => !prev);
  };
  const drizzleDB = useDatabase();

  const [formData, setFormData] = useState<ProfileForm>({
    fullname: "",
    gender: "",
    age: "",
    smoker: "",
    hypertensive: "",
    diabetic: "",
  });
  const handleNext = (step: number) => {
    setCurrentStep(step + 1);
  };
  
  const handleBack = (step: number) => {
    setCurrentStep(step - 1);
    console.log("Went back to step", step - 1);
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
            setFormData((prev) => ({ ...prev, fullname: text }))
          }
          placeholder="Enter your name"
          placeholderTextColor={theme.text}
        />
      ),
      validate: () => formData.fullname.length > 0,
    },
    {
      key: "gender",
      title: "Select your gender",
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
                setTimeout(() => {
                  if (!!gender) handleNext(currentStep);
                }, 100);
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
      hideNextButton: true,
    },
    {
      key: "age",
      title: "Date of Birth",
      component: (
        <View style={styles.choiceContainer}>
          <TouchableOpacity onPress={displayDatePicker}>
    <TextInput
      style={styles.textInput}
      value={formData.age}
      editable={false} 
      placeholder="Select your date of birth"
      pointerEvents="none" 
    />
  </TouchableOpacity>

          {showDatePicker && (
            <RNDateTimePicker
              mode="date"
              display="default"
              value={new Date()}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setFormData((prev) => ({
                    ...prev,
                    age: selectedDate.toDateString(),
                  }));
                  displayDatePicker();
                }
              }}
            />
          )}
        </View>
      ),
    },
    {key: "smoker",
    title: "Are you a smoker?",
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
              setTimeout(() => {
                if (!!choice) handleNext(currentStep);
              }, 100);
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
    title: "Are you diagnosed with hypertension?",
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
              setTimeout(() => {
                if (!!choice) handleNext(currentStep);
              }, 100);
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
    title: "Are you diagnosed with diabetes?",
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
              setTimeout(() => {
                if (!!choice) handleNext(currentStep);
              }, 100);
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
          "Name:": formData.fullname || "Laur",
          "Gender:": formData.gender || "Male",
          "Date of Birth:": formData.age || "12.05.2021",
          "Smoker:": formData.smoker || "Yes",
          "Hypertensive:": formData.hypertensive || "No",
          "Diabetic:": formData.diabetic || "I don't know"
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
  const handleComplete = () => {
    // Handle form submission
    console.log("Form completed:", formData);
    drizzleDB.insert(profiles).values({
      fullname: formData.fullname,
      gender: formData.gender,
      age: formData.age,
      diabetic: formData.diabetic,
      smoker: formData.smoker,
      hypertensive: formData.hypertensive,
      created_at: Date.now(),
      updated_at: Date.now(),
    } as typeof profiles.$inferInsert).execute().then((result) => {
      console.log("Inserted profile", result);
      router.replace("/(tabs)");
    });

    
  };
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

  });

export default NewProfile;
