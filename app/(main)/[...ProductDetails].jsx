import React, { useState } from "react";
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, StatusBar, Dimensions, Pressable, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AddToWishList } from "../../Components/AddToWishList";
import { AddToCart } from "../../Components/AddToCart";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
const { width, height } = Dimensions.get('window');

const reviewsData = [
  { id: "1", user: "John Doe", comment: "Great product!", rating: 5 },
  { id: "2", user: "Jane Smith", comment: "Good value for money.", rating: 4 },
  { id: "3", user: "Alice Johnson", comment: "Not what I expected.", rating: 3 },
  { id: "4", user: "Bob Brown", comment: "Amazing quality!", rating: 5 },
];

export default function ProductDetails() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(null);
  const { title, price, imagess, rating, colorss, description, reviews } = useLocalSearchParams();
  const images = JSON.parse(imagess);
  const colors = JSON.parse(colorss);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  return (
    <ScrollView style={styles.container}>
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

        <Pressable style={styles.wishlistButton} onPress={AddToWishList}>
          <AntDesign name="hearto" size={24} color="black" />
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

        {/* Color Section */}
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
          showsHorizontalScrollIndicator={false}
        />

        {/* Reviews Section */}
        <Text style={styles.reviewsTitle}>Customer Reviews</Text>
        <FlatList
          data={reviewsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{item.user}</Text>
              <Text style={styles.reviewComment}>{item.comment}</Text>
              <View style={styles.reviewRating}>
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Icon key={index} name="star" size={16} color="#FFD700" />
                ))}
              </View>
            </View>
          )}
          ListFooterComponent={
            <Link
              href={{
                pathname: `/(main)/(tabs)/Home/reviewList/[...reviewList]`,
                params: {
                  productId: title,
                  reviews: JSON.stringify(reviewsData),
                },
              }}
              asChild
            >
              <Pressable style={{ alignItems: "center", justifyContent: "center" , borderRadius : 50 , borderColor : "#5A31F4" , borderWidth : 2 , height :50}}>
              <Text style={{ fontSize: 30 , color : "#5A31F4" }}>View All</Text>
              </Pressable>
            </Link>
          }
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={AddToCart}
            style={[
              styles.buyNowButton,
              {
                backgroundColor: "white",
                borderColor: "#5A31F4",
                borderRadius: 5,
                borderWidth: 2,
                flexDirection: "row",
                gap: 5,
              },
            ]}
          >
            <AntDesign name="shoppingcart" size={24} color="#5A31F4" />
            <Text style={[styles.buttonText, { color: "#5A31F4" }]}>
              Add to cart
            </Text>
          </Pressable>
          <TouchableOpacity style={styles.buyNowButton}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: StatusBar.currentHeight,
  },
  topsection: {
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  imageContainer: {
    width: width,
    height: height / 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  paginationDotActive: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
    width: 150,
    backgroundColor: "#5A31F4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
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
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  reviewRating: {
    flexDirection: "row",
    marginTop: 5,
  },
});