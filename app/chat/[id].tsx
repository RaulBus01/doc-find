
import {useLocalSearchParams } from 'expo-router';
import { View,Text } from 'react-native';

export default function ChatRoom() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Chat Room {id}</Text>
    </View>
  );
}