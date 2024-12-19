import React, { useEffect } from 'react'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
 

      screenOptions={({ route }) => ({

        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          
          const routeName = route.name.split('/').pop();
            

          switch (routeName) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'chat':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
                iconName = 'alert-circle';
                break;
          }

            return <Ionicons name={iconName} size={size} color={color}  style={{alignContent: 'center', justifyContent: 'center' }} />;
        },

        
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarPosition: 'bottom',
        tabBarShowLabel: false,
        tabBarStyle: {
            width: '98%',
            height: '8%',
            margin: '1%',
            borderRadius: 25,
            backgroundColor: 'white',
            position: 'absolute',
            },
        tabBarIconStyle: {
            width: '100%',
            height: '100%',
            
            },
       headerShadowVisible: false,
       
      })}
    />
  );
}