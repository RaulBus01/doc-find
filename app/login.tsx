import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { secureSave, secureSaveObject } from '@/utils/SecureStorage';
import Constants from 'expo-constants';
import { ApiCall } from '@/utils/ApiCall';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useUserData } from "@/context/UserDataContext";
import { useToken } from "@/context/TokenContext";

const { width } = Dimensions.get('window');

export default function AuthorizationScreen() {
  const { authorize, user, error, isLoading } = useAuth0();

  const { refreshData } = useUserData();
  const { refreshToken } = useToken();


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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/favicon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>DocFind</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Please sign in to continue</Text>
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <FontAwesome name="lock" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.loginButtonText}>Login with Auth0</Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.newUserButton} 
        onPress={() => router.push("/")}
      >
        <Text style={styles.newUserText}>New to DocFind? See what we offer</Text>
        <FontAwesome6 name="arrow-right" size={14} color="#0056b3" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#0056b3',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  newUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 30,
    gap: 8,
  },
  newUserText: {
    fontSize: 14,
    color: '#0056b3',
  },
}); 