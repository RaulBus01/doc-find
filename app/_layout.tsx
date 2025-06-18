import React, { Suspense, useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { Auth0Provider } from "react-native-auth0";
import Constants from "expo-constants";
import { View, ActivityIndicator, Text } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import ToastManager from "toastify-react-native";
import "react-native-get-random-values";

import { PowerSyncContext } from "@powersync/react-native";
import { powersync } from "@/powersync/system";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import { Entypo, FontAwesome, FontAwesome5, FontAwesome6, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { initI18n } from "@/i18n";

import { createToastConfig } from "@/utils/Toast";

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {

  const [appIsReady, setAppIsReady] = React.useState(false);
  const [fontError, setFontError] = React.useState<Error | null>(null);
  
  const { theme } = useTheme();

  useEffect(() => {
    async function prepareApp() {
      try {
     
        const promises = [
          Font.loadAsync({
            "Roboto-Bold": require("@/assets/fonts/RobotoSerif-Bold.ttf"),
            "Roboto-Regular": require("@/assets/fonts/RobotoSerif-Regular.ttf"),
            "Roboto-Medium": require("@/assets/fonts/RobotoSerif-Medium.ttf"),
            ...Ionicons.font,
            ...MaterialCommunityIcons.font,
            ...Entypo.font,
            ...FontAwesome.font,
            ...FontAwesome5.font,
            ...FontAwesome6.font,
            ...Fontisto.font,
          }),
          initI18n(),
        ];

     
        await Promise.all(promises);

      } catch (e: any) {
      
        setFontError(e);
        console.error("Failed to load app resources:", e);
      } finally {
       
        setAppIsReady(true);
      
        SplashScreen.hideAsync();
      }
    }

    prepareApp();
  }, []);

  if (!appIsReady) {
    return null; 
  }

  if (fontError) {

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Error loading fonts: {fontError.message}</Text>
      </View>
    );
  }

  const toastConfig = createToastConfig(theme);

  return (
    <>
      <ToastManager
        config={toastConfig}
        position="top"
        iconSize={24}
        useModal={false}
      />
      <StatusBar animated={true} backgroundColor="transparent" style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(profiles)" options={{ animation: "slide_from_left" }} />
      </Stack>
    </>
  );
};

const RootLayout = () => {
  const DATABASE_NAME = "tasks";
  const domain = Constants.expoConfig?.extra?.auth0?.domain;
  const clientId = Constants.expoConfig?.extra?.auth0?.clientId;
  const expoDatabase = openDatabaseSync(DATABASE_NAME);
  const database = drizzle(expoDatabase);
  const { success, error } = useMigrations(database, migrations);

  if (!domain || !clientId) {
    throw new Error("Auth0 configuration is missing");
  }
   const queryClient = React.useMemo(() => new QueryClient(), [])

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <ThemeProvider>
        <Auth0Provider domain={domain} clientId={clientId}>
          <AuthProvider>
            <PowerSyncContext.Provider value={powersync}>
               <QueryClientProvider client={queryClient}>
              <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense
              >
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <InitialLayout />
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </SQLiteProvider>
              </QueryClientProvider>
            </PowerSyncContext.Provider>
          </AuthProvider>
        </Auth0Provider>
      </ThemeProvider>
    </Suspense>
  );
};

export default RootLayout;
