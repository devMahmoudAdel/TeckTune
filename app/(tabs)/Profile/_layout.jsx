import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="About" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="MyProfile" options={{ headerShown: false }} />
      <Stack.Screen name="Help" options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="Settings" options={{ headerShown: false }} />
    </Stack>
  );
}
