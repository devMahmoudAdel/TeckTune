import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, Alert } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
import { addToCart } from '../firebase/Cart';

const screen = Dimensions.get('window');

const CartItem = (prodcutInof) => {
  const [counter, setCounter] = useState(prodcutInof.quantity || 1);

  const incCounter = async () => {
    try {
      await addToCart(prodcutInof.id, counter + 1);
      setCounter(counter + 1);
      prodcutInof.setRefreshing2((prev) => prev + 1);
    } catch (e) {
      console.error("Failed to add product", e);
      Alert.alert("Failed to add product: " + e);
    }
  };

  const decCounter = async () => {
    try {
      if (counter > 1) {
        await addToCart(prodcutInof.id, counter - 1);
        setCounter(counter - 1);
        prodcutInof.setRefreshing2((prev) => prev + 1);
      }
    } catch {
      Alert.alert("Failed to remove product");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}></View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>Not Found</Text>
        <Text style={styles.price}>this is a deleted item</Text>
      </View>

      <View style={styles.counterContainer}>
        <Pressable onPress={() => incCounter()} style={styles.button}>
          
        </Pressable>

        <Text style={styles.count}></Text>

        <Pressable onPress={() => decCounter()} style={styles.button}>
          
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    padding: 10,
    width: "95%",
    alignSelf: "center",
    marginVertical: 8,
  },
  image: {
    width: screen.width * 0.2,
    height: screen.width * 0.2,
    borderRadius: 5,
    backgroundColor: "#e2e2e2"
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: screen.width * 0.04,
    color: "#4e5774",
    marginBottom: 5,
  },
  price: {
    fontSize: screen.width * 0.045,
    fontWeight: "bold",
    color: "#1f388d",
  },
  counterContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
  },
  count: {
    fontSize: screen.width * 0.045,
    fontWeight: "bold",
    marginVertical: 3,
    color: "#333",
  },
  button: {
    paddingVertical: 2,
  },
});

export default CartItem;
