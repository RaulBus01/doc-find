import { useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function ProfileLayout() {

  return (
    <Stack
         screenOptions={{
           headerShown: false,
        
         }}
       >
         <Stack.Screen name="history" options={{headerTitle:"Profile History"}} />
         <Stack.Screen name="[id]" />
          <Stack.Screen name="(edit)/[id]" />
         <Stack.Screen name="new" options={{
          
          headerTitle:"New Profile"
         }} />
          <Stack.Screen name="(medications)"  options={{animation:"slide_from_bottom"}}/>
          <Stack.Screen name="(medicalhistory)" options={{animation:"slide_from_bottom"}}/>
          <Stack.Screen name="(allergies)" options={{animation:"slide_from_bottom"}}/>
         
       </Stack>
  )
}


