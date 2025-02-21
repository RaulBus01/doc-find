import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface LargeCardProps {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const LargeCard = ({ text, icon, color,onPress }: LargeCardProps) => {
  return (
    <TouchableHighlight
         onPress={onPress}
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
        <Ionicons name={icon as any} size={24} color={Colors.light.text} />
       
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
    width: 190,
    height: 160,
    borderRadius: 25,
    marginHorizontal: 5,
    elevation: 5,
  },
  gradientContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: 190,
    height: 160,
    borderRadius: 25,
    gap: 10,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: Colors.light.text,
    letterSpacing: 0.3,
    opacity: 0.9,
    lineHeight: 20,
  },
});
export default LargeCard;
