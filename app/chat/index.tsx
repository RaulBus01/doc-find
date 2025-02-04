import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import MessageBar from '../../components/ChatMessageBar/ChatMessageBar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';

const ChatPage = () => {
    const [message, setMessage] = useState('');

    const handleMessageSend = (text: string) => {
        console.log('Sending message:', text);
        // Add your message sending logic here
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

            {/* Chat Content */}
            <View style={styles.chatContainer}>
                <Text style={styles.placeholder}>Your chat messages will appear here</Text>
            </View>

           <View style={styles.footer}>
            <MessageBar
                message={message}
                setMessage={setMessage}
                onMessageSend={handleMessageSend}
                onModalPress={handleModalPress}
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
        bottom: 50,
        
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 16,
        padding: 4,
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        color: '#999',
        fontSize: 16,
    },
});

export default ChatPage;
