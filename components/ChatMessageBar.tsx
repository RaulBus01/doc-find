import React, { useRef, useContext, useState, useCallback } from "react";
import {
  TextInput,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {MessageBarStyles} from "@/components/ChatMessageBarStyle";
import { useTheme } from "@/context/ThemeContext";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import { useTranslation } from "react-i18next";

type Props = {
  isStreaming?: boolean;
  onModalPress: () => void;
  onMessageSend: (message: string) => void;
  onAbortStream: () => void;
};

const MessageBar = ({isStreaming, onModalPress, onMessageSend,onAbortStream }: Props) => {
  const [message, setMessage] = React.useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { bottom } = useSafeAreaInsets();

  const inputRef = useRef<TextInput>(null);
  const isSendDisabled = !message.trim();
  const { theme } = useTheme();
  const { isTabBarVisible, setIsTabBarVisible } = useContext(
    TabBarVisibilityContext
  );

  const styles = MessageBarStyles(theme, bottom);

  const onInputFocus = useCallback(() => {

    setIsFocused(true);

    setIsTabBarVisible(false);

    if (message.trim().length > 0 && inputRef.current) {

      setTimeout(() => {
        inputRef.current?.measure(() => {
          inputRef.current?.setNativeProps({});
        });
      }, 100);
    }
  }, [message, setIsTabBarVisible]);
    

  



  const onChangeText = (text: string) => {
    setMessage(text);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const {t} = useTranslation();

  const handleSend = () => {
    if (message.trim()) {
      onMessageSend(message);
      setMessage("");
      Keyboard.dismiss();
    }
  };

  const handleClearText = () => {
    setMessage("");
    inputRef.current?.focus();
  }

  const onBlur = useCallback(() => {

          setIsFocused(false);
          setIsTabBarVisible(true);
          setMessage(message.trim());
              }
, [message, setIsTabBarVisible]);

  return (
    <View style={[styles.container]}>
      {/* Message bar that changes size based on focus */}
      <View style={styles.contentView}>
        <TouchableOpacity 
          style={styles.collapsedBar} 
          onPress={focusInput}
          activeOpacity={0.7}
          disabled={isFocused}
        >
          <Ionicons name="chatbubble-outline" size={22} color={theme.text} />
          <TextInput
              ref={inputRef}
              textAlignVertical="center"
              placeholder={t('chat.chatMessageInputPlaceholder')}
              placeholderTextColor={theme.text}
              multiline={isFocused}
              numberOfLines={isFocused ? 10 : 1}
              value={message}
              selectionColor={theme.red}
              onChangeText={onChangeText}
              onFocus={onInputFocus}
              onBlur={onBlur}
              style={[styles.messageInput]}
              editable={true}
              pointerEvents={isFocused ? "auto" : "none"}
            />
            {isFocused && message.trim().length > 0 && (
            <TouchableOpacity onPress={handleClearText} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.text} />
            </TouchableOpacity>
          )}
           {isStreaming ? (
          <TouchableOpacity onPress={onAbortStream} style={styles.iconButton}>
            <Ionicons name="stop-circle-outline" size={24} color={theme.text} />
          </TouchableOpacity>
              ) 
              :   <TouchableOpacity 
              onPress={handleSend} 
              style={[styles.sendButton, isSendDisabled && styles.disabledButton]}
              disabled={isSendDisabled}
            >
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
            }
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageBar;
