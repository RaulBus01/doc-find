import { Stack } from "expo-router";

export default function AllergiesLayout() {

  return (
    <Stack
         screenOptions={{
           headerShown: false,
          
        }}
       >
         <Stack.Screen name="[id]" />
    
       </Stack>
  )
}

