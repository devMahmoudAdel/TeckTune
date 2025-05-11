import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, Alert } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
import { addToCart } from '../firebase/Cart';
import { useRouter } from 'expo-router';
const screen = Dimensions.get('window');

const CartItem = (prodcutInof) => {
  const [counter, setCounter] = useState(prodcutInof.quantity || 1);
  const router = useRouter();
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
    <Pressable onPress={() => router.push({pathname: `/(main)/Product/${prodcutInof.id}`,
     params: {
                  title: prodcutInof.title,
                  price: prodcutInof.price,
                  imagess: JSON.stringify(prodcutInof.images),
                  rating: prodcutInof.rating,
                  colorss: JSON.stringify(prodcutInof.colors),
                  description: prodcutInof.description,
                  reviews: prodcutInof.reviews,
                  id: prodcutInof.id,
                }
     })}>
      <View style={styles.container}>
      <Image style={styles.image} source={{ uri: prodcutInof.image }} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{prodcutInof.title}</Text>
        <Text style={styles.price}>${prodcutInof.price}</Text>
      </View>

      <View style={styles.counterContainer}>
        <Pressable onPress={() => incCounter()} style={styles.button}>
          <AntDesign name="pluscircle" size={21} color="#2e2a9d" />
        </Pressable>

        <Text style={styles.count}>{counter}</Text>

        <Pressable onPress={() => decCounter()} style={styles.button}>
          <AntDesign name="minuscircle" size={21} color="#7e7cb4" />
        </Pressable>
      </View>
    </View>
    </Pressable>
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
