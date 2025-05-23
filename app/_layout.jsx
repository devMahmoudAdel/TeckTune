import { AuthProvider } from "../context/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(checkout)" options={{ headerShown: false }} />
        <Stack.Screen name="NoInternet" options={{ headerShown: false }} />
        <Stack.Screen
          name="restricted-modal"
          options={{
            headerShown: false,
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
