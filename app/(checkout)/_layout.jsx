import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack initialRouteName="Checkout">
      <Stack.Screen name="Checkout" options={{ headerShown: false }} />
    </Stack>
  );
}
