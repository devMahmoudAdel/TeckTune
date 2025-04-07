import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
const screen = Dimensions.get('window');
const Wishlistitem = (prodcutInof) => {

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={prodcutInof.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{prodcutInof.title}</Text>
        <Text style={styles.price}>${prodcutInof.price}</Text>
      </View>

      <View style={styles.loveContainer}>
        <Pressable onPress={console.log("handle here del. product from wishlist")} style={styles.button}>
          <AntDesign name="heart" size={21} color="#2e2a9d" />
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
    width: 65,
    height: "100%",
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10

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
  loveContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
  },
  
});

export default Wishlistitem;
