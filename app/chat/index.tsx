import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MessageBar from '@/components/ChatMessageBar/ChatMessageBar';
import React from 'react';

const ChatScreen = () => {
  const {top, bottom} = useSafeAreaInsets();
  const [localMessage, setLocalMessage] = React.useState('');
  const handleSendMessage = () => {
    console.log('Sending message', localMessage);
  }
  

  const handleNewChat = () => {
    console.log('New chat');
  };

  const handleHistory = () => {
    console.log('Chat history');
  };

  function setModalVisible(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <SafeAreaView style={[styles.safeArea, {paddingTop: top, paddingBottom: bottom}]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DocAI</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={handleHistory}>
              <FontAwesome5 name="history" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleNewChat}>
              <Entypo name="new-message" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chatContainer}>
          <Text>Chat messages will go here</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <MessageBar 
          onModalPress={() => setModalVisible(true)}
          onMessageSend={handleSendMessage}
          message={localMessage}
          setMessage={setLocalMessage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    position: 'absolute',
    right: 16,
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
});

export default ChatScreen;