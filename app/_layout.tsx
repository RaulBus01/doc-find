import React, { Suspense, useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Auth0Provider} from "react-native-auth0";
import Constants from "expo-constants";
import { View, ActivityIndicator, Text, useColorScheme } from "react-native";
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
SplashScreen.preventAutoHideAsync();

const fonts = {
  "Roboto-Bold": require("@/assets/fonts/RobotoSerif-Bold.ttf"),
  "Roboto-Regular": require("@/assets/fonts/RobotoSerif-Regular.ttf"),
  "Roboto-Medium": require("@/assets/fonts/RobotoSerif-Medium.ttf"),
};

const InitialLayout = () => {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const { isAuthenticated } = useAuth();
  const { theme, isDark } = useTheme();
  const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.background} />
    </View>
  );
  useEffect(() => {
    if (!isAuthenticated) {
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{fontError?.message}</Text>
      </View>
    );
  }

  return (
    <>
      <ToastManager
        theme={isDark ? "dark" : "light"}
        showProgressBar={false}
        style={{ width: "100%", height: "100px", elevation: 0 }}
        animationIn={"fadeIn"}
        animationOut="fadeOut"
        animationStyle={"upInUpOut"}
      />
      <StatusBar animated={true} backgroundColor="transparent" style="auto" />
      <Stack

        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
  
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(profiles)"
          options={{
            headerShown: false,
            animation: "slide_from_left",
          }}
        />
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

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <ThemeProvider>
        <Auth0Provider domain={domain} clientId={clientId}>
          <AuthProvider>
            <PowerSyncContext.Provider value={powersync}>
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
            </PowerSyncContext.Provider>
          </AuthProvider>
        </Auth0Provider>
      </ThemeProvider>
    </Suspense>
  );
};

export default RootLayout;
