import { StyleSheet } from "react-native";


const ChatMessageBarStyle = StyleSheet.create({

        contentView : {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
         
       
        },
        row:{
          flexDirection: 'row',
          alignItems: 'center',
          
          paddingHorizontal: 20,
          marginVertical: 5,
        },
        button:{
           width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0084ff',
        },
        buttonView:{
          flexDirection: 'row',
          alignItems: 'center',
          
          gap: 12,
        },
        textAreaView:{
          flex: 1,
          minHeight:20,
          maxHeight: 150,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'grey',
          borderRadius: 20,
          marginHorizontal: 10,
          paddingHorizontal: 10,
         
        },
        messageInput:{
          flex: 1,
          marginLeft: 10,
          padding: 5,
          
          borderRadius: 20,
          backgroundColor: 'transparent',
        },
        textAreaButtonView:{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        },


      });
export default ChatMessageBarStyle;