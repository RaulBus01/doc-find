import CustomCarousel from '@/components/Onboarding/ImageCarousel';
import { secureSave, secureSaveObject } from '@/utils/Token';
import { FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Credentials, useAuth0 } from 'react-native-auth0';
import { ApiCall } from '@/utils/ApiCall';

const { width } = Dimensions.get('window');
const data = [
  {
    id: '1',
    title: 'First item',
    image: require('../assets/images/favicon.png')
  },
  {
    id: '2',
    title: 'Second item',
    image: require('../assets/images/react-logo.png'),
  },
  {
    id: '3',
    title: 'Third item',
    image: require('../assets/images/react-logo.png'),
  },
]
const Page = () => {
  const router = useRouter();
  const { authorize, isLoading } = useAuth0();
  const onLogin = async () => {
    try {

      const authResult = await authorize({
        scope: "openid profile email",
        audience: `${Constants.expoConfig?.extra?.auth0?.audience}`,
      });
      if (!authResult) return;
      // console.log(authResult);
      secureSave('accessToken', authResult.accessToken);
      ApiCall.post('/user/signup', authResult.accessToken, {}).then((res) => {
        secureSaveObject('user', res);
      }
      );
      if (authResult) {
        router.push("/(tabs)");
      }
    } catch (e) {
      console.error(e);
    }
  }


return (
  <View style={styles.container}>
    <StatusBar style="dark" />
    <CustomCarousel data={data} width={width} />
    <View style={styles.footer}>
      <TouchableOpacity onPress={onLogin} style={styles.loginButton}>
        <Text> Continue to Login </Text>
        <FontAwesome6 name="arrow-right-long" size={24} color="black" />
      </TouchableOpacity>
    </View>


  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 100,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    gap: 10,
    borderRadius: 25,
    borderWidth: 0.25,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    width: '80%'
  }
});
export default Page;