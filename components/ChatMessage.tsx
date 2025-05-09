import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { MessageType } from "@/interface/Interface";

interface ChatMessageProps {
  id: number;
  name: string;
  message: string;
  isAI: boolean;
  picture: string;
  createdAt: string;
}

const ChatMessage = ({
  id,
  name,
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
            <Text style={{color:theme.text}}>DocAI</Text>
            <Ionicons name="person-circle" size={28} color={theme.text}/>
          </>
        ) : (
          <>
            {picture === "icon" ? (
              <Ionicons name="person-circle" size={28} color={theme.text} />
            ) : (
              <Image source={{ uri: picture }} style={styles.avatar} />
            )}
            <Text style={{color:theme.text}}>{isAI ? "DocAI" : name}</Text>
          </>
        )}
      </View>
      <View style={isAI ? styles.messageContainerAI : styles.messageContainer} >
        <Text style={{color:theme.text}} selectable={true} selectionColor={theme.YellowIconBackground}>{message}</Text>
      </View>
      <View style={styles.footer}>
        {isAI ? (
          id !== MessageType.System && (
          <View style={styles.footerButtons}>
            <Pressable
              
              onPress={handleCopyToClipboard}
            >
              <Ionicons name="copy" size={20} color={theme.text} />
            </Pressable>
            <Pressable >
              <Ionicons name="refresh" size={20} color={theme.text}/>
            </Pressable>
          </View>
          )
        ) : null}
      </View>
    </View>
  );
};
const getStyles = (theme: ThemeColors) => StyleSheet.create({
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
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 20,
  },
  messageContainerAI: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: theme.GreenIconBackground,
    padding: 15,
    borderRadius: 20,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: theme.profileActionBackground,
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

export default React.memo(ChatMessage);
