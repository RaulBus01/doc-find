import { ThemeColors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const MessageBarStyles = (theme: ThemeColors, bottom: number) =>
  StyleSheet.create({
    container: {
    paddingBottom: bottom,
    backgroundColor: "transparent",

    },
    contentView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor:"transparent",
    },
    collapsedBar: {
      flexDirection: "row",
      alignItems: "center",

      flex: 1,
      backgroundColor: theme.backgroundDark,
      borderRadius: 22,
      marginHorizontal: 15,
      marginBottom: 10,
      marginTop: 5,
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      elevation: 3,
    },
    collapsedText: {
      color: `${theme.text}80`,
      marginLeft: 10,
      flex: 1,
      fontSize: 15,
    },
    button: {
      marginRight: 10,
      width: 30,
      height: 30,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      elevation: 2,
    },
    buttonView: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginLeft: 5,
      paddingVertical: 5,
    },

    messageInput: {
      minHeight: 40,
      flex: 1,
      color: theme.text,
      fontSize: 16,
      lineHeight: 26,
      borderColor: "transparent",
  
    },
    iconButton: {
      padding: 8,
    },
    activeIconButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: `${theme.text}15`,
    },
    sendButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: theme.blue,
    },
    disabledButton: {
      backgroundColor: `${theme.blue}50`,
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    attachmentButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      position: "absolute",
      bottom: 0,
      left: 0,
      paddingLeft: 15,
    },
    bottomIcons: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
    },
      clearButton: {
    padding: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  });
