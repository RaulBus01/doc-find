
import { router } from "expo-router";

import { Alert, Button, View,Text } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function AuthorizationScreen() {
  const { authorize, user, error, getCredentials, isLoading } = useAuth0();

  console.log(user, error, isLoading);

  const onLogin = async () => {
    try {
      
      const authResult = await authorize({
        scope: "openid profile email"
      });
      console.log(authResult);
      if(authResult){
        const credentials = await getCredentials();
        console.log(credentials);

        router.push("/(tabs)");
      }
    } catch (e) {
      console.error(e);
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