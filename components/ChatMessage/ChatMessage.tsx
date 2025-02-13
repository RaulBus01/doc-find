import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons'



interface ChatMessageProps {
  message: string;

 
}

const ChatMessage = ({message}:ChatMessageProps) => {
 
  return (
    <View style={ChatCardStyle.cardContainer}>
        <View >
            <Ionicons name="person-circle" size={24} color="black" />
            <Text></Text> 
        </View>
        <View >
            <Text>{message}</Text>

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
      margin: 10,

  },
})

export default ChatMessage