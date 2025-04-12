import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { Pressable } from "react-native-gesture-handler";
import { ThemeColors } from "@/constants/Colors";

interface SmallCardProps {
  text: string;
  icon: string;
  color: string;
  onPress: (symptom: string) => void;
}

const SmallCard = ({ text, icon, color, onPress }: SmallCardProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <Pressable
    onPress={() => onPress(text)}

    style={styles.container}
  >
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.text}>{icon}</Text>
  </Pressable>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: 130,
    height: 51,
    borderRadius: 25,
    marginHorizontal: 5,
    
    elevation: 5,
  },
  gradientContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: 130,
    height: 51,
    borderRadius: 25,
    elevation: 5,
    paddingBottom: 5
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: theme.text,
    letterSpacing: 0.3,
  
  },
});
export default SmallCard;
