import { View, Text, SafeAreaView, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import MessageBar from '../components/ChatMessageBar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import ChatMessage from '../components/ChatMessage';
import { Message } from '@/interface/Interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useToken } from '@/context/TokenContext';
import { addChat, addMessage, getMessages } from '@/utils/Database';
import { useUserData } from '@/context/UserDataContext';
import { streamModelResponse } from '@/utils/Model';
import { welcomeMessages } from '@/constants/WelcomeMessages';
import { useTheme } from '@/context/ThemeContext';


const ChatScreen = () => {

  let { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const [chatId, _setChatId] = useState(id);
  const chatIdRef = useRef(chatId);
  const randomWelcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  const [messages, setMessages] = useState<Message[]>(!id ? [randomWelcomeMessage] : []);
  const { token, isLoading, error } = useToken();
  const { userId,picture } = useUserData();
  const flatListRef = useRef<FlatList<Message>>(null);
  const { theme } = useTheme();
  const styles = getStyles(theme);


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
          console.error('Failed to load messages:', e);
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
    console.log('Modal pressed');

  };
  const handleMessageSend = async (message: string) => {
    try {

      if(!userId || !token)
      {
  
        throw new Error('Chat id, user id or token not found');
      }
      const messageContent = message.trim();
      if (chatIdRef.current){        
        const newMessage : Message = {
          id: '',
          content: messageContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
          chatId: chatIdRef.current,
          isAI: false,
        };
        const savedMessage = await addMessage(chatIdRef.current, token, {
          message: newMessage.content,
          isAI: false,
        });

        setMessages([...messages, savedMessage]);
       
      }
      else
      {
        const newMessage : Message = {
          id: '',
          content: messageContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
          chatId: chatIdRef.current,
          isAI: false,
        };

        const chat = await addChat(token, newMessage.content);
        if (chat?.id) {
          setChatId(chat.id);
          setMessages([newMessage]);
        }


      }
      const aiMessageId = `temp-${Date.now()}`;
      setMessages(prev => [...prev, {
          id: aiMessageId,
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'ai',
          chatId: chatIdRef.current!,
          isAI: true,
      }]);
      let fullResponse = '';
      await streamModelResponse(token, message, (chunk) => {
          fullResponse += chunk.content;
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
                ? { ...msg, content: fullResponse }
                : msg
        ));
      });
      const savedAIMessage = await addMessage(chatIdRef.current, token, {
        message: fullResponse,
        isAI: true,
      });
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? savedAIMessage : msg
    ));
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
        Keyboard.dismiss();
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <SafeAreaView style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
   
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleRoute('history')}
          >
            <FontAwesome name="history" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            disabled={chatIdRef.current ? false : true}
            
            onPress={() => handleRoute('new')}
          >
            <Entypo name="new-message" size={24} color={chatIdRef.current ? '#333' : '#ccc'} />
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.content}>

        <FlatList
          ref={flatListRef}
          style={styles.chatContainer}
          data={messages}
          renderItem={({ item }) => <ChatMessage id={item.id} picture={picture || "icon"} message={item.content} isAI={item.isAI} createdAt={item.createdAt} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          initialNumToRender={messages?.length} // Ensure all messages are rendered initially
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10
          }}
        />

      </View>

      <View style={styles.footer}>
        <MessageBar
          onModalPress={handleModalPress}
          onMessageSend={handleMessageSend}
        />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    backgroundColor:"transparent"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },

  recentChat: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },


  chatContainer: {
    flex: 1,
    backgroundColor: theme.background,
    marginBottom: 50,
  },
});

export default ChatScreen;
