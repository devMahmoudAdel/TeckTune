import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="[...ProductDetails]" options={{ headerShown: false }} />
    </Stack>
  );
}
