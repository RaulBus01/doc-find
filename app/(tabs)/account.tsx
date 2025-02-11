import { View, Text, Button, Image } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { router } from "expo-router";
import { getValueFor } from '@/utils/Token';
import { useEffect, useState } from 'react';
export default function Account() {

  const { user, clearSession } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getValueFor("accessToken");
      if (!token) 
        return;
      setToken(token);
    };
    fetchToken();
  }, []);

  const onLogout = async () => {
    try {
      await clearSession();
      router.replace("/");
    } catch (e) {
      console.log("Log out cancelled");
    }
  };

  return (
    <View>
      <Text>Account Screen</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.name}</Text>
      <Text>{token}</Text>
      <Image source={{ uri: user?.picture }} style={{ width: 100, height: 100 }} />
      <Button onPress={onLogout} title={"Log Out"} />
    </View>
  );
}
