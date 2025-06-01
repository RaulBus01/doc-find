import CustomCarousel from '@/components/ImageCarousel';
import { secureSave, secureSaveObject } from '../utils/SecureStorage';
import { FontAwesome6 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Dimensions, Text, Pressable, TouchableOpacity} from 'react-native';
import { Credentials, useAuth0 } from 'react-native-auth0';
import { ApiCall } from '@/utils/ApiCall';
import { useUserData } from '@/context/UserDataContext';
import { useToken } from '@/context/TokenContext';
import '@/i18n';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const data = [
  {
    id: '1',
    title: 'First item',
    image: require('../assets/images/onboarding1.png'),
   
  },
  {
    id: '2',
    title: 'Second item',
    image: require('../assets/images/onboarding3.png')
  },
  {
    id: '3',
    title: 'Third item',
     image: require('../assets/images/onboarding2.png'),
  },
]
const Page = () => {
    const { t } = useTranslation();
  const router = useRouter();
  const { authorize, isLoading } = useAuth0();
    const { refreshData } = useUserData();
    const { refreshToken } = useToken();
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
  <View style={styles.container}>
     
    <CustomCarousel data={data} width={width} />
    <View style={styles.footer}>
      <TouchableOpacity onPress={onLogin} style={styles.loginButton}>
        <Text> {t('home.loginButtonText')}</Text>
        <FontAwesome6 name="arrow-right-long" size={24} color="black" />
      </TouchableOpacity>
    </View>


  </View>
);
};


const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 100,
    zIndex:-10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    marginTop: 20,
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