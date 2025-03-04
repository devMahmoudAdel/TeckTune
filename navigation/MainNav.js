import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import components & Screens
import Cart from "../Components/Cart";
import Checkout from "../Components/Checkout";
import Search from "../Components/Wishlist";
import Wishlist from "../Components/Wishlist";
import { use } from "react";
// import Splash from "../Components/Splash";

// import Icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

// import navigators
import ProductStack from "./ProductStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: "#ffffff",
    height: 50,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    paddingVertical: "auto",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
};

export default function MainAppNavigator() {
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);
  // }, []);
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        // component={isLoading ? Splash : ProductStack}
        component={ProductStack}
        options={{
          // tabBarStyle: {
          //   display: isLoading ? "none" : "flex",
          // },

          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <AntDesign
                name="home"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Wishlist}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons
                name="favorite-border"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <AntDesign
                name="shoppingcart"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                name="person"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
