import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { View,Text } from "react-native";

export default function ProfileLayout() {
  const {theme} = useTheme();
  return (
    <Stack
         screenOptions={{
           headerShown: false,
           animation: "slide_from_right",
      
         }}
       >
         <Stack.Screen name="history" options={{headerTitle:"Profile History"}} />
         <Stack.Screen name="[id]" />
         <Stack.Screen name="new" options={{
          
          headerTitle:"New Profile"
         }} />
       </Stack>
  )
}


