import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface CustomInputProps {
  inputRef?: React.RefObject<TextInput>;
  onChangeText: (text: string) => void;
  value: string;
  textColor?: string;
  onInputFocus: () => void;
  onInputBlur: () => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  onContentSizeChange?: (event: any) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  inputRef,
  onChangeText,
  value,
  onInputFocus,
  textColor,
  placeholder,
  onInputBlur,
  onContentSizeChange,
}) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    conatiner: {
      height: 50,
    },
    messageInput: {
      flex: 1,
      backgroundColor: theme.background,
      color: textColor ? textColor : theme.text,
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 10,
      maxHeight: 100,
      minWidth: '100%'
    },
  });

  return (
    <View style={styles.conatiner}>
      <TextInput
        ref={inputRef ? inputRef : undefined}
        placeholder={placeholder}
        placeholderTextColor={textColor}
        maxLength={50}
        value={value}
        onChangeText={onChangeText}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        style={styles.messageInput}
      />
    </View>
  );
};

export default CustomInput;
