
import { StyleSheet } from "react-native";


const ChatMessageBarStyle = (theme: any) => StyleSheet.create({

        contentView : {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.tint,
          borderTopLeftRadius:20,
          borderTopRightRadius:20,
          borderWidth:1,
          borderColor:theme.darkbackground,
          paddingHorizontal: 10,
          paddingVertical: 5,
          
        },
        row:{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          marginVertical: 5,
        },
        button:{
            marginHorizontal: 5,
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth:1,
            borderColor:theme.background,
            backgroundColor:theme.background,

        },
        buttonView:{
          flexDirection: 'row',
          alignItems: 'center',
          
          gap: 12,
        },
        textAreaView:{
          flex: 1,
          minHeight:30,
          maxHeight: 150,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.background,
          borderRadius: 20,
          marginHorizontal: 5,
          marginVertical: 5,
          
        },
        bottomIcons: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          position: 'absolute',
          bottom: 10,
          right: 10,
        },
        messageInput:{
          flex: 1,
          marginLeft: 10,
          padding: 5,
          borderRadius: 20,
          backgroundColor: 'transparent',
          color: theme.text,
        },
        textAreaButtonView:{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        },


      });
export default ChatMessageBarStyle;