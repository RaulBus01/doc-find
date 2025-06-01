import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const AboutPage = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();

  return (
     <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.headerContainer}>
        <Ionicons name="information-circle" size={28} color={theme.textLight ? theme.textLight : theme.text} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>About Medora</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Welcome to Medora!</Text>
        <Text style={styles.sectionText}>
          Medora is your personal health assistant, helping you manage your medical profiles, track your health indicators, and chat with our AI assistant for instant support.
        </Text>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.sectionText}>
          - Create and manage multiple health profiles{'\n'}
          - Track allergies, medications, and medical history{'\n'}
          - Get insights and summaries about your health{'\n'}
          - Chat with our AI for quick answers and advice{'\n'}
        </Text>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.sectionText}>
          For support or feedback, email us at support@medora.com.
        </Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
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
    headerContainer: {
   flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.blue,
      paddingHorizontal: 40,
      paddingTop: 42,
      paddingBottom: 20,
      borderBottomLeftRadius: 45,
      borderBottomRightRadius: 45,
    },
    headerIcon: {
      marginRight: 10,
    },
    headerTitle: {
      fontSize: 22,
      fontFamily: 'Roboto-Bold',
      color: theme.textLight ? theme.textLight : theme.text,
      textAlign: 'center',
    },
    content: {
      top: 20,
      padding: 24,
      gap: 18,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Roboto-Bold',
      color: theme.text,
      marginBottom: 6,
    },
    sectionText: {
      fontSize: 15,
      fontFamily: 'Roboto-Regular',
      color: theme.text,
      marginBottom: 10,
      lineHeight: 22,
    },
    footerText: {
      fontSize: 13,
      color: theme.text,
      opacity: 0.5,
      textAlign: 'center',
      marginTop: 30,
    },
  });

export default AboutPage;