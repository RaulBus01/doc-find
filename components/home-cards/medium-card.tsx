import {Text, StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { Pressable } from "react-native-gesture-handler";
import { ThemeColors } from "@/constants/Colors";


interface MediumCardProps {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const MediumCard = ({ text, icon, color, onPress }: MediumCardProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
    >
     <View style={[styles.cardContainer, {backgroundColor: color}]}>
        <Text style={styles.text}>{text}</Text>
        <Ionicons name={icon as any} size={24} color={theme.text} />
      </View>
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
    height: 100,
    borderRadius: 20,
    marginHorizontal: 5,

  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    height: "100%",
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Roboto-Medium",
    color: theme.text,
    letterSpacing: 0.3,
  },
});
export default MediumCard;
