import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Stars from './Stars';

const Product = ({ id, title, images, rating, price }) => {
  return (
    <View style={styles.container}>
      <Image
        source={typeof images[0] === "string" ? { uri: images[0] } : images[0]}
        style={styles.image}
        resizeMode="cover"
        defaultSource={require("../assets/icon.png")}
      />
      <View style={styles.infoContainer}>
        <Text numberOfLines={2} style={styles.productTitle}>
          {title}
        </Text>
        <View style={styles.ratingContainer}>
          <Stars number={rating} />
          <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
        </View>
        <Text style={styles.productPrice}>${Number(price).toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    margin: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  infoContainer: {
    padding: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingText: {
    marginLeft: 6,
    color: "#f1c40f",
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#2f2baa",
    fontWeight: "700",
  },
});

export default Product;
