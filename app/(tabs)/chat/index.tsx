import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import MessageBar from '../../../components/ChatMessageBar/ChatMessageBar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';

import ChatMessage from '../../../components/ChatMessage/ChatMessage';

import { Chat } from '@/interface/Interface';

const ChatScreen = () => {
  const [showRecents, setShowRecents] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState('');

  // Mock recent chats data
  const recentChats : Chat[] = [
    { id: '1', title: 'Previous chat 1', profileId: 1 },
    { id: '2', title: 'Previous chat 2', profileId: 2 },
  ];

  const handleMessageSend = async (text: string) => {
    setShowRecents(false);
    setIsThinking(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsThinking(false);
      // Add your actual message handling logic here
    }, 2000);
  };

  const handleModalPress = () => {
    console.log('Modal pressed');
    // Add your modal logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => console.log('History')}
          >
            <FontAwesome name="history" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => console.log('New chat')}
          >
            <Entypo name="new-message" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {showRecents ? (
          <FlatList
            data={recentChats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recentChat}>
                <Text>{item.title}</Text>
              </View>
             
              
                

           

            )}
          />
        ) : (
          <View style={styles.chatContainer}>
            {isThinking && (
              <ChatMessage
                message="I'm thinking about your request..."
               
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>   
      <MessageBar
        onModalPress={handleModalPress}
        onMessageSend={handleMessageSend}
        message={message}
        setMessage={setMessage}
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
  footer:{
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
  },

  chatContainer: {
    flex: 1,
  },
});

export default ChatScreen;
