import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDatabase } from "@/hooks/useDatabase";
import { healthIndicators, profiles } from "@/database/schema";
import { eq } from "drizzle-orm";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Pressable } from "react-native-gesture-handler";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { healthIndicatorConfig } from "@/utils/HealthIndicatorInterface";
import { ThemeColors } from "@/constants/Colors";
import { getProfileById, getProfileHealthIndicatorById } from "@/utils/LocalDatabase";

const ProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const [profileId, setProfileId] = useState(id);
  const drizzleDB = useDatabase();
  const [profileData, setProfileData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      // Fetch profile data
      const profile = await getProfileById(drizzleDB, Number(profileId));
      if (!profile) {
        setProfileData(null);
        return;
      }
      setProfileData(profile);

        // Fetch health indicators
        const health = await getProfileHealthIndicatorById(drizzleDB, Number(profileId));

      if (!health) {
        setHealthData(null);
        return;
      }
      setHealthData(health);
    };
    fetchProfile();
  }, [profileId]);

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const { top, bottom } = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: bottom }]}
      edges={["bottom"]}
    >
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top + 10 }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.textLight ? theme.textLight : theme.text}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Profile Details</Text>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileAvatarContainer}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={50} color={theme.text} />
            </View>
          </View>
          <Text style={styles.profileName}>{profileData.fullname}</Text>
          <View style={styles.profileMeta}>
            <View style={styles.metaItem}>
              <FontAwesome5
                name={profileData.gender === "Male" ? "mars" : "venus"}
                size={16}
                color={theme.text}
              />
              <Text style={styles.metaText}>{profileData.gender}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.text} />
              <Text style={styles.metaText}>{profileData.age} years</Text>
            </View>
          </View>
          <View style={styles.profileActions}>
            <Pressable
              style={styles.editProfileButton}
              onPress={() => console.log("Edit profile")}
            >
              <Ionicons name="pencil" size={16} color={theme.text} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </Pressable>
          </View>
        </View>

        {/* Health Indicators */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Health Indicators</Text>
          {healthData && (
            <>
              {Object.entries(healthIndicatorConfig).map(([key, config]) => (
                <View key={key} style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <FontAwesome5
                      name={config.icon}
                      size={20}
                      color={theme.text}
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{config.label}</Text>
                    <Text style={styles.infoValue}>{healthData[key]}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={[styles.actionButton, styles.medicationsButton]}
            onPress={() =>
              router.push(`/(profiles)/(medications)/${profileId}`)
            }
          >
            <FontAwesome5 name="pills" size={20} color={theme.text} />
            <Text style={styles.actionButtonText}>Medications</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.allergiesButton]}
            onPress={() => router.push(`/(profiles)/(allergies)/${profileId}`)}
          >
            <FontAwesome5 name="allergies" size={20} color={theme.text} />
            <Text style={styles.actionButtonText}>Allergies</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.historyButton]}
            onPress={() =>
              router.push(`/(profiles)/(medicalhistory)/${profileId}`)
            }
          >
            <FontAwesome5 name="file-medical" size={20} color={theme.text} />
            <Text style={styles.actionButtonText}>Medical History</Text>
          </Pressable>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.quickInfoSection}>
          <View style={styles.quickInfoCard}>
            <View style={styles.quickInfoHeader}>
              <FontAwesome5
                name="calendar-check"
                size={16}
                color={theme.text}
              />
              <Text style={styles.quickInfoTitle}>Created</Text>
            </View>
            <Text style={styles.quickInfoValue}>
              {new Date(profileData.created_at).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.quickInfoCard}>
            <View style={styles.quickInfoHeader}>
              <FontAwesome5 name="edit" size={16} color={theme.text} />
              <Text style={styles.quickInfoTitle}>Last Update</Text>
            </View>
            <Text style={styles.quickInfoValue}>
              {new Date(profileData.updated_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// Update the styles in the getStyles function

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingText: {
      color: theme.text,
      fontSize: 16,
      textAlign: "center",
      marginTop: 20,
    },

    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.blue,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      flex: 1,
      color: theme.textLight ? theme.textLight : theme.text,
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      textAlign: "center",
      marginRight: 30,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    profileHeaderCard: {
      alignItems: "center",
      paddingVertical: 20,
      marginBottom: 20,
    },
    profileAvatarContainer: {
      marginBottom: 10,
    },
    profileActions: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    editProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.profileActionBackground,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    editProfileText: {
      color: theme.text,
      marginLeft: 6,
      fontSize: 14,
      fontFamily: "Roboto-Medium",
    },
    profileAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.cardBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    profileName: {
      color: theme.text,
      fontSize: 24,
      fontFamily: "Roboto-Bold",
      marginBottom: 5,
    },
    profileMeta: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    metaText: {
      color: theme.text,
      fontSize: 14,
      marginLeft: 5,
    },
    metaDivider: {
      width: 1,
      height: 16,
      backgroundColor: theme.separator,
    },
    sectionCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 15,
      marginHorizontal: 15,
      marginBottom: 20,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontFamily: "Roboto-Bold",
      marginBottom: 15,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.profileActionBackground,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.7,
    },
    infoValue: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    actionButton: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    medicationsButton: {
      backgroundColor: theme.BlueIconBackground,
    },
    allergiesButton: {
      backgroundColor: theme.RedIconBackground,
    },
    historyButton: {
      backgroundColor: theme.GreenIconBackground,
    },
    actionButtonText: {
      color: theme.text,
      marginLeft: 5,
      fontSize: 12,
      fontFamily: "Roboto-Bold",
    },
    quickInfoSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
    },
    quickInfoCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 12,
      flex: 1,
      marginHorizontal: 5,
    },
    quickInfoHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    quickInfoTitle: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.7,
      marginLeft: 5,
    },
    quickInfoValue: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
    },
  });

export default ProfileScreen;
