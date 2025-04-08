import { Stack } from "expo-router";

export default function SignUpLayout() {
  return (
    <Stack>
      <Stack.Screen name="Step1" options={{ headerShown: false }} />
      <Stack.Screen name="Step2" options={{ headerShown: false }} />
      <Stack.Screen name="Step3" options={{ headerShown: false }} />
    </Stack>
  );
}
