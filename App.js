import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import AuthFlow from "./navigation/AuthFlow";
import { AuthProvider, AuthContext } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <AuthFlow />
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}
