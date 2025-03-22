import { View, Text } from "react-native";
import React from "react";
import data from "../data";

export default function ProductForm({ route }) {
    const { id } = route.params; 
    const product = data.find((product) => product.id === id);
  return (
    <View>
      <Text>ProductForm</Text>
    </View>
  );
}
