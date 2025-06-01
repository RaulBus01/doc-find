import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AboutLayout = () => {
  return (
      <Stack
           screenOptions={{
             headerShown: false,
           }}
         >
           <Stack.Screen name="about" options={{ headerShown: false }} />
            <Stack.Screen name="terms" options={{ headerShown: false }} />
     
      
         </Stack>
    )
}

export default AboutLayout