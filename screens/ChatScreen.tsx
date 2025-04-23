import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from "react-native";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import MessageBar from "../components/ChatMessageBar";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import BottomSheetModal, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import ChatMessage from "../components/ChatMessage";
import { AIModel, Message, MessageType } from "@/interface/Interface";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useToken } from "@/context/TokenContext";
import {
  addChat,
  addMessage,
  generateChatTitle,
  getLastMessage,
  getMessages,
} from "@/utils/DatabaseAPI";
import { useUserData } from "@/context/UserDataContext";
import { streamModelResponse } from "@/utils/Model";
import { welcomeMessages } from "@/constants/WelcomeMessages";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import { useDatabase } from "@/hooks/useDatabase";
import { getProfiles, getCompleteProfileData } from "@/utils/LocalDatabase";

const ChatScreen = () => {
  let { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const [chatId, _setChatId] = useState(id);
  const chatIdRef = useRef(chatId);
  const randomWelcomeMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  const [messages, setMessages] = useState<Message[]>(
    !id ? [randomWelcomeMessage] : []
  );
  const { token, isLoading, error } = useToken();
  const { userId, picture, name } = useUserData();
  const flatListRef = useRef<FlatList<Message>>(null);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { isTabBarVisible } = useContext(TabBarVisibilityContext);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const profilesBottomSheetRef = useRef<BottomSheetModal>(null);
  const [profiles, setProfiles] = useState<any[]>([]); // TODO: Define a proper type for profiles
  const [useProfileContext, setUseProfileContext] = useState(false);

  function setChatId(id: string) {
    chatIdRef.current = id;
    _setChatId(id);
  }

  useEffect(() => {
    const loadMessages = async () => {
      if (id && token && !isLoading && !error) {
        try {
          const data = await getMessages(token, id);

          setMessages(data);
          // Scroll to bottom after messages are loaded
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } catch (e) {
          console.error("Failed to load messages:", e);
        }
      }
    };
    loadMessages();
  }, [id, token, isLoading, error]);

  const router = useRouter();

  const handleRoute = (path: string) => {
    router.replace(`/${path}`);
  };

  const handleModalPress = () => {
    console.log("Modal pressed");
  };
  const handleMessageSend = async (message: string) => {
    try {
      if (!userId || !token) {
        console.error("Error", userId, token);
        return;
      }
      
      const messageContent = message.trim();
      if (messageContent.length === 0) {
        return; // Ignore empty messages
      }
      let isNewChat = !chatIdRef.current; 
      let newMessageId = MessageType.Human; // Default ID for human messages
      let newMessage: Message = {
        id: newMessageId,
        sessionId: chatIdRef.current || "",
        message: {
          type: "human",
          content: messageContent,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
     
      if (isNewChat) {
        const chat = await addChat(token, messageContent);
        if (chat?.id) {
          setChatId(chat.id);
        }
        setMessages([newMessage]);
      }
      else {
        setMessages((prev) => [...prev, newMessage]);
      }
      
      const aiMessageId = MessageType.AI; // Default ID for AI messages
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          sessionId: chatIdRef.current || "",
          message: {
            type: "ai",
            content: "",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
  
      // First check if we should use profile data
      let contextData = undefined;
      if (useProfileContext && selectedProfileId) {
        // Get complete profile data using our utility function
        const profileData = await getCompleteProfileData(drizzleDB, parseInt(selectedProfileId, 10));
        
        if (profileData) {
            // Format according to your backend expectations
            contextData = {
                age: profileData.age,
                gender: profileData.gender,
                smoker: profileData.healthData?.smoker,
                hypertensive: profileData.healthData?.hypertensive,
                diabetic: profileData.healthData?.diabetic,
                allergies: profileData.allergies?.map(a => a.name) || [],
                medicalHistory: profileData.medicalHistory?.map(m => m.condition) || [],
                medications: profileData.medications?.map(m => m.name) || []
            };
            console.log("Using profile context:", contextData);
        }
      }
  
      let fullResponse = "";
      await streamModelResponse(
        token,
        messageContent,
        (chunk) => {
          fullResponse += chunk.content;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    message: {
                      ...msg.message,
                      content: fullResponse
                    } 
                  } 
                : msg
            )
          );
        },
        parseInt(chatIdRef.current!),
        AIModel.MISTRAL_SMALL,
        contextData,
        
      );

      if(chatIdRef.current) {
        try{
          const updatedMessages = await getLastMessage(token, chatIdRef.current,2);
          if(updatedMessages && updatedMessages.length > 0) {
            setMessages((prev)=>{
          
              const filteredMessages = prev.filter((msg) => {
                return msg.id !== MessageType.AI && msg.id !== MessageType.Human && msg.id !== MessageType.System && msg.sessionId === chatIdRef.current
              });
              const newMessages = updatedMessages.map((msg) => {
                return {
                  ...msg,
                  id: msg.id,
                  sessionId: chatIdRef.current || "",
                  createdAt: msg.createdAt,
                  updatedAt: msg.updatedAt,
                };
              });

              return [...filteredMessages, ...newMessages];

            })
          }
          
        }
        catch(e) {
          console.error("Error fetching last messages:", e);
        }
      }

   
  
      // Only generate title for new chats
      if (isNewChat) {
        const newTitle = await generateChatTitle(token, chatIdRef.current);
        if (newTitle) {
          console.log("New title generated:", newTitle);
        }
      }
  
      Keyboard.dismiss();
    } catch (e) {
      console.error(e);
    }
  };

  const drizzleDB = useDatabase();

  const fetchProfiles = useCallback(async () => {
    if (!userId) return;

    try {
      const profileData = await getProfiles(drizzleDB, userId);
      if (profileData) {
        setProfiles(profileData);
      } else {
        setProfiles([]); 
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  }, [userId]);

  const handleProfileSelect = (profileId: string) => {
    if (!useProfileContext) {
      // If profile context is disabled, don't allow selection
      return;
    }

    if (selectedProfileId === profileId) {
      setSelectedProfileId(null); // Deselect if already selected
    } else {
      console.log("Selected profile ID:", profileId);
      setSelectedProfileId(profileId);
    }
    profilesBottomSheetRef.current?.close();
  };

  const handleMenuPress = useCallback(() => {
    fetchProfiles();
    profilesBottomSheetRef.current?.expand();
  }, [fetchProfiles]);

  const renderProfileItem = ({ item }: { item: any }) => (
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
          {item.gender}, {item.age} years
        </Text>
      </View>
      {/* Move the checkmark outside of profileInfo */}
      {item.id.toString() === selectedProfileId && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={theme.progressColor}
        />
      )}
    </TouchableOpacity>
  );

  const renderChatMessage = useCallback(
    ({ item }: { item: Message }) => (
      <ChatMessage
        id={item.id}
        name={name || "User"}
        picture={picture || "icon"}
        message={item.message?.content || ""}
        isAI={item.message?.type === "ai"}
        createdAt={item.createdAt}
      />
    ),
    [name, picture]
  );

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: bottom }]}>
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <TouchableOpacity
          style={styles.menuiconButton}
          onPress={handleMenuPress}
        >
          <Entypo
            name="menu"
            size={24}
            color={theme.textLight ? theme.textLight : theme.text}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          {useProfileContext && selectedProfileId ? (
            <View style={styles.activeProfileBadge}>
              <Ionicons name="person" size={12} color={theme.textLight} />
              <Text style={styles.activeProfileText}>Profile Active</Text>
            </View>
          ) : (
            <View style={styles.deactivatedProfileBadge}>
              <Ionicons name="person" size={12} color={theme.textLight} />
              <Text style={styles.activeProfileText}>No Profile Active</Text>
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
        <FlatList
          ref={flatListRef}
          style={styles.chatContainer}
          data={messages}
          renderItem={renderChatMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 100 }}
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          initialNumToRender={10}
          
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
        />
      </View>

      <View
        style={[
          styles.footer,
          { bottom: isTabBarVisible ? bottom + 50 : bottom },
        ]}
      >
        {/* Message bar */}
        <MessageBar
          onModalPress={handleModalPress}
          onMessageSend={handleMessageSend}
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
          <Text style={styles.bottomSheetTitle}>Profile Context</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Use profile information</Text>
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
              ? "Choose a profile to personalize your chat"
              : "Enable profile context to personalize your chat"}
          </Text>
        </View>

        {useProfileContext ? (
          <BottomSheetFlatList
            data={profiles}
            keyExtractor={(item) => item.id.toString()}
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
                <Text style={styles.emptyProfilesText}>No profiles found</Text>
                <TouchableOpacity
                  onPress={() => handleRoute("new")}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: theme.progressColor }}>
                    Create a new profile
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : (
          <View style={styles.disabledProfilesContainer}>
            <Text style={styles.disabledProfilesText}>
              Without profile context, the AI will respond based on general
              information only.
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
      // flex: 1,
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
      flex: 1,
      backgroundColor: theme.background,
      marginBottom: 50,
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
      marginRight: 10, // Add some margin to create space between text and checkmark
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
