import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, Alert } from 'react-native';
import { AntDesign, Ionicons } from "@expo/vector-icons"; 
import { inWishlist, removeFromWishlist } from '../firebase/Wishlist';

const screen = Dimensions.get('window');

const DeletedWish = (prodcutInof) => {
  const [isWishList, setIsWishList] = useState(true);

  const handleDeleteFromWishlist = async () => {
    try {
      await removeFromWishlist(prodcutInof.id);
      setIsWishList(false);
      prodcutInof.setRefreshing2((prev) => prev + 1);
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
        <View style={styles.image}></View>
      <View style={styles.detailsContainer}>
        
        <Text style={styles.title} numberOfLines={1}>Not Found</Text>
        <Text style={styles.price}>this is a deleted item</Text>
      </View>

      <View style={styles.loveContainer}>
        <Pressable onPress={() => handleDeleteFromWishlist()} style={styles.button}>
        <Ionicons name="trash-outline" size={screen.width * 0.06} color="#2e2a9d" />
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
    borderRadius: screen.width * 0.02,
    padding: screen.width * 0.03,
    width: screen.width * 0.95,
    alignSelf: "center",
    marginVertical: screen.height * 0.01,
  },
  image: {
    width: screen.width * 0.2,
    height: screen.width * 0.2, 
    borderRadius: screen.width * 0.02, 
    backgroundColor: "#e2e2e2"
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: screen.width * 0.03,
    justifyContent: "center",
  },
  title: {
    fontSize: screen.width * 0.04,
    color: "#4e5774",
    marginBottom: screen.height * 0.005,
  },
  price: {
    fontSize: screen.width * 0.045,
    fontWeight: "bold",
    color: "#1f388d",
  },
  loveContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: screen.width * 0.03,
  },
});

export default DeletedWish;
