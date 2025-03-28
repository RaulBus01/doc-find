import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

export default function AllergiesScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16
    },
    text: {
      color: theme.text,
      fontSize: 16
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Medical History for Profile ID: {id}</Text>
    </SafeAreaView>
  );
}