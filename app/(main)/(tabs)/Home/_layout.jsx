import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

export default function ProductStack() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack initialRouteName="index" >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductList"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reviewList"
          options={{ headerShown: false }}
        />
        
      </Stack>
    </>
  );
}
