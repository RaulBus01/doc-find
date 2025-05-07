import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
import { healthIndicatorConfig } from "@/utils/HealthIndicatorInterface";
import { useUserData } from "@/context/UserDataContext";
import { ThemeColors } from "@/constants/Colors";
import { deleteProfile, getProfileHealthIndicators, getProfiles } from "@/utils/LocalDatabase";

const HistoryProfile = () => {
  const drizzleDB = useDatabase();
  const { theme } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
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
    const profiles = await getProfiles(drizzleDB,userId as string);
    if (!profiles) {
      setProfilesData([]);
      return;
    }
    setProfilesData(profiles);
    // Fetch health indicators for all profiles
    const healthMap = await getProfileHealthIndicators(drizzleDB,profiles);
    setHealthData(healthMap);
  };

  useEffect(() => {
    if (userId) {
      fetchProfiles();
    }
  }, [userId]);

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
      await deleteProfile(drizzleDB,parseInt(selectedProfileId));
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
    <SafeAreaView style={[styles.container, { paddingBottom: bottom }]} edges={["bottom"]}>
  
      <View style={[styles.header, { paddingTop: top + 10 }]}>
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
            color={theme.textLight || '#fff'}
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
                <TouchableOpacity
                  style={styles.profileTouchable}
                  onPress={() => onProfilePress(profile.id.toString())}
                 
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
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </Animated.ScrollView>

      <CustomBottomSheetModal
        index={0}
        onDelete={handleDelete}
        ref={bottomSheetModalRef}
      />
  
  </SafeAreaView>
  );
};

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.blue,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    headerTitle: {
      color: theme.textLight ? theme.textLight : theme.text,
      fontSize: 28,
      fontFamily: "Roboto-Bold",
    },
    headerSubtitle: {
      color: theme.textLight ? theme.textLight : theme.text,
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
      backgroundColor: theme.profileActionBackground,
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
      backgroundColor: theme.GreenIconBackground,
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
