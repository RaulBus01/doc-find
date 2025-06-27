import { ThemeColors } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig, ToastConfigParams } from 'toastify-react-native/utils/interfaces';
import { Ionicons } from '@expo/vector-icons';


export const createToastConfig = (theme: ThemeColors): ToastConfig => ({
  success: (props: ToastConfigParams) => {
    return (
      <View style={[styles.toastContainer, { backgroundColor: theme.background, borderColor: theme.progressColor }]}>
        <Ionicons name="checkmark-circle" size={24} color={theme.progressColor} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.toastText, { color: theme.text}]}>
            {props.text1}
          </Text>
          {props.text2 && (
            <Text style={[styles.toastSubText, {color: theme.text }]}>
              {props.text2}
            </Text>
          )}
        </View>
      </View>
    );
  },
  
  error: (props: ToastConfigParams) => {
    return (
      <View style={[styles.toastContainer, { backgroundColor: theme.background, borderColor: theme.red }]}>
        <Ionicons name="close-circle" size={24} color={theme.red} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.toastText, { color: theme.text }]}>
            {props.text1}
          </Text>
          {props.text2 && (
            <Text style={[styles.toastSubText, {color: theme.text}]}>
              {props.text2}
            </Text>
          )}
        </View>
      </View>
    );
  },
  
  info: (props: ToastConfigParams) => {
    return (
      <View style={[styles.toastContainer, { backgroundColor: theme.background, borderColor: theme.blue }]}>
        <Ionicons name="information-circle" size={24} color={theme.blue} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.toastText, { color: theme.text }]}>
            {props.text1}
          </Text>
          {props.text2 && (
            <Text style={[styles.toastSubText, { color: theme.text }]}>
              {props.text2}
            </Text>
          )}
        </View>
      </View>
    );
  },
  
  warn: (props: ToastConfigParams) => {
    return (
      <View style={[styles.toastContainer, { backgroundColor: theme.background, borderColor: theme.yellow }]}>
        <Ionicons name="warning" size={24} color={theme.yellow} style={[styles.icon]} />
        <View style={styles.textContainer}>
          <Text style={[styles.toastText, {color: theme.text}]}>
            {props.text1}
          </Text>
          {props.text2 && (
            <Text style={[styles.toastSubText, {color: theme.text }]}>
              {props.text2}
            </Text>
          )}
        </View>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 5,
    borderWidth: 1,
   
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  toastText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  toastSubText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left',
    opacity: 0.9,
  },
});

export default createToastConfig;