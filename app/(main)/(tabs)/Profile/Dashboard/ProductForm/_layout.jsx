import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";
export default function DashboardStack() {
  return (
    <Stack initialRouteName="[ProductForm]">
      <Stack.Screen
        name="[ProductForm]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
