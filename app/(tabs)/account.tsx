import { View, Text, Button, Image,StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { router } from "expo-router";
import {  secureGetValueFor } from '@/utils/Token';
import { useEffect, useState } from 'react';
import { deleteItemAsync } from 'expo-secure-store';
import { useToken } from '@/context/TokenContext';
import { Colors } from '@/constants/Colors';
import { User } from '@/interface/Interface';
import { Ionicons } from '@expo/vector-icons';

export default function Account() {

  const { clearSession } = useAuth0();
  const {token} = useToken();
  const [user, setUser] = useState<User | null>(null);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.profile}>
          <Image source={{ uri: user?.picture }} style={styles.image} />
          <Text style={styles.profileText}>{user?.givenName}</Text>
          <Text style={styles.profileText}>{user?.familyName}</Text>
        </View>
        <View style={styles.category}>
          <View style={styles.categoryHeader}>
            <Text style={styles.profileText}>Account</Text>
          </View>
          <View style={styles.categoryContent}>
             <TouchableOpacity style={styles.profile}>
              <Ionicons name="mail-outline" size={24} />
              <View style={styles.buttonView}>
                <Text style={styles.categoryText}>E-mail</Text>
                <Text style={styles.categoryText}>{user?.email}</Text>
              </View>
            </TouchableOpacity>
           </View>
        </View>

      </View>
    
      <Text>{user?.email}</Text>
      <Text>{user?.username}</Text>
      <Text>{user?.id}</Text>
      {/* <Text>{user?.name}</Text> */}
      <Text>{token}</Text>
  
      <Button onPress={onLogout} title={"Log Out"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
      justifyContent: "center",
      backgroundColor: Colors.light.tint,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
  headerText: {
    fontSize: 26,
    fontFamily: "Roboto-Bold",
    color: Colors.light.text,
    opacity: 0.65,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileText: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: Colors.light.textlight,
  },
  category: {
    flexDirection: 'column',
   
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoryContent: {
    flexDirection: 'column',
    gap: 10,
  },
  categoryText:{
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    color: Colors.light.text
  },
  buttonView: {
    flexDirection: 'column',
  },

  


});