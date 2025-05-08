import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, Alert } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
import { inWishlist, removeFromWishlist } from '../firebase/Wishlist';
const screen = Dimensions.get('window');
const Wishlistitem = (prodcutInof) => {
  const [ isWishList, setIsWishList ] = useState(false);

  const handleDeleteFromWishlist = async () => {
    try {
      await removeFromWishlist(prodcutInof.id);
      setIsWishList(false);
      Alert.alert("Success", "Product removed from wishlist");
    } catch (error) {
      Alert.alert("Error", "Failed to remove product from wishlist");
    }
  };

  useEffect(() => {
    const checkWishListStatus = async () => {
      try {
        const inList = await inWishlist(prodcutInof.id);
        setIsWishList(inList);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };
    if (prodcutInof.id) {
      checkWishListStatus();
    }
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{uri: prodcutInof.image}} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{prodcutInof.title}</Text>
        <Text style={styles.price}>${prodcutInof.price}</Text>
      </View>

      <View style={styles.loveContainer}>
        <Pressable onPress={() => handleDeleteFromWishlist()} style={styles.button}>
          <AntDesign name={isWishList ? "heart" : "hearto"} size={21} color="#2e2a9d" />
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
