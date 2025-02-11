import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from 'expo-font';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import Constants from 'expo-constants';




SplashScreen.preventAutoHideAsync();



const InitialLayout = () => {
  const [loaded, error] = useFonts({
    "Roboto-Bold": require("@/assets/fonts/RobotoSerif-Bold.ttf"),
    "Roboto-Regular": require("@/assets/fonts/RobotoSerif-Regular.ttf"),
    "Roboto-Medium": require("@/assets/fonts/RobotoSerif-Medium.ttf"),
  });

  const { user, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if ( !isLoading && loaded){
    if (user) {
      router.push('/(tabs)');
    } else {
      router.push('/');
    }
  }
  }, [user]);


  if (!loaded || isLoading) {
    return null; 
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  );
}


const RootLayout = () => {
  return (
    <Auth0Provider
      domain={Constants.expoConfig?.extra?.auth0?.domain || ''}
      clientId={Constants.expoConfig?.extra?.auth0?.clientId || ''}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>

        <InitialLayout />
      </GestureHandlerRootView>

    </Auth0Provider>
  );
};

export default RootLayout;