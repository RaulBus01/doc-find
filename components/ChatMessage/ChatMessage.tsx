import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons'
import Markdown from 'react-native-markdown-display';


interface ChatMessageProps {
  message: string;
  isAI: boolean;
}

const ChatMessage = ({message,isAI}:ChatMessageProps) => {
 
  return (
    <View style={ChatCardStyle.cardContainer}>
        <View style={isAI ? ChatCardStyle.avatarContainerBot : ChatCardStyle.avatarContainerUser}>
            { isAI ? 
            <>
            <Text>Bot</Text> 
            <Ionicons name="person-circle" size={28} color="black" />
            </>
            :
            <>
            <Ionicons name="person-circle" size={28} color="black" />
            <Text>{isAI ? 'Bot' : 'User'}</Text>
            </>
            
          }  
        </View>
        <View style={ChatCardStyle.messageContainer}>
            <Markdown>
              {message}
            </Markdown>

        </View>
        
    
    </View>
  )
}
const ChatCardStyle = StyleSheet.create({

  avatarContainerUser: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
  },
  avatarContainerBot: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
  },
  cardContainer: {
      flexDirection: 'column',
      // justifyContent: 'flex-start',
      // alignItems: 'flex-start',
      padding: 10,

      borderRadius: 10,
      marginBottom: 10
  },
  messageContainer: {

      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: '#f9f9f9',
      padding: 10,
      borderRadius: 10
  }
})

export default ChatMessage