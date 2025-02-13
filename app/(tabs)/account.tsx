import { View, Text, Button, Image } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { router } from "expo-router";
import {  secureGetValueFor } from '@/utils/Token';
import { useEffect, useState } from 'react';
import { deleteItemAsync } from 'expo-secure-store';
export default function Account() {

  const { clearSession } = useAuth0();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);


   // Handle token fetching
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await secureGetValueFor("accessToken");
        if (accessToken) {
          setToken(accessToken);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

  // Handle user data fetching
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await secureGetValueFor("user");
        if (userData) {
          const userJSON = await JSON.parse(userData);
          console.log(userJSON);
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
      console.log("Log out cancelled");
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
