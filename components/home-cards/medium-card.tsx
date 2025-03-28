import {Text, StyleSheet,TouchableHighlight, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";

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
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.8}
      underlayColor="rgb(242, 250, 169)"
      style={styles.container}
    >
     <View style={[styles.cardContainer, {backgroundColor: color}]}>
        <Text style={styles.text}>{text}</Text>
        <Ionicons name={icon as any} size={24} color={theme.text} />
      </View>
    </TouchableHighlight>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
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
