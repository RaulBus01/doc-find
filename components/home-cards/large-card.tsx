import {Text, StyleSheet,TouchableHighlight, View } from "react-native";
import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";

interface LargeCardProps {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const LargeCard = ({ text, icon, color,onPress }: LargeCardProps) => {
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
        <FontAwesome5 name={icon.toLowerCase()} size={28} color={theme.text} />
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
    width: 160,
    height: 120,
    borderRadius: 25,
    marginHorizontal: 5,
   
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    height: "100%",

  },
 
  text: {
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: theme.text,
    letterSpacing: 0.3,
    opacity: 0.9,
    lineHeight: 20,
  },
});
export default LargeCard;
