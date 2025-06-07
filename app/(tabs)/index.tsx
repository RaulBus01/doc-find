import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/Colors";

import { TabBarVisibilityContext } from "@/context/TabBarContext";
import { useTranslation } from "react-i18next";
import {
  OfflineIndicator,
  useOfflineStatus,
} from "@/components/OfflineIndicator";
import { powersync, setupPowerSync } from "@/powersync/system";

import { getPowerSyncChats, getPowerSyncChatsCount } from "@/powersync/utils";
import { useAuth } from "@/hooks/useAuth";
import { FlashList } from "@shopify/flash-list";
import { Toast } from "toastify-react-native";

const Home = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { user } = useAuth();

  const RETRIVE_CHATS = 5;
  const [error, setError] = useState<Error | null>(null);
  const { isTabBarVisible, setIsTabBarVisible } = useContext(TabBarVisibilityContext);
  const { t } = useTranslation();
  const isOffline = useOfflineStatus();

  const { data: powerSyncChats = [], isLoading: powerSyncLoading } = getPowerSyncChats(user?.sub || '', RETRIVE_CHATS);
  const { count: chatCountFromSync, isLoading: powerSyncCountLoading } = getPowerSyncChatsCount(user?.sub || '');

  useEffect(() => {
    const initializePowerSync = async () => {
      try {
        await setupPowerSync().then(() => {
        });
      } catch (error) {
        Toast.error("Error");
      }
    };

    initializePowerSync();
  }, []);




  useFocusEffect(
    useCallback(() => {
      if (!isTabBarVisible) {
        setIsTabBarVisible(true);
      }
    }, [isTabBarVisible, setIsTabBarVisible])
  );

  const handleProfileRouting = (path: string) => {
    router.push(`/(profiles)/${path}`);
  };

  const handleChatRouting = (path: string) => {
    router.push(`/(tabs)/(chat)/${path}`);
  };

  const handleSymptom = (symptom: string) => {
    router.push(`/(tabs)/(chat)/new?symptom=${symptom}`);
  };

  const ProfilesComponent = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {t("homePage.ProfileSectionTitle")}
        </Text>
        <View style={styles.profileCards}>
          <TouchableOpacity
            style={[
              styles.profileCard,
              { backgroundColor: theme.progressColor },
            ]}
            onPress={() => handleProfileRouting("new")}
          >
            <View style={styles.profileCardIcon}>
              <Ionicons name="person-add" size={24} color="white" />
            </View>
            <Text style={styles.profileCardText}>
              {t("homePage.ProfileCardText")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: theme.blue }]}
            onPress={() => handleProfileRouting("history")}
          >
            <View style={styles.profileCardIcon}>
              <Ionicons name="people" size={24} color="white" />
            </View>
            <Text style={styles.profileCardText}>
              {t("homePage.ProfileViewText")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SymptomsComponent = () => {
    const symptoms = [
      { name: t("homePage.cough"), icon: "😷", color: theme.progressColor },
      { name: t("homePage.headache"), icon: "🤕", color: theme.red },
      { name: t("homePage.fever"), icon: "🤒", color: theme.blue },
    ];

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {t("homePage.SymptomsSectionTitle")}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.symptomsScroll}
        >
          {symptoms.map((symptom, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.symptomCard, { backgroundColor: symptom.color }]}
              onPress={() => handleSymptom(symptom.name)}
            >
              <Text style={styles.symptomIcon}>{symptom.icon}</Text>
              <Text style={styles.symptomText}>{symptom.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("homePage.morning");
    if (hour < 18) return t("homePage.afternoon");
    return t("homePage.evening");
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: bottom }]}
      edges={["bottom"]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeftSection}>
            <View
              style={[
                styles.profileContainer,
                {
                  backgroundColor: isOffline ? theme.red : theme.progressColor,
                },
              ]}
            >
              <Image
                source={{ uri: user?.picture as string }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString(t("date"), {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>


        <View style={styles.headerBottomRow}>
          <Text style={styles.greetingText}>
            {t("homePage.good")} {getTimeOfDay()},{" "}
            {user?.givenName && user?.familyName
              ? `${user.givenName} ${user.familyName}`
              : user?.nickname}{" "}
            👋
          </Text>
        </View>
        <OfflineIndicator />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={styles.scrollContainer}
      >
        <ProfilesComponent />
        <SymptomsComponent />

        {/* AI Chatbot Section */}
        <View style={[styles.sectionContainer, styles.lastSection]}>
          <Text style={styles.sectionTitle}>
            {t("homePage.chatSectionTitle")}{" "}
          </Text>
          <View style={styles.chatbotCard}>
            <View style={styles.chatbotDetails}>
              {!powerSyncCountLoading ? (
                <>
                  <Text style={styles.chatbotCount}>{chatCountFromSync}+</Text>
                  <Text style={styles.chatbotLabel}>
                    {t("homePage.chatCountTotalChats")}
                  </Text>
                </>
              ) : (
                <Text style={styles.chatbotCount}>
                  {t("homePage.chatCountNoChats")}
                </Text>
              )}
              <View style={styles.chatbotStatusRow}>
                <View style={styles.chatbotStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusLabel}>
                    {t("homePage.chatStatusText")}
                  </Text>
                </View>
              </View>
              <View style={styles.chatbotButtons}>
                <TouchableOpacity
                  style={styles.startChatButton}
                  onPress={() => handleChatRouting("new")}
                >
                  <Ionicons name="add-circle" size={18} color="white" />
                  <Text style={styles.startChatText}>
                    {t("homePage.chatStartText")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.startChatButton}
                  onPress={() => handleChatRouting("history")}
                >
                  <Ionicons name="chatbubbles" size={18} color="white" />
                  <Text style={styles.startChatText}>
                    {t("homePage.chatAllChatsText")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.chatbotImageContainer}>
              <View style={styles.chatbotImage}>
                <Ionicons name="chatbubble-ellipses" size={40} color="white" />
              </View>
            </View>
          </View>

          {/* Recent Chats */}
          <View style={styles.recentChatsContainer}>
            <Text style={styles.recentChatsTitle}>
              {t("homePage.chatRecentText")}
            </Text>
            {powerSyncLoading ? (
              <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.progressColor} />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {t("homePage.chatErrorText")}
              </Text>
              </View>
            ) : powerSyncChats && !powerSyncCountLoading ? (
              <FlashList
              data={powerSyncChats}
              keyExtractor={(chat) => chat.id}
              estimatedItemSize={65}
              renderItem={({ item: chat }) => (
                <TouchableOpacity
                style={styles.recentChatItem}
                onPress={() => handleChatRouting(chat.id)}
                >
                <View style={styles.chatIconContainer}>
                  <Ionicons
                  name="chatbubble-ellipses"
                  size={20}
                  color="white"
                  />
                </View>
        
                <View style={styles.chatItemContent}>
                  <Text style={styles.chatItemTitle} numberOfLines={1}>
                  {chat.title}
                  </Text>
                  <Text style={styles.chatItemDate}>
                  {new Date(chat.created_at).toLocaleDateString()}
                  </Text>
                </View>
                </TouchableOpacity>
              )}
              />
            ) : (
              <Text style={styles.noChatsText}>
              {t("homePage.chatEmptyText")}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
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
      backgroundColor: theme.blue,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    headerLeftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    headerBottomRow: {
      paddingHorizontal: 5,
    },
    greetingText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.textLight ? theme.textLight : "white",
    },
    profileContainer: {
      height: 40,
      width: 40,
      borderRadius: 50,
      padding: 3,
      backgroundColor: theme.avatarBackground,
      marginRight: 12,
    },

    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: 38,
    },
    dateContainer: {
      flex: 1,
      alignItems: "center",
    },
    dateText: {
      color: theme.textLight ? theme.textLight : theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      fontWeight: "500",
    },
    notifButton: {
      height: 40,
      width: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    greetingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 10,
    },

    moreButton: {
      height: 30,
      width: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContainer: {
      flex: 1,
      marginTop: 10,
    },
    sectionContainer: {
      marginBottom: 25,
      paddingHorizontal: 20,
    },
    lastSection: {
      marginBottom: 80,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      marginBottom: 15,
    },
  
    profileCards: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    profileCard: {
      width: "48%",
      borderRadius: 15,
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      height: 120,
    },

    profileCardIcon: {
      marginBottom: 10,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.pressedBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    profileCardText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },

    symptomsScroll: {
      flexDirection: "row",
    },
    symptomCard: {
      width: 95,
      height: 100,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    symptomIcon: {
      fontSize: 32,
      marginBottom: 10,
    },
    symptomText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
 
    chatsScroll: {
      flexDirection: "row",
    },
    chatCard: {
      width: 130,
      height: 130,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      padding: 15,
      marginRight: 15,
    },
    chatCardText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
      marginTop: 10,
      textAlign: "center",
    },
    errorContainer: {
      padding: 20,
      alignItems: "center",
    },
    errorText: {
      color: "#F44336",
      fontSize: 14,
    },
 
    insightsScroll: {
      flexDirection: "row",
    },
    insightCard: {
      width: 150,
      height: 180,
      borderRadius: 15,
      marginRight: 15,
      padding: 15,
    },
    insightHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    insightTitle: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    insightValue: {
      color: "white",
      fontSize: 32,
      fontWeight: "bold",
      marginTop: 10,
    },
    insightSubtext: {
      color: "white",
      fontSize: 12,
      opacity: 0.7,
    },
    graphContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    heartRateGraph: {
      width: "100%",
      height: 60,
      borderColor: "rgba(255,255,255,0.5)",
      borderWidth: 1,
      borderRadius: 5,
    },
    barGraphContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 60,
      marginTop: 10,
    },
    bar: {
      width: 15,
      backgroundColor: "rgba(255,255,255,0.7)",
      borderRadius: 3,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 15,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#444",
      marginHorizontal: 3,
    },
    activeDot: {
      backgroundColor: "white",
    },

    timeText: {
      fontSize: 11,
      color: "#888",
      marginTop: 3,
    },
    arrowButton: {
      marginLeft: 10,
    },
    cancelledConsultations: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
    },
    cancelledText: {
      fontSize: 12,
      color: "#F44336",
      marginLeft: 5,
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "auto",
    },
    seeAllText: {
      fontSize: 12,
      color: "white",
      marginRight: 3,
    },
  
    chatbotCard: {
      backgroundColor: theme.progressColor,
      borderRadius: 15,
      padding: 15,
      flexDirection: "row",
    },
    chatbotDetails: {
      flex: 1,
    },
    chatbotCount: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textLight ? theme.textLight : theme.text,
    },
    chatbotLabel: {
      fontSize: 12,
      color: theme.textLight ? theme.textLight : theme.text,
      opacity: 0.8,
    },
    chatbotStatusRow: {
      flexDirection: "row",
      marginTop: 15,
      marginBottom: 15,
    },
    chatbotStatus: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.textLight ? theme.textLight : theme.text,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      marginRight: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.lightGreen,
      marginRight: 5,
    },
    statusLabel: {
      fontSize: 10,
      color: theme.textDark ? theme.textDark : theme.text,
    },
    chatbotButtons: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    },

    chatbotImageContainer: {
      position: "absolute",
      right: 20,
      top: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    chatbotImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.pressedBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    floatingButton: {
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#333",
      justifyContent: "center",
      alignItems: "center",
    },
    recentChatsContainer: {
      backgroundColor: theme.blue,
      borderRadius: 15,
      padding: 15,
      marginTop: 20,
    },
    recentChatsTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textLight ? theme.textLight : theme.text,
      marginBottom: 15,
    },
    loadingContainer: {
      padding: 20,
      alignItems: "center",
    },
    recentChatItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.pressedBackground,
      borderRadius: 18,
      paddingHorizontal: 10,
      paddingVertical: 12,
      marginBottom: 10,
    },
    chatIconContainer: {
      width: 30,
      height: 30,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      backgroundColor: theme.pressedBackground,
    },
    chatItemContent: {
      flex: 1,
    },
    chatItemTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.textLight ? theme.textLight : theme.text,
    },
    chatItemDate: {
      fontSize: 12,
      color: theme.textLight ? theme.textLight : theme.text,
      marginTop: 2,
    },
    noChatsText: {
      color: theme.textLight ? theme.textLight : theme.text,
      textAlign: "center",
      padding: 15,
    },
    startChatButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 10,
    },
    startChatText: {
      fontSize: 12,
      color: "white",
      fontWeight: "600",
      marginLeft: 5,
    },
  });

export default Home;
