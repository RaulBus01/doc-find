import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";

import { User } from "@/interface/Interface";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

import { Switch } from "react-native-gesture-handler";

import { ThemeColors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/i18n";

import { OfflineIndicator, useOfflineStatus } from "@/components/OfflineIndicator";

import LanguagePicker from "../../components/modals/Language";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { secureDeleteValue } from "@/utils/SecureStorage";


const BOTTOM_TAB_HEIGHT = 80;

export default function Account() {
 const {signOut} = useAuth();



  const {user } =useAuth();
  const languagePickerRef = useRef<BottomSheetModal>(null);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = getStyles(theme);
  const isOffline = useOfflineStatus();
  const { t, i18n } = useTranslation();

  const handleChangeTheme = () => {
    toggleTheme();
  }

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
  };

  const getCurrentLanguageName = () => {
    const languageNames: { [key: string]: string } = {
      'en-US': 'English',
      'ro-RO': 'Română',
      'fr-FR': 'Français',
      'es-ES': 'Español',
      'de-DE': 'Deutsch',
      'it-IT': 'Italiano',
      'pt-PT': 'Português',
    };
    return languageNames[i18n.language] || 'English';
  };

  const openLanguagePicker = () => {
    languagePickerRef.current?.present();
  };

 

  const onLogout = async () => {
    console.log("Logging out...");
    try {
      await signOut();
    
      await secureDeleteValue('accessToken');

    } catch (e) {
      console.error("Error during logout:", e);
    }
  };


  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, 100], [1, 0.9]),
    };
  });


  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
  
        {/* Header Profile Section */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: isOffline ? theme.red : theme.progressColor }]}>
              <Image source={{ uri: user?.picture }} style={styles.avatar} />
            </View>
            <View style={styles.profileInfo}>
              {user?.givenName && user.familyName ? (
                <Text style={styles.profileName}>
                  {user.givenName} {user.familyName}
                </Text>
              ) : (
                <Text style={styles.profileName}>{user?.nickname}</Text>
              )}
              
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            
          </View>
          <OfflineIndicator />
        
        </Animated.View>
        
        <ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('account.sectionTitle')}</Text>
            
            <View style={styles.optionCard}>
              <Pressable 
                style={styles.option}
                onPress={() => console.log("Edit Profile")} 
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.BlueIconBackground}]}>
                  <Ionicons name="mail" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('account.emailText')}</Text>
                  <Text style={styles.optionSubtitle}>{user?.email}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
              
          
              
              {/* <Pressable 
                style={styles.option}
                onPress={() => console.log("Change Password")} 
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.VioletIconBackground}]}>
                  <Ionicons name="lock-closed" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('account.passwordText')}</Text>
                  <Text style={styles.optionSubtitle}>{t('account.passwordSubText')}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable> */}
              
              <View style={styles.separator} />
              
              <Pressable
                style={styles.option}
                onPress={() => router.push('/(profiles)/history')}
                android_ripple={{color: theme.pressedBackground}}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.GreenIconBackground}]}>
                  <FontAwesome5 name="user-friends" size={18} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('account.profileText')}</Text>
                  <Text style={styles.optionSubtitle}>{t('account.profileSubText')}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable> 
            </View>
          </View>
          
          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('account.preferencesText')}</Text>
            
            <View style={styles.optionCard}>
              <Pressable 
                style={styles.option}
                onPress={openLanguagePicker}
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.RedIconBackground}]}>
                  <Ionicons name="language" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('account.languageText')}</Text>
                  <Text style={styles.optionSubtitle}>{getCurrentLanguageName()}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
              
              <View style={styles.separator} />
              
              <Pressable 
                style={styles.option}
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.YellowIconBackground}]}>
                  <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>
                    {t('account.darkModeText')}
                  </Text>
                  <Text style={styles.optionSubtitle}>{t('account.darkModeSubText')}</Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={handleChangeTheme}
                  thumbColor={theme.text}
                  trackColor={{ false: theme.progressColor, true: theme.progressColor }}
                  style={{ marginLeft: 'auto' }}
                />
            
              </Pressable>
            </View>
          </View>
          
          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}> {t('account.aboutText')}</Text>
            
            <View style={styles.optionCard}>
              <Pressable 
                style={styles.option}
                 onPress={() => router.push('/(about)/about')}
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.LightBlueIconBackground}]}>
                  <Ionicons name="information-circle" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('account.aboutText')}</Text>
                  <Text style={styles.optionSubtitle}>{t('account.aboutSubText')}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
              
              <View style={styles.separator} />
              
              <Pressable 
                style={styles.option}
                onPress={() => router.push('/(about)/terms')}
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.LightVioletIconBackground}]}>
                  <Ionicons name="document-text" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{t('account.termsText')}</Text>
                  <Text style={styles.optionSubtitle}>{t('account.termsSubText')}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
            </View>
          </View>
          
          {/* Logout */}
          <Pressable 
            style={({ pressed }) => [
              styles.logoutButton,
              pressed ? styles.logoutButtonPressed : null,
            ]}
            onPress={onLogout}
            android_ripple={{ color: theme.pressedBackground }}
          >
            <Ionicons name="log-out" size={18} color="#fff" />
            <Text style={styles.logoutText}>{t('account.logoutText')}</Text>
          </Pressable>
          
        
        </ScrollView>
     
      <LanguagePicker
        ref={languagePickerRef}
        onLanguageSelect={handleLanguageSelect}
        currentLanguage={i18n.language}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  pressable: {
    width: 120,
    height: 120,
    backgroundColor: 'mediumpurple',
    borderWidth: StyleSheet.hairlineWidth,
  },
  highlight: {
    width: 120,
    height: 120,
    backgroundColor: 'red',
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    backgroundColor: theme.blue,
    paddingHorizontal: 20,
    paddingTop: 32,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    
  
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: theme.avatarBackground,
    padding: 3,
    
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: '#f2f2f2',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#f2f2f2',
    opacity: 0.7,
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: BOTTOM_TAB_HEIGHT + 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: theme.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  optionCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
   
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent', 
  },
  optionPressed: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.pressedBackground, 
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: theme.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: theme.text,
    opacity: 0.7,
  },
  optionArrow: {
    opacity: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: theme.separator,
    marginLeft: 68,
  },
  
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.red || '#F43F5E',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  logoutButtonPressed: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.red ? theme.red + 'CC' : '#F43F5E' + 'CC', 
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: theme.text,
    opacity: 0.4,
  },
});