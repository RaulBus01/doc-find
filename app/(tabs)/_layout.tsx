import React, { useState } from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/tabBar/TabBar";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import * as SplashScreen from "expo-splash-screen";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";


SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const database = useSQLiteContext();
  useDrizzleStudio(database);
  return (
  
      <TabBarVisibilityContext.Provider
        value={{ isTabBarVisible, setIsTabBarVisible }}
      >
      
        <Tabs
          screenOptions={{
            headerShown: false,
            animation: "fade",
            
          }}
          tabBar={(props) => (
            <TabBar {...props} IsTabBarVisible={isTabBarVisible} />
          )}
        />
      </TabBarVisibilityContext.Provider>
    
  );
}
