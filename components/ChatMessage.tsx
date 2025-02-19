import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { formatDate } from "@/utils/Date";

interface ChatMessageProps {
  message: string;
  isAI: boolean;
  picture: string;
  createdAt:string;
}

const ChatMessage = ({ message, isAI, picture,createdAt }: ChatMessageProps) => {
  return (
    <View style={ChatCardStyle.cardContainer}>
      <View
        style={
          isAI
            ? ChatCardStyle.avatarContainerBot
            : ChatCardStyle.avatarContainerUser
        }
      >
        {isAI ? (
          <>
            <Text>Bot</Text>
            <Ionicons name="person-circle" size={28} color="black" />
          </>
        ) : (
          <>
            {picture === "icon" ? (
              <Ionicons name="person-circle" size={28} color="black" />
            ) : (
              <Image source={{ uri: picture }} style={ChatCardStyle.avatar} />
            )}
            <Text>{isAI ? "Bot" : "User"}</Text>
          </>
        )}
      </View>
      <View style={ChatCardStyle.messageContainer}>
        <Markdown>{message}</Markdown>
      </View>
      <View style={ChatCardStyle.footer}>
      <Text>{formatDate(createdAt)}</Text>

      </View>
    </View>
  );
};
const ChatCardStyle = StyleSheet.create({
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
    padding:15,
    borderRadius: 20,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#e1e1e1",
  },
  footer:{
    paddingLeft:20
  }
});

export default ChatMessage;
