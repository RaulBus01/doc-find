import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface CustomInputProps {
  inputRef?: React.RefObject<TextInput>;
  onChangeText: (text: string) => void;
  value: string;
  textColor?: string;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputRef,
  onChangeText,
  value,
  onInputFocus,
  textColor,
  placeholder,
  onInputBlur,
  multiline,
}) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    conatiner: {
      minHeight: 50,
      maxWidth: "100%",
      marginBottom: 10,
    
    
    },
    messageInput: {
      flex: 1,
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      marginBottom: 10,
      minHeight: 50,
      minWidth: 250,

    },
    messageInputLength: {
      color: theme.text,
      fontSize: 12,
      paddingHorizontal: 10,
      paddingBottom: 10,
      textAlign: "right",
    },
  });


  return (
    <View style={styles.conatiner}>
      
      <TextInput
        ref={inputRef ? inputRef : undefined}
        placeholder={placeholder}
        placeholderTextColor={theme.text}
        maxLength={100}
        value={value}
        multiline={multiline}
        numberOfLines={4}
        onChangeText={onChangeText}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        style={styles.messageInput}
      />
      <Text style={styles.messageInputLength}>
        {value.length}/100
      </Text>
    </View>
  );
};

export default CustomInput;
