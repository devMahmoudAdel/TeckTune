import { Stack } from "expo-router";

export default function AboutStack() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="[MemberDetails]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
