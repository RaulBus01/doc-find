import { View, Text, Button, Image } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { router } from "expo-router";
import {  secureGetValueFor } from '@/utils/Token';
import { useEffect, useState } from 'react';
import { deleteItemAsync } from 'expo-secure-store';
import { useToken } from '@/context/TokenContext';
export default function Account() {

  const { clearSession } = useAuth0();
  const {token} = useToken();
  const [user, setUser] = useState<any | null>(null);

  // Handle user data fetching
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await secureGetValueFor("user");
        if (userData) {
          const userJSON = await JSON.parse(userData);
     
          setUser(userJSON);
        }
       
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const onLogout = async () => {
    try {
      await clearSession();
      await deleteItemAsync("accessToken");
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <Text>Account Screen</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.username}</Text>
      <Text>{user?.id}</Text>
      {/* <Text>{user?.name}</Text> */}
      <Text>{token}</Text>
      <Image source={{ uri: user?.picture }} style={{ width: 100, height: 100 }} />
      <Button onPress={onLogout} title={"Log Out"} />
    </View>
  );
}
