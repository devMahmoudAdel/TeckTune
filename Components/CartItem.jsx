import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, Alert } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
import CartFireBase from '../firebase/Cart';
const screen = Dimensions.get('window');

const CartItem = (prodcutInof) => {
  const [counter, setCounter] = useState(1);

  const incCounter = async () =>{
    try{
      const cleanItem = {
        id: prodcutInof.id,
        title: prodcutInof.title,
        price: prodcutInof.price,
        image: prodcutInof.image,
        rating: prodcutInof.rating,
      };
      await CartFireBase.addToCart(cleanItem);
      setCounter(counter + 1);
    }catch (e){
      console.error("Faild add product", e);
      Alert.alert("Faild add product" + e);
    }
  };
  const decCounter = async () => {
    try{
        if (counter > 1){
          await CartFireBase.removeFromCart(prodcutInof.id)
          setCounter(counter - 1);
        } 
    }catch{
      Alert.alert("Faild del product")
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={prodcutInof.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{prodcutInof.title}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    padding: 0,
    width: screen.width - 20,
    alignSelf: "center",
  },
  image: {
    width: 90,
    height: "100%",
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  title: {
    // fontWeight: "bold",
    color: "#4e5774",
    fontSize: 14,
    marginBottom: 15,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f388d",
  },
  counterContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
  },
  count: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 3,
    color: "#333",
  },
  button: {
    paddingVertical: 2,
    // margin:-3

  },
});

export default CartItem;
