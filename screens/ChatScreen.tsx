import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Switch,
} from "react-native";

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MessageBar from "../components/ChatMessageBar";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import BottomSheetModal, { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import ChatMessage from "../components/ChatMessage";
import { Message, MessageType } from "@/interface/Interface";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { addChat, generateChatTitle, getMessages } from "@/utils/DatabaseAPI";

import { streamModelResponse } from "@/utils/Model";
import { getWelcomeMessage } from "@/constants/WelcomeMessages";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import { useDatabase } from "@/hooks/useDatabase";
import { getProfiles, getCompleteProfileData } from "@/utils/LocalDatabase";
import { Toast } from "toastify-react-native";
import { useTranslation } from "react-i18next";
import {
  OfflineIndicator,
  useOfflineStatus,
} from "@/components/OfflineIndicator";

import { useAuth } from "@/hooks/useAuth";
import { getPowerSyncMessages } from "@/powersync/utils";
import { LegendList, LegendListRef } from "@legendapp/list";

const ChatScreen = () => {
  let { id, symptom } = useLocalSearchParams<{ id: string; symptom: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const [chatId, setChatId] = useState(id);
  const chatIdRef = useRef(chatId);

  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>(
    !id ? [getWelcomeMessage(t)] : []
  );
  useEffect(() => {
    if (!id && messages.length > 0 && messages[0].id === MessageType.System) {
      const newWelcomeMessage = getWelcomeMessage(t);
      setMessages([newWelcomeMessage]);
    }
  }, [t, id]);
  const { token, user,refreshTokens } = useAuth();

  const flatListRef = useRef<LegendListRef>(null);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { isTabBarVisible, setIsTabBarVisible } = useContext(
    TabBarVisibilityContext
  );
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const profilesBottomSheetRef = useRef<BottomSheetModal>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [useProfileContext, setUseProfileContext] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isOffline = useOfflineStatus();
  const drizzleDB = useDatabase();

  const { data: powerSyncMessages, isLoading: isPowerSyncLoading } =
    getPowerSyncMessages(chatId || "", { enabled: !!chatId && isOffline });
  const symptomHandledRef = useRef(false);


  const handleAbortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      Toast.show({
        type: "info",
        text1: t("toast.info"),
        text2: t("chat.streamAbortedInfo"),
      });
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, []);

  const router = useRouter();

  const handleRoute = useCallback(
    (path: string) => {
      router.replace(`/${path}`);
    },
    [router]
  );

  const handlePushRoute = useCallback(
    (path: string) => {
      router.push(`/${path}`);
    },
    [router]
  );

  const handleModalPress = useCallback(() => {
    console.log("Modal pressed");
  }, []);

  useEffect(() => {
    const fetchMessagesFromAPI = async () => {
      if (!isOffline && chatId && token) {
        try {
          const apiMessages = await getMessages(token, chatId,refreshTokens);
        
          setMessages(apiMessages);
        } catch (error) {
          
          Toast.show({
            type: "error",
            text1: t("toast.error"),
            text2: t("chat.chatFetchError"),
          });
        }
      }
    };

    fetchMessagesFromAPI();
  }, [isOffline, chatId, token]);

    const displayMessages = useMemo(() => {
    if (isOffline && chatId) {
     
      return powerSyncMessages  ? powerSyncMessages : messages;
    }
    return messages;
  }, [isOffline, chatId, powerSyncMessages, messages]);

  useEffect(() => {
    if (isOffline) {
      return;
    }

    if (symptom && !symptomHandledRef.current) {
      symptomHandledRef.current = true;
      handleMessageSend("I have a symptom: " + symptom);
    }
  }, [symptom,isOffline]);

  const handleMessageSend = useCallback(
    async (message: string) => {
      try {
        if (!user || !user.sub) {
          Toast.show({
            type: "error",
            text1: t("chat.chatAuthErrorText1"),
            text2: t("chat.chatAuthErrorText2"),
          });
          return;
        }
        if (isOffline) {
          Toast.show({
            type: "warn",
            text1: t("chat.chatOfflineErrorText1"),
            text2: t("chat.chatOfflineErrorText2"),
          });

          return;
        }

        if (isStreaming) return;

        const messageContent = message.trim();
        if (messageContent.length === 0) {
          return;
        }

        const currentChatId = chatIdRef.current;
        const isNewChat = !currentChatId;
        let newMessageId = MessageType.Human;
        let newMessage: Message = {
          id: newMessageId,
          chatId: currentChatId || "",
          isAI: false,
          content: messageContent,
        };

        if (isNewChat) {
          const chat = await addChat(token as string,refreshTokens);
          if (chat?.id) {
            chatIdRef.current = chat.id;
            newMessage.chatId = chat.id;
          }
          setMessages([newMessage]);
        } else {
          setMessages((prev) => [...prev, newMessage]);
        }

        const aiMessageId = MessageType.AI;
        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            chatId: chatIdRef.current || "",
            isAI: true,
            content: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);

        let contextData = undefined;
        if (useProfileContext && selectedProfileId) {
          const profileData = await getCompleteProfileData(
            drizzleDB,
            parseInt(selectedProfileId, 10)
          );

          if (profileData) {
            contextData = {
              age: profileData.age,
              gender: profileData.gender,
              smoker: profileData.healthData?.smoker,
              hypertensive: profileData.healthData?.hypertensive,
              diabetic: profileData.healthData?.diabetic,
              allergies: profileData.allergies?.map((a) => a.name) || [],
              medicalHistory:
                profileData.medicalHistory?.map((m) => m.condition) || [],
              medications: profileData.medications?.map((m) => m.name) || [],
            };
          }
        }

        abortControllerRef.current = new AbortController();
        setIsStreaming(true);
        let fullResponse = "";

        try {
          await streamModelResponse(
            token as string,
            messageContent,
            (chunk) => {
              fullResponse += chunk.content;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        content: fullResponse,
                      }
                    : msg
                )
              );
            },
            chatIdRef.current!,
            contextData,
            abortControllerRef.current.signal
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error : new Error(String(error));
          Toast.show({
            type: "error",
            text1: t("chat.chatStreamErrorText1"),
            text2: t("chat.chatStreamErrorText2"),
          });
        } finally {
          setIsStreaming(false);
          abortControllerRef.current = null;
        }

        if (chatIdRef.current) {
          try {
            const updatedMessages = await getMessages(
              token as string,
              chatIdRef.current,
              refreshTokens
            );
            setMessages(updatedMessages);
          } catch (e) {
        
            Toast.show({
              type: "error",
              text1: t("chat.chatFetchError"),
            });
          }
        }

        if (isNewChat) {
          const newTitle = await generateChatTitle(
            token as string,
            chatIdRef.current,
            refreshTokens
          );
        }

        Keyboard.dismiss();
      } catch (e) {
        console.error(e);
      }
    },
    [
      user,
      token,
      isOffline,
      isStreaming,
      useProfileContext,
      selectedProfileId,
      drizzleDB,
      t,
    ]
  );

  const fetchProfiles = useCallback(async () => {
    if (!user?.sub) return;

    try {
      const profileData = await getProfiles(drizzleDB, user.sub);
      if (profileData) {
        setProfiles(profileData);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  }, [user?.sub, drizzleDB]);

  const handleProfileSelect = useCallback(
    (profileId: string) => {
      if (!useProfileContext) {
        return;
      }

      if (selectedProfileId === profileId) {
        setSelectedProfileId(null);
      } else {
        setSelectedProfileId(profileId);
      }
      profilesBottomSheetRef.current?.close();
    },
    [useProfileContext, selectedProfileId]
  );

  const handleMenuPress = useCallback(() => {
    Keyboard.dismiss();
    if (isProfileModalOpen && profilesBottomSheetRef.current) {
      profilesBottomSheetRef.current.close();
      setIsProfileModalOpen(false);
      setIsTabBarVisible(true);
      return;
    }
    setIsProfileModalOpen(true);
    if (isTabBarVisible) {
      setIsTabBarVisible(false);
    }

    fetchProfiles();
    profilesBottomSheetRef.current?.expand();
  }, [fetchProfiles, isProfileModalOpen, isTabBarVisible, setIsTabBarVisible]);

  const renderProfileItem = ({ item }: { item: any }) => {
    console.log("Rendering profile item:", item);
    return (
      <TouchableOpacity
        style={styles.profileItem}
        onPress={() => handleProfileSelect(item.id.toString())}
      >
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={24} color={theme.text} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{item.fullname}</Text>
          <Text style={styles.profileMeta}>
            {item.gender}, {item.age} {t("years")}
          </Text>
        </View>
        {item.id.toString() === selectedProfileId && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={theme.progressColor}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderChatMessage = useCallback(
    ({ item }: { item: Message }) => (
      <ChatMessage
        key={item.id}
        id={item.id}
        name={user?.nickname || "User"}
        picture={user?.picture || ""}
        message={item.content || ""}
        isAI={item.isAI}
      />
    ),
    [user?.nickname, user?.picture]
  );

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: bottom }]}>
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <TouchableOpacity
          style={styles.menuiconButton}
          onPress={handleMenuPress}
        >
          <MaterialCommunityIcons
            name="menu"
            size={24}
            color={theme.textLight ? theme.textLight : theme.text}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t("chat.chatHeaderTitle")}</Text>
          {useProfileContext && selectedProfileId ? (
            <View style={styles.activeProfileBadge}>
              <Ionicons name="person" size={12} color={theme.textLight} />
              <Text style={styles.activeProfileText}>
                {t("chat.chatProfileActiveTitle")}
              </Text>
            </View>
          ) : (
            <View style={styles.deactivatedProfileBadge}>
              <Ionicons name="person" size={12} color={theme.textLight} />
              <Text style={styles.activeProfileText}>
                {t("chat.chatProfileInactiveTitle")}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleRoute("history")}
          >
            <FontAwesome
              name="history"
              size={24}
              color={theme.textLight ? theme.textLight : theme.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            disabled={chatIdRef.current ? false : true}
            onPress={() => handleRoute("new")}
          >
            <Ionicons
              name="add"
              size={24}
              color={
                chatIdRef.current
                  ? theme.textLight
                    ? theme.textLight
                    : theme.text
                  : "#bfb9b1"
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {isOffline && <OfflineIndicator />}
        <LegendList
          ref={flatListRef}
          data={displayMessages}
          renderItem={renderChatMessage}
          keyExtractor={(item) => item.id.toString()}
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.chatContainer}
          ListFooterComponent={<View style={{ height: 120 }} />}
          onContentSizeChange={() => {
            if (
              flatListRef.current &&
              displayMessages &&
              displayMessages.length > 0
            ) {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          }}
        />
      </View>

      <View
        style={[
          styles.footer,
          { bottom: isTabBarVisible ? bottom + 50 : bottom },
        ]}
      >
        <MessageBar
          isStreaming={isStreaming}
          onModalPress={handleModalPress}
          onMessageSend={handleMessageSend}
          onAbortStream={handleAbortStream}
        />
      </View>

      <BottomSheetModal
    ref={profilesBottomSheetRef}
        index={-1}
        snapPoints={["60%"]}
        backgroundStyle={{ backgroundColor: theme.backgroundDark }}
        handleIndicatorStyle={{ backgroundColor: theme.blue }}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
      >
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>
            {t("chat.chatContextTitle")}
          </Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {t("chat.chatContextSubTitle")}
            </Text>
            <Switch
              value={useProfileContext}
              onValueChange={(value) => {
                setUseProfileContext(value);
                if (!value) setSelectedProfileId(null);
              }}
              trackColor={{ false: theme.separator, true: theme.progressColor }}
              thumbColor={theme.backgroundDark}
            />
          </View>
          <Text style={styles.bottomSheetSubtitle}>
            {useProfileContext
              ? t("chat.chatContextSubTitle2")
              : t("chat.chatContextSubTitle1")}
          </Text>
        </View>

        {useProfileContext ? (
          <BottomSheetFlashList
            data={profiles}
            keyExtractor={(item:any) => item.id.toString()}
            renderItem={renderProfileItem}
            contentContainerStyle={styles.profilesList}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.emptyProfilesText}>
                  {t("chat.chatNoProfileText")}
                </Text>
                <TouchableOpacity
                  onPress={() => handlePushRoute("(profiles)/new")}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: theme.progressColor }}>
                    {t("chat.chatCreateText")}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : (
          <View style={styles.disabledProfilesContainer}>
            <Text style={styles.disabledProfilesText}>
              {t("chat.chatContextDisabledText")}
            </Text>
          </View>
        )}
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.blue,
      paddingVertical: 12,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      backgroundColor: "transparent",
    },
    headerTitle: {
      color: theme.textLight ? theme.textLight : theme.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
      position: "absolute",
      right: 10,
      bottom: 20,
    },
    menuiconButton: {
      color: theme.text,
      padding: 8,
      position: "absolute",
      left: 16,
      bottom: 20,
    },
    iconButton: {
      color: theme.text,
      padding: 8,
    },
    headerTitleContainer: {
      alignItems: "center",
    },
    deactivatedProfileBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.text,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginTop: 4,
    },
    activeProfileBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.progressColor,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginTop: 4,
    },
    activeProfileText: {
      color: theme.textLight,
      fontSize: 10,
      marginLeft: 4,
    },
    recentChat: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    date: {
      fontSize: 12,
      color: theme.background,
    },
    content: {
      flex: 1,
      backgroundColor: theme.background,
    },
    chatContainer: {
      backgroundColor: theme.background,
    },
    bottomSheetHeader: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 0.2,
      borderBottomColor: theme.separator,
    },
    bottomSheetTitle: {
      fontSize: 18,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      marginBottom: 4,
    },
    bottomSheetSubtitle: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
    },
    profilesList: {
      padding: 16,
    },
    profileItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 0.2,
      borderBottomColor: theme.separator,
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.cardBackground,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    profileInfo: {
      flex: 1,
      marginRight: 10,
    },
    profileName: {
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      color: theme.text,
    },
    profileMeta: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
    },
    emptyProfilesText: {
      textAlign: "center",
      padding: 20,
      color: theme.text,
      opacity: 0.7,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
      marginBottom: 15,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.text,
    },
    disabledProfilesContainer: {
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    disabledProfilesText: {
      textAlign: "center",
      color: theme.text,
      opacity: 0.7,
      fontSize: 16,
      lineHeight: 24,
    },
  });

export default ChatScreen;
