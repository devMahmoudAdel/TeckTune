import Home from "../Components/Home";
import ProductList from "../Components/ProductList";
import ProductDetails from "../Components/ProductDetails/ProductDetails";

import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();

export default function ProductStack() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Stack.Navigator initialRouteName="HomeS">
        <Stack.Screen
          name="HomeS"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}
