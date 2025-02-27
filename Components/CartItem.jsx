import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import AntDesign from "@expo/vector-icons/AntDesign";
const CartItem = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/icon.png")} />
      <View style={styles.secContainer}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>Product Name</Text>
        </View>
        <View style={{ textAlign: "left", alignSelf: "flex-start" }}>
          <Text style={styles.price}>120</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "flex-end",
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
            }}
          >
            <Pressable>
              <AntDesign name="minuscircle" size={24} color="#2f2baa" />
            </Pressable>
            <Text style={styles.count}>02</Text>
            <Pressable>
              <AntDesign name="pluscircle" size={24} color="#2f2baa" />
            </Pressable>
          </View>
        </View>
      </View>
      <AntDesign name="delete" size={20} color="#e2e2e2" style={styles.deleteIcon} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    height: 150,
    backgroundColor: "#f2f2f2",
    marginHorizontal: "auto",
    borderRadius: 5,
    width: 325,
  },
  secContainer: {
    
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: 140,
    height: "100%",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
    marginVertical: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2f2baa",
  },
  count: {
    fontSize: 16,
    color: "#grey",
    marginHorizontal: 8,
    
  },
  deleteIcon: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "#212121",
    padding: 8,
    borderRadius: 25,
  },
});
export default CartItem;
