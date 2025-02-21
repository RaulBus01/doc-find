import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface SmallCardProps {
  text: string;
  icon: string;
  color: string;
  onPress: (symptom: string) => void;
}

const SmallCard = ({ text, icon, color, onPress }: SmallCardProps) => {
  return (
    <TouchableHighlight
    onPress={() => onPress(text)}
    activeOpacity={0.8}
    underlayColor="rgb(242, 250, 169)"
    style={styles.container}
  >
    <LinearGradient
      style={styles.gradientContainer}
      colors={[color, Colors.light.textlight]}
      start={[0, 0]}
      end={[1, 1]}
    >
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.text}>{icon}</Text>
    </LinearGradient>
  </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
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
    color: Colors.light.text,
    letterSpacing: 0.3,
  
  },
});
export default SmallCard;
