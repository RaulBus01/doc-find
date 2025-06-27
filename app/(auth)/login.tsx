import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions } from "react-native";


import { useTranslation } from "react-i18next";

import { ThemeColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get('window');

export default function AuthorizationScreen() {
  const { signIn, isLoading, error } = useAuth()
  const { t } = useTranslation();


  const {theme} = useTheme();
  const styles = getStyles(theme);



  const onLogin = async () => {
    try {
      await signIn();
      
    
      
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
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>{t('login.welcomeText')}</Text>
        <Text style={styles.subText}>{t('login.subText')}</Text>
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <FontAwesome name="lock" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.loginButtonText}>{t('login.loginButtonText')}</Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.newUserButton} 
        onPress={() => router.replace("/(auth)/onboarding")}
      >
        <Text style={styles.newUserText}>{t('login.newUserText')}</Text>
        <FontAwesome6 name="arrow-right" size={14} color="#0056b3" />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    width: 250,
    height: 100,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: theme.text,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: theme.text,
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
    color: theme.textLight ? theme.textLight : theme.text,
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
    fontSize: 16,
    color: '#0056b3',
  },
}); 