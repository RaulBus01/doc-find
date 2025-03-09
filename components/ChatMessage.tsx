import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/context/ThemeContext";

interface ChatMessageProps {
  id: string;
  message: string;
  isAI: boolean;
  picture: string;
  createdAt: string;
}

const ChatMessage = ({
  id,
  message,
  isAI,
  picture,
  createdAt,
}: ChatMessageProps) => {

  const {theme} = useTheme();
  const styles = getStyles(theme);

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(message);
  };
  return (
    <View style={styles.cardContainer}>
      <View
        style={
          isAI
            ? styles.avatarContainerBot
            : styles.avatarContainerUser
        }
      >
        {isAI ? (
          <>
            <Text style={{color:theme.text}}>Bot</Text>
            <Ionicons name="person-circle" size={28} color={theme.text}/>
          </>
        ) : (
          <>
            {picture === "icon" ? (
              <Ionicons name="person-circle" size={28} color={theme.text} />
            ) : (
              <Image source={{ uri: picture }} style={styles.avatar} />
            )}
            <Text style={{color:theme.text}}>{isAI ? "Bot" : "User"}</Text>
          </>
        )}
      </View>
      <View style={styles.messageContainer}>
        <Text style={{color:theme.text}}>{message}</Text>
      </View>
      <View style={styles.footer}>
        {isAI ? (
          id !== "welcome" && (
          <View style={styles.footerButtons}>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={handleCopyToClipboard}
            >
              <Ionicons name="copy" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.2}>
              <Ionicons name="refresh" size={20} color={theme.text}/>
            </TouchableOpacity>
          </View>
          )
        ) : null}
      </View>
    </View>
  );
};
const getStyles = (theme: any) => StyleSheet.create({
  avatarContainerUser: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatarContainerBot: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: "column",
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    padding: 10,

    borderRadius: 10,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: theme.tint,
  },
  footer: {
    marginTop: 10,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
});

export default ChatMessage;
