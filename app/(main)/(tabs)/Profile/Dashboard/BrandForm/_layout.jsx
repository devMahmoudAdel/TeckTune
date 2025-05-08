import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";
export default function DashboardStack() {
  return (
    <Stack initialRouteName="[BrandForm]">
      <Stack.Screen
        name="[BrandForm]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
