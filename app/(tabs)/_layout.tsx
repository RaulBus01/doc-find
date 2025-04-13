import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/tabBar/TabBar";
import { TabBarVisibilityProvider } from "@/context/TabBarContext";
import * as SplashScreen from "expo-splash-screen";
import { useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";


SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const database = useSQLiteContext();
  useDrizzleStudio(database);
  
  return (
    <TabBarVisibilityProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
        tabBar={(props) => (
          <TabBar {...props}  />
        )}
      />
    </TabBarVisibilityProvider>
  );
}
