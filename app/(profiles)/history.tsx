import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDatabase } from '@/hooks/useDatabase';
import { profiles } from '@/database/schema';
import { desc } from 'drizzle-orm';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HistoryProfile = () => {
  const drizzleDB = useDatabase();
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [profilesData, setProfilesData] = useState<any>();
  
  useEffect(() => {
    console.log("Fetching profiles");
    const fetchProfile = async () => {
      const profile = await drizzleDB.select().from(profiles).orderBy(desc(profiles.created_at)).execute();
      setProfilesData(profile);
    };
    fetchProfile();
  }, []);

  const onProfilePress = (id: string) => {
    router.push(`/(profiles)/${id}`);
  }
  const onPrfileLongPress = (id: string) => {
    console.log("Profile Long Pressed", id);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top","bottom"]}>
      <LinearGradient
        colors={[theme.textlight, theme.tint, theme.mediumbackground]}
        locations={[0, 0.44, 0.90]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          scrollIndicatorInsets={{ bottom: 50 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>History Profile</Text>
            {profilesData && profilesData.map((profile: any) => (
              <TouchableHighlight key={profile.id} onPress={()=>onProfilePress(profile.id)} onLongPress={()=>onPrfileLongPress(profile.id)}activeOpacity={0.8} underlayColor="rgba(255,255,255,0.2)">
              <View key={profile.id} style={styles.profileCard}>
                <View style={styles.profileRow}>
                  <Ionicons name="person-circle" size={24} color={theme.text} />
                  <Text style={styles.profileText}>{profile.fullname}</Text>
                </View>
                
                <View style={styles.profileRow}>
                  {profile.gender === "Male" ? (
                    <FontAwesome5 name="mars" size={24} color={theme.text} />
                  ) : (
                    <FontAwesome5 name="venus" size={24} color={theme.text} />
                  )}
                  <Text style={styles.profileText}>{profile.gender}</Text>
                </View>
                
                <View style={styles.profileRow}>
                  <Ionicons name="calendar" size={24} color={theme.text} />
                  <Text style={styles.profileText}>{profile.age}</Text>
                </View>
                
                
              </View>
              </TouchableHighlight>
            ))}
          </View>
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.textlight,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingTop: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    marginBottom: 15,
  },
  profileCard: {
    borderRadius: 25,
    elevation: 4,
    marginVertical: 10,
    padding: 15,
    backgroundColor: theme.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 2,
  },
  profileText: {
    color: theme.text,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginLeft: 12,
  },
});

export default HistoryProfile;