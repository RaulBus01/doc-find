import { Stack } from "expo-router";

export default function MedicalHistoryLayout() {

  return (
    <Stack
         screenOptions={{
           headerShown: false,
         
      
         }}
       >
         <Stack.Screen name="[id]" />
         <Stack.Screen name="add" />
    
       </Stack>
  )
}

