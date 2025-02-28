import {Text, StyleSheet,TouchableHighlight } from "react-native";
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
         <LinearGradient
           style={styles.gradientContainer}
           colors={[color, theme.textlight]}
           start={[0, 0]}
           end={[1, 1]}
         >
        <Text style={styles.text}>{text}</Text>
        <FontAwesome5 name={icon.toLowerCase()} size={28} color={theme.text} />
       
       </LinearGradient>
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
    color: theme.text,
    letterSpacing: 0.3,
    opacity: 0.9,
    lineHeight: 20,
  },
});
export default LargeCard;
