import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";
export default function DashboardStack() {
  return (
    <Stack initialRouteName="[CategoryForm]">
      <Stack.Screen
        name="[CategoryForm]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
