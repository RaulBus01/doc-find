import { View, Text, SafeAreaView, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import MessageBar from '../components/ChatMessageBar/ChatMessageBar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import ChatMessage from '../components/ChatMessage/ChatMessage';
import { Message } from '@/interface/Interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useToken } from '@/context/TokenContext';
import { addChat, addMessage, getMessages } from '@/utils/Database';
import { Colors } from '@/constants/Colors';
import { useUserData } from '@/context/UserDataContext';

const ChatScreen = () => {

  let { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const [chatId, _setChatId] = useState(id);
  const chatIdRef = useRef(chatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const { token, isLoading, error } = useToken();
  const { userId } = useUserData();


  function setChatId(id: string) {
    chatIdRef.current = id;
    _setChatId(id);
  }

  useEffect(() => {
    if (id) {
      if (!isLoading && !error && token)
        getMessages(token, id).then((data) => {
          setMessages(data);
        });
    }
  }, [id]);


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
      if (id){        
        const newMessage = {
          id: '',
          content: messageContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
          chatId: id,
        };
        const savedMessage = await addMessage(id, token, {
          message: newMessage.content,
        });

        setMessages([...messages, savedMessage]);
      }
      else
      {
        const newMessage = {
          id: '',
          content: messageContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
          chatId: id,
        };

        const chat = await addChat(token, newMessage.content);
        if (chat) {
          setChatId(chat.id);
          setMessages([...messages, newMessage]);
        }

      }
        Keyboard.dismiss();
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <SafeAreaView style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
      {/* Header */}
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
            disabled={id ? false : true}
            
            onPress={() => handleRoute('new')}
          >
            <Entypo name="new-message" size={24} color={id ? '#333' : '#ccc'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>

        <FlatList
          style={styles.chatContainer}
          data={messages}
          renderItem={({ item }) => <ChatMessage message={item.content} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode="on-drag"
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

const styles = StyleSheet.create({
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
    bottom: 50

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
    backgroundColor: Colors.light.lightgreen,
  },
});

export default ChatScreen;
