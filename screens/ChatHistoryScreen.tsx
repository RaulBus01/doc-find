import ChatItem from "@/components/ChatItem";
import { useToken } from "@/context/TokenContext";
import { Chat } from "@/interface/Interface";
import { deleteChat, getChats } from "@/utils/DatabaseAPI";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBottomSheetModal, {
  Ref,
} from "../components/CustomBottomSheetModal";
import { useFocusEffect, useRouter } from "expo-router";
import CustomModal from "@/components/CustomModal";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants/Colors";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation();
  const {isTabBarVisible, setIsTabBarVisible} = useContext(TabBarVisibilityContext);

  useFocusEffect(useCallback(() => {
    if(!isTabBarVisible) {
      setIsTabBarVisible(true);
    }
    if (!isLoading && !error && token) {
      getChats(token,10).then((data) => {
        if (data.length > 0) {
          setChatHistory(data);
        }
      });
    }
  }, [isLoading, error, token]));

 
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
      style={[styles.container, {  paddingBottom: bottom }]}
    >
      <View style={[styles.header,{ paddingTop: top }]}>
        <Text style={styles.headerTitle}>{t('chatHistory.chatHistoryTitle')}</Text>
        <TouchableOpacity
          onPress={() => router.replace("/new")}
          style={styles.iconButton}
        >
          <Ionicons name="add" size={24} color={theme.textLight ? theme.textLight : theme.text} />
        </TouchableOpacity>
      </View>

      <CustomBottomSheetModal
        index={1}
        onDelete={handleDeleteChat}
        onEdit={handleEditChat}
        ref={bottomSheetModalRef}
        type="more"
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
            {t('chatHistory.chatHistoryEmptyText')}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/new")}
          >
            <Text style={{ color: theme.text }}>{t('chatHistory.chatStartText')}</Text>
          </TouchableOpacity>
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
        modalTitle={t('chatHistory.chatDeleteText')}
        modalMessage={t('chatHistory.chatDeleteConfirmText')}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.blue,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.textLight ? theme.textLight : theme.text,
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
    backgroundColor: theme.blue,
    paddingVertical: 10,

    margin: 15,
    borderRadius: 20,
    alignItems: "center",
  },
});

export default ChatHistoryScreen;
