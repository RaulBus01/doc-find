import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { formatDate } from "../utils/Date";

interface ChatItemProps {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  handleModal: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  title,
  createdAt,
  updatedAt,
  handleModal,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/${id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      onLongPress={() => handleModal(id)}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{formatDate(updatedAt)}</Text>
        </View>
        <TouchableOpacity onPress={() => handleModal(id)}>
          <Entypo name="dots-three-vertical" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginVertical: 2,
    borderBottomColor: Colors.light.border,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  contentContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChatItem;
