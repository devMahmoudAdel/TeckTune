import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

export default function ProductStack() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack>

        <Stack.Screen
          name="[...reviewList]"
          options={{ headerShown: false }}
        />
        
      </Stack>
    </>
  );
}
