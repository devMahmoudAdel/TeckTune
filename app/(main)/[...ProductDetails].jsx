import React, { useState,useEffect } from "react";
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar, Dimensions,Pressable, Alert, ActivityIndicator } from "react-native";
import Icon from "@expo/vector-icons/AntDesign"; 
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  inWishlist,
} from "../../firebase/Wishlist";
const { width, height } = Dimensions.get('window');


export default function ProductDetails() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(null);
  // const { title, price, imagess, rating, colorss, description, reviews, stock, category, id } = useLocalSearchParams();
  // const images = JSON.parse(imagess);
  // const colors = JSON.parse(colorss);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishList, setIsWishList] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };


 const params = useLocalSearchParams();
 const title = params.title || "Product Title";
 const price = params.price || "0";
 const rating = params.rating || "0";
 const description = params.description || "No description available";
 const reviews = params.reviews || "0";
 const id = params.id || "";

 // Safely parse JSON data
 const [images, setImages] = useState([]);
 const [colors, setColors] = useState([]);

 useEffect(() => {
   try {
     setImages(params.imagess ? JSON.parse(params.imagess) : []);
     setColors(params.colorss ? JSON.parse(params.colorss) : []);
   } catch (error) {
     console.error("Error parsing data:", error);
     setImages([]);
     setColors([]);
   } finally {
     setLoading(false);
   }
 }, []);



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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A31F4" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.topsection}>
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item} style={styles.image} resizeMode="cover" />
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={200}
          keyExtractor={(_, index) => index.toString()}
        />

        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <Pressable style={styles.wishlistButton} onPress={handleAddToWishList}>
          <MaterialIcons name={isWishList ? "favorite" : "favorite-border"} size={24} color="black" />
        </Pressable>
        <Pressable
          style={[styles.wishlistButton, { left: 15 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </Pressable>
      </View>
      <View style={styles.bottomsection}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>${Number(price).toFixed(2)}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Icon name="star" size={18} color="#FFD700" />
          <Text style={styles.rating}>{rating} </Text>
          <Text style={styles.reviews}>({reviews} Reviews)</Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <Text style={styles.colorTitle}>Colors</Text>
        <FlatList
          data={colors}
          horizontal
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.colorBox,
                { backgroundColor: item },
                selectedColor === item && styles.selectedColorBox,
              ]}
              onPress={() => setSelectedColor(item)}
            ></TouchableOpacity>
          )}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={() => Alert.alert("Buy Now")}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: StatusBar.currentHeight
  },
  topsection: {
    flex: 1,
    backgroundColor: "#fff",
    width: '100%',
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  paginationDotActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomsection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2f2baa",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  reviews: {
    fontSize: 14,
    color: "#777",
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    lineHeight: 20,
  },
  colorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  colorBox: {
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
    height: 40,
    width: 40,
  },
  selectedColorBox: {
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#5A31F4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  wishlistButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    position: "absolute",
    right: 15,
    top: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});