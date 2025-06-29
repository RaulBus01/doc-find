import CustomCarousel from '@/components/ImageCarousel';
import { FontAwesome6 } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';


import '@/i18n';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';


const { width } = Dimensions.get('window');

const data = [
  {
    id: '1',
    title: 'First item',
    image: require('../../assets/images/welcome1.png'),
   
  },
  {
    id: '2',
    title: 'Second item',
    image: require('../../assets/images/welcome2.png')
  },
  {
    id: '3',
    title: 'Third item',
     image: require('../../assets/images/welcome4.png'),
  },
  {
    id: '4',
    title: 'Fourth item',
    image: require('../../assets/images/welcome5.png'),
  },
  {
    id: '5',
    title: 'Fifth item',
    image: require('../../assets/images/welcome3.png'),
  },
  
]
const Page = () => {
    const { t } = useTranslation();
  const router = useRouter();

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const onLogin = async () => {

        router.push('/(auth)/login');

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
