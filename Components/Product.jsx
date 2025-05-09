import React from 'react';
import { View, Text, Image,StyleSheet,Pressable, Alert } from 'react-native';
import ProductDetails from '../app/(main)/[...ProductDetails]';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from 'react';
import { addToWishlist,removeFromWishlist,inWishlist} from '../firebase/Wishlist';
import Stars from './Stars';
const Product = ({id, title, images, rating, price }) => {
  return (
    <View style={styles.container}>
      <Image
        source={typeof images[0] === "string" ? { uri: images[0] } : images[0]}
        style={styles.image}
        resizeMode="cover"
        defaultSource={require("../assets/icon.png")}
      />
      <Text numberOfLines={1} style={styles.productTitle}>
        {title}
      </Text>
      <View style={styles.secContainer}>
        <View style={styles.stars}>
          <Stars number={rating} />
        </View>
        <Text style={{ marginLeft: 4, color: "#FFD700", fontWeight: "bold" }}>
          {Number(rating).toFixed(1)}
        </Text>
      </View>
      <Text style={styles.productPrice}>${Number(price).toFixed(2)}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "160",
    height: "240",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderRadius: 6,
    margin: 10,
    overflow: "hidden",
    width: 160,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 7,
  },
  productPrice: {
    fontSize: 14,
    color: "#2f2baa",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
  },
  stars: {
    flexDirection: "row",
  },
  secContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favProduct: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#818181",
    borderRadius: 20,
    width: 35,
    height: 35,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Product;
