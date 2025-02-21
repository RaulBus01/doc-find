import React, { useState } from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/tabBar/TabBar";
import { Colors } from "@/constants/Colors";
import { TabBarVisibilityContext } from "@/context/TabBarContext";
import * as SplashScreen from "expo-splash-screen";


SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  return (
  
      <TabBarVisibilityContext.Provider
        value={{ isTabBarVisible, setIsTabBarVisible }}
      >
      
        <Tabs
          screenOptions={{
            headerShown: false,
            
          }}
          tabBar={(props) => (
            <TabBar {...props} IsTabBarVisible={isTabBarVisible} />
          )}
        />
      </TabBarVisibilityContext.Provider>
    
  );
}
