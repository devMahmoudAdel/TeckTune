import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import About from './About';
import Cart from './Cart';
import Checkout from './Checkout';
import Home from './Home';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import Profile from './Profile';
import Settings from './Settings';
const Stack = createNativeStackNavigator();
const Indexes = () => {
  return (
    <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="About1" component={About} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="Checkout" component={Checkout} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="ProductList" component={ProductList} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
          </NavigationContainer>
  );
}

export default Indexes;
