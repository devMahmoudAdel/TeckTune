import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import AuthStack from "./navigation/AuthStack";
import MainAppNavigator from "./navigation/MainNav";

import { AuthProvider, AuthContext } from "./context/AuthContext";


export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <MainAppNavigator />
      </NavigationContainer>
    </>
  );  
}
