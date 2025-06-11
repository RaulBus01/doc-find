import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {  Pressable } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useDatabase } from "@/hooks/useDatabase";
import { MedicalHistoryEntry } from "@/database/schema";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Toast } from "toastify-react-native";
import { ThemeColors } from "@/constants/Colors";
import { getStatusColor } from "@/utils/utilsFunctions";
import { useFocusEffect } from "@react-navigation/native";
import {
  deleteMedicalHistory,
  getProfileMedicalHistoryList,
} from "@/utils/LocalDatabase";
import { useTranslation } from "react-i18next";
import { LegendList } from "@legendapp/list";


export default function MedicalHistoryScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const drizzleDB = useDatabase();
  const router = useRouter();
  const {t} = useTranslation();

  const [medicalHistoryList, setMedicalHistoryList] = useState<
    MedicalHistoryEntry[]
  >([]);

  const handleRoute = () => {
    router.push(`/(profiles)/(medicalhistory)/add?id=${id}`);
  };

  const fetchMedicalHistory = async () => {
    try {
      if (!id) {

        Toast.show({
          type: "error",
           text1: t('toast.error'),
          text2: t('medicalHistory.error'),
        });
        return;
      }

      const result = await getProfileMedicalHistoryList(
        drizzleDB,
        parseInt(id as string)
      );
      if (!result) {
         Toast.show({
          type: "error",
           text1: t('toast.error'),
          text2: t('medicalHistory.error'),
         })
        return;
      }

      setMedicalHistoryList(result || []);
    } catch (error) {
      setMedicalHistoryList([]);

       Toast.show({
        type: "error",
         text1: t('toast.error'),
        text2: t('medicalHistory.error'),
       });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedicalHistory();
    }, [])
  );

  const handleBack = () => {
    router.back();
  };

  const handleDeleteMedicalHistory = (entryId: number) => async () => {
    try {
      const result = await deleteMedicalHistory(drizzleDB, entryId);
      if (!result) {

          Toast.show({
          type: "error",
          text1: t('toast.error'),
          text2: t('medicalHistory.deleteError'),
        });
        return;
      }

     
      Toast.show({
        type: "success",
        text1: t('toast.success'),
        text2: t('medicalHistory.successDelete'),
      });
      fetchMedicalHistory();
    } catch (error) {

      Toast.show({
        type: "error",
        text1: t('toast.error'),
        text2: t('medicalHistory.deleteError'),
      });
    }
  };

  const styles = getStyles(theme);
  const { bottom, top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top }]}>
        <Text style={styles.header}>{t('medicalHistory.title')}</Text>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.textLight ? theme.textLight : theme.text}
          />
        </Pressable>
      </View>

      {/* Medical History List */}
      <LegendList
        data={medicalHistoryList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }:{item:any}) => (
          <TouchableOpacity 
          onPress={() => router.push(`/(profiles)/(medicalhistory)/edit/${item.id}?profileId=${id}`)} 
          activeOpacity={0.7}
          style={styles.historyCard}        
        >
            <View style={styles.topRow}>
              <View style={styles.titleSection}>
                <View style={styles.historyIconContainer}>
                  <MaterialIcons
                    name="medical-services"
                    size={20}
                    color="#fff"
                  />
                </View>
                <Text selectable={true} style={styles.conditionName}>{item.condition}</Text>
              </View>
              <TouchableOpacity
                onPress={handleDeleteMedicalHistory(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color={theme.red} />
              </TouchableOpacity>
            </View>

            {/* Content section */}
            <View style={styles.contentSection}>
              {/* Date row */}
              <View style={styles.dateContainer}>
                <MaterialIcons
                  name="event"
                  size={24}
                  color={theme.text}
                  style={styles.metaIcon}
                />
                <Text selectable={true} style={styles.historyDate}>
                  {item.diagnosis_date || "Unknown"}
                </Text>
              </View>

              {/* Treatment info */}
              {item.treatment ? (
                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="medication"
                    size={24}
                    color={theme.text}
                    style={styles.metaIcon}
                  />
                  <Text selectable={true} style={styles.infoText}>{item.treatment}</Text>
                </View>
              ) : null}

              {/* Notes info */}
              {item.notes ? (
                <View style={styles.infoRow}>
                  <MaterialIcons
                    name="sticky-note-2"
                    size={24}
                    color={theme.text}
                    style={styles.metaIcon}
                  />
                  <Text selectable={true} style={styles.notesText}>{item.notes}</Text>
                </View>
              ) : null}
            </View>

            {/* Bottom row with status badge */}
            <View style={styles.bottomRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(theme, item.status) },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
        style={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons
                name="medical-services"
                size={40}
                color={theme.textLight ? theme.textLight : theme.text}
              />
            </View>
            <Text style={styles.emptyText}>{t('medicalHistory.emptyText')}</Text>
            <Text style={styles.emptySubtext}>
                 {t('medicalHistory.addText')}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button to open bottom sheet */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleRoute} activeOpacity={0.7}> 
        <Ionicons name="add" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      position: "relative",
      backgroundColor: theme.progressColor,
    },
    header: {
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      color: theme.textLight ? theme.textLight : theme.text,
    },
    backButton: {
      position: "absolute",
      left: 15,
      top: 20,
      bottom: 0,
      justifyContent: "center",
      paddingHorizontal: 10,
      zIndex: 1,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      textAlign: "center",
    },
    historyCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    titleSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    historyIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.blue,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    conditionName: {
      color: theme.text,
      fontSize: 17,
      fontFamily: "Roboto-Bold",
      flex: 1,
    },
    deleteButton: {
      padding: 8,
      borderRadius: 20,
      marginLeft: 8,
    },
    contentSection: {
      marginBottom: 12,
      paddingBottom: 4,
      gap: 4,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
      marginLeft: 8,
    },
    metaIcon: {
      marginRight: 6,
      opacity: 0.7,
    },
    historyDate: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.7,
      fontFamily: "Roboto-Regular",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingTop: 6,
      marginLeft: 8,
      marginBottom: 4,
    },
    infoText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      flex: 1,
    },
    notesText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      fontStyle: "italic",
      flex: 1,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      alignSelf: "flex-end",
    },
    statusText: {
      color: "#fff",
      fontSize: 12,
      fontFamily: "Roboto-Medium",
      textTransform: "capitalize",
    },
    historyDetails: {
      flex: 1,
      paddingRight: 8,
    },
    historyMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.text,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyText: {
      color: theme.text,
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtext: {
      color: theme.text,
      fontSize: 14,
      opacity: 0.7,
      textAlign: "center",
      marginHorizontal: 40,
    },
    formContainer: {
      padding: 16,
    },
    inputRow: {
      marginBottom: 16,
    },
    notesInput: {
      height: 80,
      textAlignVertical: "top",
    },
    datePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    datePickerText: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Regular",
      marginLeft: 10,
    },
    statusContainer: {
      marginBottom: 20,
    },
    statusLabel: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Roboto-Medium",
      marginBottom: 8,
      marginLeft: 8,
    },
    statusOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    statusOption: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: "center",
      borderColor: theme.separator,
    },
    statusOptionText: {
      fontSize: 14,
      fontFamily: "Roboto-Medium",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.blue,
      borderRadius: 12,
      paddingVertical: 14,
      marginTop: 4,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Roboto-Bold",
      marginLeft: 8,
    },
    floatingButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: theme.blue,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    formTitle: {
      fontSize: 20,
      fontFamily: "Roboto-Bold",
      color: theme.text,
      marginBottom: 16,
      textAlign: "center",
    },
  });
