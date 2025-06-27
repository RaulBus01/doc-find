import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const TermsPage = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { top, bottom } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.headerContainer}>
        <Ionicons name="document-text" size={28} color={theme.textLight ? theme.textLight : theme.text} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Welcome to Medora!</Text>
        <Text style={styles.sectionText}>
          These are dummy terms and conditions for demonstration purposes only.
        </Text>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.sectionText}>
          By using this app, you agree to these terms and conditions.
        </Text>
        <Text style={styles.sectionTitle}>2. Use of Service</Text>
        <Text style={styles.sectionText}>
          You may use Medora for personal, non-commercial purposes only.
        </Text>
        <Text style={styles.sectionTitle}>3. Privacy</Text>
        <Text style={styles.sectionText}>
          We respect your privacy. No real data is collected in this demo.
        </Text>
        <Text style={styles.sectionTitle}>4. Contact</Text>
        <Text style={styles.sectionText}>
          For questions, email us at support@medora.com.
        </Text>
        <Text style={styles.footerText}>Last updated: 2025-06-01</Text>
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

export default TermsPage;