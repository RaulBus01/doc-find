import React, { useState } from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/tabBar/TabBar";
import { StatusBar } from "react-native";
import { Colors } from "@/constants/Colors";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import * as SplashScreen from "expo-splash-screen";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
    <ProtectedRoute>
      <TabBarVisibilityContext.Provider
        value={{ isTabBarVisible, setIsTabBarVisible }}
      >
        <StatusBar
          backgroundColor={Colors.light.tint}
          barStyle={"dark-content"}
        />
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={(props) => (
            <TabBar {...props} IsTabBarVisible={isTabBarVisible} />
          )}
        />
      </TabBarVisibilityContext.Provider>
    </ProtectedRoute>
  );
}
