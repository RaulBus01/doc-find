import { router } from "expo-router";
import Constants from 'expo-constants';
import { Alert, Button, View,Text } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { secureSave, secureSaveObject } from "@/utils/SecureStorage";
import { ApiCall } from "@/utils/ApiCall";
import { useUserData } from "@/context/UserDataContext";
import { useToken } from "@/context/TokenContext";

 //TODO: Implement a login page
export default function AuthorizationScreen() {

  // Add this line to get refreshData from context
  const { refreshData } = useUserData();
  const { refreshToken } = useToken();
  const { authorize, user, error, isLoading } = useAuth0();

  const onLogin = async () => {
    try {
      const authResult = await authorize({
        scope: "openid profile email",
        audience: `${Constants.expoConfig?.extra?.auth0?.audience}`,
      });
      
      if (!authResult) return;
      
      await secureSave('accessToken', authResult.accessToken);
      const userData = await ApiCall.post('/user/signup', authResult.accessToken, {});
      
      if (userData) {
        // Save user data securely
        await secureSaveObject('user', userData);
        // Update token context
        await refreshToken(); 
        // Update user data context
        await refreshData();
        
        // ONLY navigate after data is refreshed
        router.push("/(tabs)");
      }
    } catch (e) {
      console.error("Login error:", e);
    }
  };

 

  return (
    <View>
      <View>
        {!user ? (
          <Text>You are not logged in</Text>
        ) : (
          <Text>You are logged in</Text>
        )}
        <Button onPress={onLogin} title={"Log In"} />
        {error && <Text>{error.message}</Text>}
      </View>
    </View>
  );
}