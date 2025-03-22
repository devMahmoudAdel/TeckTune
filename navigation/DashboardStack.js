import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
// import Dashboard from "../Components/Dashboard/Dashboard
import { View, Text } from "react-native";
import React from "react";

import Dashboard from "../Components/Dashboard/Dashboard";
import AdminProducts from "../Components/Dashboard/AdminProducts";
import AdminUsers from "../Components/Dashboard/AdminUsers";

import AdminOrders from "../Components/Dashboard/AdminOrders";
import AdminCategories from "../Components/Dashboard/AdminCategories";
import AdminBrands from "../Components/Dashboard/AdminBrands";
import Notificationn from "../Components/Dashboard/Notificationn";
import ProductForm from "../Components/Dashboard/ProductForm";

export default function DashboardStack() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminProducts"
        component={AdminProducts}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminOrders"
        component={AdminOrders}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminCategories"
        component={AdminCategories}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminBrands"
        component={AdminBrands}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notificationn"
        component={Notificationn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductForm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
