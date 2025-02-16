import ChatItem from "@/components/ChatItem/ChatItem";
import { Colors } from "@/constants/Colors";
import { useToken } from "@/context/TokenContext";
import { Chat } from "@/interface/Interface";
import { getChats } from "@/utils/Database";
import { useEffect, useState,  } from "react";
import { View,Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";




const ChatHistoryScreen = () => {
    const {top,bottom} = useSafeAreaInsets();
    const[chatHistory,setChatHistory] = useState<Chat[]>([]);
    const {token,isLoading,error } = useToken();
    useEffect(() => {
        if(!isLoading && !error && token)
            {
              getChats(token).then((data) => {
                if(data.length > 0)
                {
                  setChatHistory(data);
                }
              });
            }
        },[])
        const ListHeader = () => (
            <Text style={styles.contentTitle}>Recent Chats</Text>
        );
    
    return (
        <SafeAreaView style={[styles.container,{paddingTop:top,paddingBottom:bottom}]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat History</Text>
            </View>
            {chatHistory.length > 0 && (
                <FlatList
                    data={chatHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ChatItem 
                            id={item.id} 
                            title={item.title} 
                            createdAt={item.createdAt} 
                            updatedAt={item.updatedAt} 
                        />
                    )}
                    ListHeaderComponent={ListHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
            
          
          
          </SafeAreaView>
    )
 

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: "row",
  
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.tint,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        padding: 10,
    },
    contentTitle:{
        fontSize: 16,
        fontWeight: "500",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        bottom: 10
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 50,
    },
});


export default ChatHistoryScreen;