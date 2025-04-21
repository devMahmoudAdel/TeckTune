import React from 'react';
import { View, Text, Image,StyleSheet,Pressable, Alert } from 'react-native';
import ProductDetails from '../app/(main)/[...ProductDetails]';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from 'react';
import { addToWishlist,removeFromWishlist,inWishlist} from '../firebase/Wishlist';
import Stars from './Stars';
const Product = ({id, title, images, rating, price}) => {
  const [isWishList, setIsWishList] = useState(false);
    const [loading, setLoading] = useState(false);
  const handleAddToWishList = async () => {
      try {
        if (isWishList) {
          await removeFromWishlist(id);
          setIsWishList(false);
          Alert.alert("Success", "Product removed from wishlist");
        } else {
          await addToWishlist(id);
          setIsWishList(true);
          Alert.alert("Success", "Product added to wishlist");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update wishlist");
        console.error(error);
      }
    };
  
  
     useEffect(() => {
      const checkWishListStatus = async () => {
        try {
          const inList = await inWishlist(id);
          console.log("In wishlist:", inList);
          setIsWishList(inList);
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      };
      
      if (id) {
        checkWishListStatus();
      }
    }, []);
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
        <Text>({rating})</Text>
      </View>
      <Text style={styles.productPrice}>${Number(price).toFixed(2)}</Text>
      <Pressable onPress={() => handleAddToWishList()} style={styles.favProduct}>
        <MaterialIcons
          name={isWishList ? "favorite" : "favorite-border"}
          size={25}
          color={"#fff"}
        />
      </Pressable>
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
    borderRadius: 10,
    margin: 10,
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
