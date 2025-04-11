import ChatItem from "@/components/ChatItem";
import { useToken } from "@/context/TokenContext";
import { Chat } from "@/interface/Interface";
import { deleteChat, getChats } from "@/utils/DatabaseAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBottomSheetModal, {
  Ref,
} from "../components/CustomBottomSheetModal";
import { useRouter } from "expo-router";
import CustomModal from "@/components/CustomModal";
import { useTheme } from "@/context/ThemeContext";

const ChatHistoryScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const { token, isLoading, error } = useToken();
  const bottomSheetModalRef = useRef<Ref>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (!isLoading && !error && token) {
      getChats(token).then((data) => {
        if (data.length > 0) {
          setChatHistory(data);
        }
      });
    }
  }, [isLoading, error, token]);

  const ListHeader = () => (
    <Text style={styles.contentTitle}>Recent Chats</Text>
  );

  const handlePresentModalPress = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    bottomSheetModalRef.current?.present();
  }, []);


  const handleDeleteChat = useCallback(() => {
    if (!selectedChatId || !token) return;
    setDeleteModalVisible(true);
  }, [selectedChatId, token]);

  const confirmDeleteChat = async () => {
    try {
      if (!selectedChatId || !token) return;
      await deleteChat(token, selectedChatId);
      setChatHistory((prev) => {
        const updatedChats = prev.filter((chat) => chat.id !== selectedChatId);
        if (updatedChats.length === 0) {
          router.replace("/new");
        }
        return updatedChats;
      });
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error("Failed to delete chat:", error);

    } finally {
      setSelectedChatId(null);
      setDeleteModalVisible(false);
    }
  };

  const handleEditChat = useCallback(() => {
    if (selectedChatId) {
      router.push(`/edit/${selectedChatId}`);
      bottomSheetModalRef.current?.dismiss();
    }
  }, [selectedChatId]);

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat History</Text>
      </View>

      <CustomBottomSheetModal
        onDelete={handleDeleteChat}
        onEdit={handleEditChat}
        ref={bottomSheetModalRef}
      />

      {chatHistory.length > 0 ? (
        <FlatList
          data={chatHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem
              id={item.id}
              title={item.title}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              handleModal={() => handlePresentModalPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContentChat}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.listContent}>
          <Text style={{ textAlign: "center", padding: 20, color: theme.text }}>
            No chats found
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => router.push("/new")}
          >
            <Text style={{ color: theme.text }}>Start a new chat</Text>
          </Pressable>
        </View>
      )}

     
      <CustomModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        onCanceled={() => {
          setSelectedChatId(null);
          setDeleteModalVisible(false);
        }}
        onConfirmed={confirmDeleteChat}
        modalTitle="Delete Chat"
        modalMessage="Are you sure you want to delete this chat?"
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.textlight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.tint,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color:theme.text,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 16,
    paddingVertical: 10,
    bottom: 10,
  },
  listContentChat: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  listContent: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.tint,
    paddingVertical: 10,

    margin: 15,
    borderRadius: 20,
    alignItems: "center",
  },
});

export default ChatHistoryScreen;
