import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { healthIndicators, profiles } from "@/database/schema";
import { desc, eq, sql } from "drizzle-orm";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomBottomSheetModal, {
  Ref,
} from "@/components/CustomBottomSheetModal";
import { formatDate } from "@/utils/Date";
import { healthIndicatorConfig } from "@/utils/healthIndicatorConfig";
import { useUserData } from "@/context/UserDataContext";

const HistoryProfile = () => {
  const drizzleDB = useDatabase();
  const { theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [profilesData, setProfilesData] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<Record<string, any>>({});
  const bottomSheetModalRef = useRef<Ref>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const {userId} = useUserData();


  const fetchProfiles = async () => {
    console.log("Fetching profiles");
    const profile = await drizzleDB
      .select()
      .from(profiles)
      .where(eq(profiles.auth0Id, userId as string))
      .orderBy(desc(profiles.created_at))
      .execute();
    setProfilesData(profile);

    // Fetch health indicators for all profiles
    const healthMap: Record<string, any> = {};
    for (const p of profile) {
      const health = await drizzleDB
        .select()
        .from(healthIndicators)
        .where(eq(healthIndicators.profileId, p.id))
        .execute();

      if (health && health.length > 0) {
        healthMap[p.id] = health[0];
      }
    }
    setHealthData(healthMap);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const onProfilePress = (id: string) => {
    router.push(`/(profiles)/${id}`);
  };

  const handleOpenBottomSheet = (profileId: string) => {
    setSelectedProfileId(profileId);
    bottomSheetModalRef.current?.present();
  };

  const handleDelete = useCallback(async () => {
    if (!selectedProfileId) return;

    try {
      await drizzleDB
        .delete(profiles)
        .where(eq(profiles.id, parseInt(selectedProfileId, 10)))
        .execute();
      fetchProfiles();
      bottomSheetModalRef.current?.dismiss();
      Alert.alert("Success", "Profile deleted successfully");
    } catch (error) {
      console.error("Error deleting profile:", error);
      Alert.alert("Error", "Failed to delete profile");
    }
  }, [selectedProfileId]);

  const handleAddProfile = () => {
    router.push("/(profiles)/new");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profiles</Text>
            <Text style={styles.headerSubtitle}>
              Manage your health profiles
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
            <MaterialCommunityIcons
              name="account-plus"
              size={32}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {profilesData.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="people-circle-outline"
                  size={60}
                  color={theme.text}
                />
                <Text style={styles.emptyText}>No profiles found</Text>
                <Text style={styles.emptySubtext}>
                  Create a profile to get started
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleAddProfile}
                >
                  <Text style={styles.createButtonText}>Create Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              profilesData.map((profile) => (
                <View style={styles.profileCardWrapper} key={profile.id}>
                  <TouchableHighlight
                    style={styles.profileTouchable}
                    onPress={() => onProfilePress(profile.id.toString())}
                    activeOpacity={0.8}
                    underlayColor="rgba(255,255,255,0.1)"
                  >
                    <View style={styles.profileCard}>
                      <View style={styles.profileHeader}>
                        <View style={styles.profileAvatar}>
                          <Ionicons
                            name="person"
                            size={28}
                            color={theme.text}
                          />
                        </View>
                        <View style={styles.profileInfo}>
                          <Text style={styles.profileName}>
                            {profile.fullname}
                          </Text>
                          <View style={styles.profileMetaContainer}>
                            <View style={styles.profileMeta}>
                              <FontAwesome5
                                name={
                                  profile.gender === "Male" ? "mars" : "venus"
                                }
                                size={14}
                                color={theme.text}
                              />
                              <Text style={styles.profileMetaText}>
                                {profile.gender}
                              </Text>
                            </View>
                            <View style={styles.metaSeparator} />
                            <View style={styles.profileMeta}>
                              <Ionicons
                                name="calendar-outline"
                                size={14}
                                color={theme.text}
                              />
                              <Text style={styles.profileMetaText}>
                                {profile.age} years
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.moreButton}
                          onPress={() =>
                            handleOpenBottomSheet(profile.id.toString())
                          }
                        >
                          <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color={theme.text}
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Health Indicators */}
                      {healthData[profile.id] && (
                        <View style={styles.healthIndicators}>
                          {Object.entries(healthIndicatorConfig).map(
                            ([key, config]) => (
                                <View
                                key={key}
                                style={[
                                  styles.indicator,
                                  healthData[profile.id][key] === "Yes"
                                  ? styles.indicatorActive
                                  : healthData[profile.id][key] === "I used to"
                                    ? styles.indicatorWarning
                                  : {},
                                ]}
                                >
                                <FontAwesome5
                                  name={config.icon}
                                  size={14}
                                  color={theme.text}
                                />
                                <Text style={styles.indicatorText}>
                                  {config.label}
                                </Text>
                                </View>
                            )
                          )}
                        </View>
                      )}

                      <View style={styles.profileFooter}>
                        <View style={styles.lastUpdated}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={theme.text}
                          />
                          <Text style={styles.lastUpdatedText}>
                            {formatDate(
                              new Date(profile.updated_at).toISOString()
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              ))
            )}
          </View>
        </Animated.ScrollView>

        <CustomBottomSheetModal
          onDelete={handleDelete}
          ref={bottomSheetModalRef}
        />
    
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.textlight,
    },
  
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 28,
      fontFamily: "Roboto-Bold",
    },
    headerSubtitle: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.8,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.profileActionBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      paddingBottom: 50,
      flexGrow: 1,
    },
    content: {
      padding: 16,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyText: {
      color: theme.text,
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      marginTop: 20,
    },
    emptySubtext: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.8,
      marginTop: 8,
      marginBottom: 20,
    },
    createButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: theme.tint,
      borderRadius: 25,
      marginTop: 10,
    },
    createButtonText: {
      color: theme.background,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
    },
    profileCardWrapper: {
      marginBottom: 16,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.cardBackground,
    },
    profileTouchable: {
      borderRadius: 20,
    },
    profileCard: {
      padding: 16,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.cardBackground,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      color: theme.text,
      fontSize: 18,
      fontFamily: "Roboto-Bold",
      marginBottom: 4,
    },
    profileMetaContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileMeta: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileMetaText: {
      color: theme.text,
      fontSize: 14,
      marginLeft: 4,
    },
    metaSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.separator,
      marginHorizontal: 8,
    },
    moreButton: {
      padding: 8,
      borderRadius: 20,
    },
    healthIndicators: {
      flexDirection: "row",
      marginTop: 16,
      marginBottom: 12,
    },
    indicator: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.profileActionBackground,
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginRight: 8,
    },
    indicatorActive: {
      backgroundColor: theme.RedIconBackground,
    },
    indicatorWarning: {
      backgroundColor: theme.YellowIconBackground,
    },
    indicatorText: {
      color: theme.text,
      fontSize: 12,
      marginLeft: 4,
    },
    profileFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.separator,
    },
    lastUpdated: {
      flexDirection: "row",
      alignItems: "center",
    },
    lastUpdatedText: {
      color: theme.text,
      fontSize: 12,
      opacity: 0.8,
      marginLeft: 4,
    },
    viewButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.profileActionBackground,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 15,
    },
    viewButtonText: {
      color: theme.text,
      fontSize: 12,
      marginRight: 2,
    },
  });

export default HistoryProfile;
