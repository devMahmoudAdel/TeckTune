import { AuthProvider } from "../context/AuthContext";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen
          name="restricted-modal"
          options={{
            headerShown: false,
            // the modal indication
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
