import { Stack } from "expo-router";

export default function MedicalHistoryLayout() {

  return (
    <Stack
         screenOptions={{
           headerShown: false,
            animation: "slide_from_right",
      
         }}
       >
         <Stack.Screen name="[id]" />
         <Stack.Screen name="add" />
          <Stack.Screen name="edit/[id]"/>
    
       </Stack>
  )
}

