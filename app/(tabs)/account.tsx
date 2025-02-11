import { View, Text, Button, Image } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { router } from "expo-router";
export default function Account() {

  const { user, clearSession } = useAuth0();

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
      <Image source={{ uri: user?.picture }} style={{ width: 100, height: 100 }} />
      <Button onPress={onLogout} title={"Log Out"} />
    </View>
  );
}
