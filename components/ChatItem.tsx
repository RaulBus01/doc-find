import { useRouter } from "expo-router";
import React from "react";
import { View, Text,StyleSheet, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { formatDate } from "../utils/Date";
import { useTheme } from "@/context/ThemeContext";

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
  const {theme} = useTheme();
  const styles = getStyles(theme);

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
          <Entypo name="dots-three-vertical" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.tint,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: "#000",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: theme.text,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChatItem;
