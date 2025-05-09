// import { createStackNavigator } from "@react-navigation/stack";
import { Stack } from "expo-router";
// const Stack = createStackNavigator();
// import Dashboard from "../Components/Dashboard/Dashboard
import { View, Text } from "react-native";
import React from "react";

// import Dashboard from "../Components/Dashboard/Dashboard";
// import AdminProducts from "../Components/Dashboard/AdminProducts";
// import UsersList from "../Components/Dashboard/UsersList";

// import AdminOrders from "../Components/Dashboard/AdminOrders";
// import AdminCategories from "../Components/Dashboard/AdminCategories";
// import AdminBrands from "../Components/Dashboard/AdminBrands";
// import Notificationn from "../Components/Dashboard/Notificationn";
// import ProductForm from "../Components/Dashboard/ProductForm";

export default function DashboardStack() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="AdminProducts" options={{ headerShown: false }} />
      <Stack.Screen name="UsersList" options={{ headerShown: false }} />
      <Stack.Screen name="AdminOrders" options={{ headerShown: false }} />
      <Stack.Screen name="AdminCategories" options={{ headerShown: false }} />
      <Stack.Screen name="AdminBrands" options={{ headerShown: false }} />
      <Stack.Screen name="Notificationn" options={{ headerShown: false }} />
      <Stack.Screen name="ProductForm" options={{ headerShown: false }} />
      <Stack.Screen name="CategoryForm" options={{ headerShown: false }} />
      <Stack.Screen name="BrandForm" options={{ headerShown: false }} />
    </Stack>
  );
}
