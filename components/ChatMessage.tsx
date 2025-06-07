import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import React from "react";
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";
import { MessageType } from "@/interface/Interface";

interface ChatMessageProps {
  id: string;
  name: string;
  message: string;
  isAI: boolean;
  picture: string;

}

const ChatMessage = ({
  id,
  name,
  message,
  isAI,
  picture,

}: ChatMessageProps) => {

  const {theme} = useTheme();
  const styles = getStyles(theme);

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(message);
  };


  return (
    <View style={styles.cardContainer}>
      <View
        style={
          isAI
            ? styles.avatarContainerBot
            : styles.avatarContainerUser
        }
      >
        {isAI ? (
          <>
            <Text style={{color:theme.text}}>DocAI</Text>
            <Ionicons name="person-circle" size={28} color={theme.text}/>
          </>
        ) : (
          <>
            {picture === "icon" ? (
              <Ionicons name="person-circle" size={28} color={theme.text} />
            ) : (
              <Image source={{ uri: picture }} style={styles.avatar} />
            )}
            <Text style={{color:theme.text}}>{isAI ? "DocAI" : name}</Text>
          </>
        )}
      </View>
      <View style={isAI ? styles.messageContainerAI : styles.messageContainer} >
      <Markdown
  style={
    {
      body: styles.body,
      code_block: styles.code_block,
      code_inline: styles.code_inline,
      link: styles.link,
      heading1: styles.heading1,
      heading2: styles.heading2,
      heading3: styles.heading3,
      heading4: styles.heading4,
      paragraph: styles.paragraph,
    }
  } 
  
  markdownit={
    MarkdownIt({typographer: true, breaks: true}) 
  }
  
>
  {message}
</Markdown>

      </View>
      <View style={styles.footer}>
        {isAI ? (
          id !== MessageType.System && (
          <View style={styles.footerButtons}>
            <Pressable
              
              onPress={handleCopyToClipboard}
            >
              <Ionicons name="copy" size={20} color={theme.text} />
            </Pressable>
          
          </View>
          )
        ) : null}
      </View>
    </View>
  );
};
const getStyles = (theme: ThemeColors) => StyleSheet.create({
  avatarContainerUser: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatarContainerBot: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 20,
  },
  messageContainerAI: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: theme.GreenIconBackground,
    padding: 15,
    borderRadius: 20,
    height: "auto",
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: theme.profileActionBackground,
  },
  footer: {
    marginTop: 10,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
    
  },
  body: {
      color: theme.text,
      fontSize: 14,
      lineHeight: 20,
      flexShrink: 1,         
      flexWrap: 'wrap',    
      width: '100%',        
    },

    code_block: {
      backgroundColor: theme.cardBackground,
      padding: 8,
      borderRadius: 5,
      flexWrap: 'wrap',
      width: '100%',
    },
    code_inline: {
      backgroundColor: theme.cardBackground,
      padding: 3,
      borderRadius: 3,
      flexWrap: 'wrap',
    },
  
    paragraph: {
      flexWrap: 'wrap',
      width: '100%',
      flexShrink: 1,
    },
 
    link: {
      color: theme.text,
      textDecorationLine: 'underline',
      flexWrap: 'wrap',
    },
    heading1: {
      color: theme.text,
      flexWrap: 'wrap',
      width: '100%',
    },
    heading2: {
      color: theme.text,
      flexWrap: 'wrap',
      width: '100%',
    },
    heading3: {
      color: theme.text,
      flexWrap: 'wrap',
      width: '100%',
    },
    heading4: {
      color: theme.text,
      flexWrap: 'wrap',
      width: '100%',
    },
});

export default React.memo(ChatMessage, (prevProps, nextProps) => {
  
  return (
    prevProps.id === nextProps.id &&
    prevProps.message === nextProps.message &&
    prevProps.isAI === nextProps.isAI &&
    prevProps.picture === nextProps.picture
  );
});