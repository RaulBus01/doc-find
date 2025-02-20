import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableHighlight,
} from "react-native";

interface CustomButtonProps {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  subLabelStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  icon,
  label,
  subLabel,
  onPress,
  containerStyle,
  labelStyle,
  subLabelStyle,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={containerStyle?.backgroundColor}
      style={[
        styles.button,
      ]}
    >
        <>
        {icon}
        <View style={styles.textContainer}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <Text style={[styles.subLabel, subLabelStyle]}>{subLabel}</Text>
        </View>
        </>
    
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    
  },
  subLabel: {
    fontSize: 12,
    fontFamily: "Roboto-Bold"
  },
});

export default CustomButton;
