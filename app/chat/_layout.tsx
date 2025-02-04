import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
