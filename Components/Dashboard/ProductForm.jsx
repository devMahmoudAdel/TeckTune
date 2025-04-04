import { View, Text, StyleSheet } from "react-native";
import React from "react";
import data from "../data";

export default function ProductForm({ route }) {
  const { id } = route.params;
  const product = data.find((product) => product.id === id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product ? product.title : "Product Not Found"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f2baa",
  },
});
