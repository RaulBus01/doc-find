import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Auth0Provider } from 'react-native-auth0';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "Roboto-Bold": require("@/assets/fonts/RobotoSerif-Bold.ttf"),
        "Roboto-Regular": require("@/assets/fonts/RobotoSerif-Regular.ttf"),
        "Roboto-Medium": require("@/assets/fonts/RobotoSerif-Medium.ttf"),
    });

    useEffect(() => {
        if (error || loaded) {
            SplashScreen.hideAsync();
        }
    }, [error, loaded]);

    if (!loaded && !error) {
        return null;
    }
    console.log(Constants.expoConfig?.extra?.auth0?.domain);
    console.log(Constants.expoConfig?.extra?.auth0?.clientId);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <Auth0Provider
                    domain={Constants.expoConfig?.extra?.auth0?.domain || ''}
                    clientId={Constants.expoConfig?.extra?.auth0?.clientId || ''}
                >
                    <Stack>
                        <Stack.Screen 
                            name="(auth)" 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="(tabs)" 
                            options={{ headerShown: false }} 
                        />
                    </Stack>
                </Auth0Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}