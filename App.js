import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import About from './Components/About';
import Cart from "./Components/Cart";
import Checkout from './Components/Checkout';
import Home from './Components/Home';
import ProductList from './Components/ProductList';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import Profile from './Components/Profile';
import Settings from './Components/Settings';
import Search from './Components/Wishlist';

// import Icons
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyProfile from './Components/MyProfile';
import Help from './Components/Help';
import Wishlist from './Components/Wishlist';
import { use } from 'react';
import Splash from './Components/Splash';
import MemberDetails from './Components/MemberDetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AboutStack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#ffffff',
    height: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    paddingVertical: 'auto',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  }
};
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000)}, []);
  return (
    /*<NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ProductList" component={ProductList} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer> */
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
          <Tab.Screen
            name="Home"
            component={isLoading ? Splash : ProductStackNavigation}
            options={{
              tabBarStyle: {
                display: isLoading ? "none" : "flex",
              },

              tabBarIcon: ({ focused }) => (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <AntDesign
                    name="home"
                    size={focused ? 25 : 22}
                    color={focused ? "#6055D8" : "black"}
                  />
                </View>
              ),
            }}
          />
          {/* <Tab.Screen name="About" component={About} /> */}
          <Tab.Screen
            name="Search"
            component={Wishlist}
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <AntDesign
                    name="shoppingcart"
                    size={focused ? 25 : 22}
                    color={focused ? "#6055D8" : "black"}
                  />
                </View>
              ),
            }}
          />
          {/* <Tab.Screen name="Checkout" component={Checkout} /> */}
          {/* <Tab.Screen name="ProductList" component={ProductList} /> */}
          {/* <Tab.Screen name="ProductDetails" component={ProductDetails} /> */}
          <Tab.Screen
            name="Profile"
            component={StackNavigation}
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Ionicons
                    name="person"
                    size={focused ? 25 : 22}
                    color={focused ? "#6055D8" : "black"}
                  />
                </View>
              ),
            }}
          />
          {/* <Tab.Screen name="Settings" component={Settings} /> */}
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
function StackNavigation(){
      return (
        <Stack.Navigator initialRouteName="ProfileScreen">
          <Stack.Screen
            name="About"
            component={AboutStackNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyProfile"
            component={MyProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Help"
            component={Help}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      );
}

function AboutStackNavigation() {
  return (
    <AboutStack.Navigator initialRouteName="AboutSc">
      <AboutStack.Screen
        name="AboutSc"
        component={About}
        options={{ headerShown: false }}
      />
      <AboutStack.Screen
        name="MemberDetails"
        component={MemberDetails}
        options={{ headerShown: false }}
      />
    </AboutStack.Navigator>
  );
}
function ProductStackNavigation() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ProductStack.Navigator initialRouteName="HomeS">
        <ProductStack.Screen
          name="HomeS"
          component={Home}
          options={{ headerShown: false }}
        />
        <ProductStack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ headerShown: false }}
        />
        <ProductStack.Screen
          name="ProductList"
          component={ProductList}
          options={{ headerShown: false }}
        />
      </ProductStack.Navigator>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
