
import { router } from "expo-router";

import { Alert, Button, View,Text } from "react-native";
import { useAuth0 } from "react-native-auth0";
 //TODO: Implement a login page
export default function AuthorizationScreen() {

 
  const { authorize, user, error, getCredentials, isLoading } = useAuth0();


  const onLogin = async () => {
    try {
      
      const authResult = await authorize({
        scope: "openid profile email"
      });
   
      if(authResult){
        const credentials = await getCredentials();
        
      

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