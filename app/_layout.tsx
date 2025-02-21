import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import Constants from 'expo-constants';
import { TokenProvider } from '@/context/TokenContext';
import { UserDataProvider } from '@/context/UserDataContext';
import { View, ActivityIndicator,Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import {  BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';



SplashScreen.preventAutoHideAsync();


const fonts = {
  "Roboto-Bold": require("@/assets/fonts/RobotoSerif-Bold.ttf"),
  "Roboto-Regular": require("@/assets/fonts/RobotoSerif-Regular.ttf"),
  "Roboto-Medium": require("@/assets/fonts/RobotoSerif-Medium.ttf"),
};

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={Colors.light.tint} />
  </View>
);

const InitialLayout = () => {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const { user, isLoading: authLoading, error: authError } = useAuth0();
  const router = useRouter();

  // Handle font loading error
  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontError]);

  // Handle splash screen
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!authLoading && fontsLoaded) {
      const route = user ? '/(tabs)' : '/';
      router.replace(route);
    }
  }, [user, authLoading, fontsLoaded, router]);

  // Show loading screen while initializing
  if (!fontsLoaded || authLoading) {
    return <LoadingScreen />;
  }

  // Show error screen if something went wrong
  if (fontError || authError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>
          {fontError?.message || authError?.message}
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.light.background }
      }}
    >
      <Stack.Screen 
        name='index' 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
      <Stack.Screen 
        name='(tabs)' 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />
    </Stack>
  );
};

const RootLayout = () => {
  const domain = Constants.expoConfig?.extra?.auth0?.domain;
  const clientId = Constants.expoConfig?.extra?.auth0?.clientId;

  if (!domain || !clientId) {
    throw new Error('Auth0 configuration is missing');
  }

  return (
    <Auth0Provider domain={domain} clientId={clientId}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
        <TokenProvider>
          <UserDataProvider>
            <StatusBar animated={true} style="dark" backgroundColor='white' />
            <InitialLayout />
          </UserDataProvider>
        </TokenProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Auth0Provider>
  );
};

export default RootLayout;