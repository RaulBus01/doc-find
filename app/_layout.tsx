import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import TabBar from '@/components/tabBar/TabBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabBarVisibilityContext } from '@/context/TabBarContext';

export default function TabLayout() {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [loaded, error] = useFonts({
    'Roboto-Bold': require('@/assets/fonts/RobotoSerif-Bold.ttf'),
    'Roboto-Regular': require('@/assets/fonts/RobotoSerif-Regular.ttf'),
    'Roboto-Medium': require('@/assets/fonts/RobotoSerif-Medium.ttf'),
  });

  useEffect(() => {
    if (error || loaded) {
      console.log(error, loaded);
    }
  }, [error, loaded]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
      
        <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
          <StatusBar backgroundColor={Colors.light.tint} barStyle={'dark-content'} />
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => (
              <TabBar {...props} IsTabBarVisible={isTabBarVisible} />
            )}
          />
        </TabBarVisibilityContext.Provider>
  
    </SafeAreaProvider>
    </GestureHandlerRootView>
    
  );
}