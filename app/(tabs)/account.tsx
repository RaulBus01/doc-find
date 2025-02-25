import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Appearance,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useAuth0 } from "react-native-auth0";
import { router } from "expo-router";
import { secureGetValueFor } from "@/utils/Token";
import { deleteItemAsync } from "expo-secure-store";
import { useToken } from "@/context/TokenContext";
import { User } from "@/interface/Interface";
import { Ionicons } from "@expo/vector-icons";
import CategoryView from "@/components/ui/CategoryView";
import CustomButton from "@/components/ui/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";




const BOTTOM_TAB_HEIGHT = 50;

export default function Account() {
  const { clearSession } = useAuth0();
  const { token } = useToken();
  console.log(token);
  const [user, setUser] = useState<User | null>(null);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  
  const handleChangeTheme = () => {
    const scheme = Appearance.getColorScheme();
    if (scheme === "light") {
      Appearance.setColorScheme("dark");
    } else {
      Appearance.setColorScheme("light");
    }
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
    try {
      await clearSession();
      await deleteItemAsync("accessToken");
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ bottom: BOTTOM_TAB_HEIGHT }}
      contentContainerStyle={{ paddingBottom: BOTTOM_TAB_HEIGHT}}
    >
      <LinearGradient
                colors={[theme.textlight,theme.tint,theme.mediumbackground]}
                locations={[0, 0.44, 0.90]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.body}>
          <View style={styles.profile}>
            <Image source={{ uri: user?.picture }} style={styles.image} />
            <Text style={styles.profileText}>{user?.givenName}</Text>
            <Text style={styles.profileText}>{user?.familyName}</Text>
          </View>
          <CategoryView header="Account">
            <CustomButton
              icon={<Ionicons name="mail-outline" size={24} style={styles.icon} />}
              label="E-mail"
              subLabel={user?.email || ""}
              onPress={() => console.log("Email")}
              containerStyle={styles.accountButton}
            />
            <CustomButton
              icon={<Ionicons name="lock-closed-outline" size={24}  style={styles.icon}/>}
              label="Password"
              subLabel="Change your password"
              onPress={() => console.log("Password")}
              containerStyle={styles.accountButton}
            />
            <CustomButton
              icon={<Ionicons name="person-outline" size={24}  style={styles.icon}/>}
              label="Profiles"
              subLabel="Edit your profiles"
              onPress={() => console.log("Profiles")}
              containerStyle={styles.accountButton}
            />
            <CustomButton
              icon={<Ionicons name="log-out-outline" size={24}  color={theme.red}/>}
              label="Log Out"
              subLabel="Log out of your account"
              onPress={onLogout}
              containerStyle={styles.logoutButton}
              labelStyle={{ color: theme.red }}
              subLabelStyle={{ color: theme.red }}
            />
            
          </CategoryView>
          <CategoryView header="Preferences">
            <CustomButton
              icon={<Ionicons name="notifications-outline" size={24} style={styles.icon} />}
              label="Notifications"
              subLabel="Manage your notifications"
              onPress={() => console.log("Notifications")}
              containerStyle={styles.accountButton}
            />
            <CustomButton
              icon={<Ionicons name="moon-outline" size={24} style={styles.icon} />}
              label="Dark Mode"
              subLabel="Toggle dark mode"
              onPress={handleChangeTheme}
              containerStyle={styles.accountButton}
            />
          </CategoryView>
          <CategoryView header="About">
            <CustomButton
              icon={<Ionicons name="information-circle-outline" size={24} style={styles.icon}/>}
              label="About"
              subLabel="Learn more about the app"
              onPress={() => console.log("About")}
              containerStyle={styles.accountButton}
              
            />
            <CustomButton
              icon={<Ionicons name="document-text-outline" size={24}style={styles.icon} />}
              label="Terms of Use"
              subLabel="Read our terms of use"
              onPress={() => console.log("Terms of Use")}
              containerStyle={styles.accountButton}
            />
          </CategoryView>
        </View>
      
    </LinearGradient>
    </Animated.ScrollView>
    </SafeAreaView>
  );
}
const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    backgroundColor: theme.background,
  },
  body: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    fontFamily: "Roboto-Bold",
    color: theme.text,
  },
  accountButton: {
    backgroundColor: theme.border,
    borderRadius: 10,
    padding: 10,
  },
  icon:{
    color: theme.text
  },
  logoutButton: {
    backgroundColor: theme.red,
    borderRadius: 10,
    padding: 10,
  },
 
});
