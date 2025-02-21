import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface MediumCardProps {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const MediumCard = ({ text, icon, color, onPress }: MediumCardProps) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.8}
      underlayColor="rgb(242, 250, 169)"
      style={stylesMedium.container}
    >
      <LinearGradient
        style={stylesMedium.gradientContainer}
        colors={[color, Colors.light.textlight]}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Text style={stylesMedium.text}>{text}</Text>
        <Ionicons name={icon as any} size={24} color={Colors.light.text} />
      </LinearGradient>
    </TouchableHighlight>
  );
};

const stylesMedium = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: 130,
    height: 100,
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 5,
  },
  gradientContainer:{
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: 130,
    height: 100,
    borderRadius: 20,
    elevation: 5,
    gap: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Roboto-Medium",
    color: Colors.light.text,
    letterSpacing: 0.3,
  },
});
export default MediumCard;
