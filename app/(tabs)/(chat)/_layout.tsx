import { Stack } from "expo-router";


export default function ChatLayout() {
  return (
    <Stack

      screenOptions={{
        headerShown: false,
       
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="history" />
      
    </Stack>
  );
}
