import React, { useEffect, useState } from "react";
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
import { useAuth0 } from "react-native-auth0";
import { router } from "expo-router";
import { useToken } from "@/context/TokenContext";
import { User } from "@/interface/Interface";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { secureGetValueFor } from "@/utils/SecureStorage";
import { Switch } from "react-native-gesture-handler";
import { useUserData } from "@/context/UserDataContext";

const BOTTOM_TAB_HEIGHT = 50;

export default function Account() {
  const { clearSession } = useAuth0();
  const { clearToken } = useToken();
  const { clearUserData } = useUserData();

  const [user, setUser] = useState<User | null>(null);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { theme, toggleTheme,isDark } = useTheme();
  const styles = getStyles(theme,isDark);

  const handleChangeTheme = () => {
    toggleTheme();
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await secureGetValueFor("user");
        if (userData) {
          const userJSON = JSON.parse(userData);
          setUser(userJSON);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const onLogout = async () => {
    console.log("Logging out...");
    try {
      await clearSession();
      await clearToken();
      await clearUserData(); // Make sure this has await
      router.replace("/login");
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
  
        {/* Header Profile Section */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user?.picture }} style={styles.avatar} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.givenName} {user?.familyName}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
          
        
        </Animated.View>
        
        <ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <View style={styles.optionCard}>
              <Pressable 
                style={styles.option}
                onPress={() => console.log("Edit Profile")} // Changed from onPressIn
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.BlueIconBackground}]}>
                  <Ionicons name="mail" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>E-mail</Text>
                  <Text style={styles.optionSubtitle}>{user?.email}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
              
              <View style={styles.separator} />
              
              <Pressable 
                style={styles.option}
                onPress={() => console.log("Change Password")} // Changed from onPressIn
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.VioletIconBackground}]}>
                  <Ionicons name="lock-closed" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Password</Text>
                  <Text style={styles.optionSubtitle}>Change your password</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
              
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
                  <Text style={styles.optionTitle}>Health Profiles</Text>
                  <Text style={styles.optionSubtitle}>Manage your health profiles</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable> 
            </View>
          </View>
          
          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.optionCard}>
              <Pressable 
                style={styles.option}
                onPress={() => console.log("Notifications")} // Changed from onPressIn
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.RedIconBackground}]}>
                  <Ionicons name="notifications" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Notifications</Text>
                  <Text style={styles.optionSubtitle}>Manage your notifications</Text>
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
                    Dark Mode
                  </Text>
                  <Text style={styles.optionSubtitle}>Toggle appearance theme</Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={handleChangeTheme}
                  thumbColor={theme.text}
                  trackColor={{ false: theme.mediumbackground, true: theme.tint }}
                  style={{ marginLeft: 'auto' }}
                />
            
              </Pressable>
            </View>
          </View>
          
          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.optionCard}>
              <Pressable 
                style={styles.option}
                onPress={() => console.log("About")} // Changed from onPressIn
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.LightBlueIconBackground}]}>
                  <Ionicons name="information-circle" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>About</Text>
                  <Text style={styles.optionSubtitle}>Learn more about the app</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.text} style={styles.optionArrow} />
              </Pressable>
              
              <View style={styles.separator} />
              
              <Pressable 
                style={styles.option}
                onPress={() => console.log("Terms of Use")} // Changed from onPressIn
                android_ripple={{ color: theme.pressedBackground }}
              >
                <View style={[styles.optionIcon, {backgroundColor: theme.LightVioletIconBackground}]}>
                  <Ionicons name="document-text" size={20} color={theme.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Terms of Use</Text>
                  <Text style={styles.optionSubtitle}>Read our terms of use</Text>
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
            onPressIn={onLogout}
            android_ripple={{ color: theme.pressedBackground }}
          >
            <Ionicons name="log-out" size={18} color="#fff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
          
        
        </ScrollView>
     
    </SafeAreaView>
  );
}

const getStyles = (theme: any,isDark:any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.textlight,
  },
  gradient: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
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
    color: theme.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.text,
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
    backgroundColor: 'transparent', // Ensure base style has no conflicting background
  },
  optionPressed: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.pressedBackground, // Apply the background color
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
    backgroundColor: theme.red ? theme.red + 'CC' : '#F43F5E' + 'CC', // Example: Add opacity or use a darker shade
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