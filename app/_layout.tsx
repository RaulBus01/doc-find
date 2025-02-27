import React, { Suspense, useEffect} from 'react';
import { Stack, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import Constants from 'expo-constants';
import { TokenProvider } from '@/context/TokenContext';
import { UserDataProvider } from '@/context/UserDataContext';
import { View, ActivityIndicator,Text, useColorScheme } from 'react-native';
import {  BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';


SplashScreen.preventAutoHideAsync();



const fonts = {
  "Roboto-Bold": require("@/assets/fonts/RobotoSerif-Bold.ttf"),
  "Roboto-Regular": require("@/assets/fonts/RobotoSerif-Regular.ttf"),
  "Roboto-Medium": require("@/assets/fonts/RobotoSerif-Medium.ttf"),
};



const InitialLayout = () => {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const { user, isLoading: authLoading, error: authError } = useAuth0();
  const router = useRouter();
  const {theme} = useTheme();
  const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={theme.tint} />
    </View>
  );
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
        contentStyle: { backgroundColor: theme.background }
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
      <Stack.Screen
        name='(profiles)'
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  const DATABASE_NAME='tasks';
  const domain = Constants.expoConfig?.extra?.auth0?.domain;
  const clientId = Constants.expoConfig?.extra?.auth0?.clientId;
  const expoDatabase = openDatabaseSync(DATABASE_NAME);
  const database = drizzle(expoDatabase);
  const {success,error} = useMigrations(database,migrations);


  if (!domain || !clientId) {
    throw new Error('Auth0 configuration is missing');
  }
  const colorScheme = useColorScheme();

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
    <ThemeProvider>
    <Auth0Provider domain={domain} clientId={clientId}>
      <SQLiteProvider databaseName={DATABASE_NAME} options={{enableChangeListener:true}}
        useSuspense
      >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
        <TokenProvider>
          <UserDataProvider>
            <StatusBar 
              animated={true} 
              style={colorScheme === 'dark' ? "light" : "dark"} 
              backgroundColor={colorScheme === 'dark' ? 'black' : 'white'} 
            />
            <InitialLayout />
          </UserDataProvider>
        </TokenProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      </SQLiteProvider>
    </Auth0Provider>
    </ThemeProvider>
    </Suspense>
  );
};

export default RootLayout;