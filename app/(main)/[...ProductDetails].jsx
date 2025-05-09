import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { addToCart, inCart } from "../../firebase/Cart";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { getReviews } from "../../firebase/reviews";
import {
  addToWishlist,
  removeFromWishlist,
  inWishlist,
} from "../../firebase/Wishlist";
import fallbackImage from "../../assets/icon.png";
import CheckAlert from "../../Components/CheckAlert";
import { useAuth } from "../../context/useAuth";
const { width, height } = Dimensions.get("window");


export default function ProductDetails() {

  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(null);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishList, setIsWishList] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const { user, guest } = useAuth();
  const params = useLocalSearchParams();
  const title = params.title || "Product Title";
  const price = params.price || "0";
  const rating = params.rating || "0";
  const description = params.description || "No description available";
  const reviews = params.reviews || "0";
  const id = params.id || "";
  const category = params.category || "null";

  useEffect(() => {
    try {
      console.log(category);
      const parsedImages = params.imagess ? JSON.parse(params.imagess) : [];
      const validatedImages = parsedImages.map((img) =>
        typeof img === "string" && img.trim() !== "" ? { uri: img } : fallbackImage
      );
      setImages(validatedImages);
      setColors(params.colorss ? JSON.parse(params.colorss) : []);
    } catch (error) {
      console.error("Error parsing data:", error);
      setImages([fallbackImage]);
      setColors([]);
    }
  }, [params.imagess, params.colorss]);

  useEffect(() => {
    console.log(id);
    if (!guest) {
      const checkWishListStatus = async () => {
        try {
          const inList = await inWishlist(id);
          setIsWishList(inList);
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      };

      if (id) {
        checkWishListStatus();
      }
    }
  }, [id]);


  useEffect(() => {
    if (!guest) {
      const checkCartStatus = async () => {
        try {
          const inList = await inCart(id);
          setIsCart(inList);
        } catch (error) {
          console.error("Error checking cart:", error);
        }
      };

      if (id) {
        checkCartStatus();
      }
    }
  }, [id]);


  const [refreshing, setRefreshing] = useState(false);

  const fetchDynamicReviews = async () => {
    try {
      const reviews = await getReviews(id);
      if (Array.isArray(reviews)) {
        setDynamicReviews(reviews.sort((a, b) => b.rating - a.rating).slice(0, 5));
      } else {
        setDynamicReviews([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchDynamicReviews();
  }, [id]);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchDynamicReviews();
  };
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  const handleAddToWishList = async () => {
    if (guest) {
      router.push("/restricted-modal")
    } else {
      try {
        if (isWishList) {
          await removeFromWishlist(id);
          setIsWishList(false);
          <CheckAlert state="success" title="Product removed from wishlist" />
        } else {
          await addToWishlist(id);
          setIsWishList(true);
          <CheckAlert state="success" title="Product added to wishlist" />
        }
      } catch (error) {
        <CheckAlert state="error" title="Failed to update wishlist" />
      }
    }
  };

  const handleAddToCart = async () => {
    if (guest) {
      router.push("/restricted-modal")
    } else {
      try {
        if (isCart) {
          router.push("/(main)/(tabs)/Cart");
        } else {
          await addToCart(id);
          setIsCart(true);
          <CheckAlert state="success" title="Product added to cart" />
        }
      } catch (error) {
        <CheckAlert state="error" title="Failed to update cart" />
      }
    }
  };

  const handleBuyNow = () => {
    return (<CheckAlert state="error" title="Not now" />)
  }

  // Helper to navigate to review list
  const goToReviewList = () => {
    router.push({
      pathname: "/(main)/(tabs)/Home/reviewList/[...reviewList]",
      params: {
        productId: id,
        productImage:
          typeof images[0] === "string"
            ? images[0]
            : images[0]?.uri || "",
        totalReviews: dynamicReviews.length,
        productName: title,
        productPrice: price,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#f5f5f5" }]}>
      <FlatList
        data={[{ key: "main" }]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={() => (
          <>
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
                ListEmptyComponent={
                  <View style={styles.imageContainer}>
                    <Image source={fallbackImage} style={styles.image} resizeMode="cover" />
                  </View>
                }
              />
              <Pressable style={styles.wishlistButton} onPress={handleAddToWishList}>
                <MaterialIcons
                  name={isWishList ? "favorite" : "favorite-border"}
                  size={24}
                  color="black"
                />
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

              <View style={styles.ratingRow}>
                <AntDesign name="star" size={22} color="#FFD700" />
                <Text style={styles.ratingValue}>
                  {dynamicReviews.length > 0
                    ? (
                      dynamicReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                      dynamicReviews.length
                    ).toFixed(1)
                    : "0.0"}
                </Text>
                <Text style={styles.reviewsCount}>
                  ({dynamicReviews.length} {dynamicReviews.length === 1 ? "Review" : "Reviews"})
                </Text>
              </View>
              <View style={styles.divider} />

              <Text style={styles.description}>{description}</Text>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Colors</Text>
              <FlatList
                data={colors}
                horizontal
                keyExtractor={(item, index) => `color-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorBox,
                      { backgroundColor: item },
                      selectedColor === item && styles.selectedColorBox,
                    ]}
                    onPress={() => setSelectedColor(item)}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={{ color: "#999", fontSize: 14 }}>No colors available</Text>
                }
              />

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Customer Reviews</Text>

              {dynamicReviews.length > 0 ? (
                <FlatList
                  data={dynamicReviews}
                  scrollEnabled={false}
                  keyExtractor={(item, index) =>
                    item.id ? item.id.toString() : `review-${index}`
                  }
                  renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewerName}>
                          {item.firstName
                            ? `${item.firstName}${item.lastName ? " " + item.lastName : ""}`
                            : "Guest"}
                        </Text>
                        <View style={styles.reviewRating}>
                          <View style={styles.starsContainer}>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <AntDesign
                                key={index}
                                name={index < item.rating ? "star" : "staro"}
                                size={18}
                                color="#FFD700"
                                style={styles.starIcon}
                              />
                            ))}
                          </View>
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{item.comment}</Text>
                      {item.createdAt && (
                        <Text style={styles.reviewDate}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  )}
                  ListFooterComponent={
                    <Pressable style={styles.viewAllButton} onPress={goToReviewList}>
                      <Text style={styles.viewAllText}>View All Reviews</Text>
                      <AntDesign name="arrowright" size={20} color="#5A31F4" />
                    </Pressable>
                  }
                />
              ) : (
                <View>
                  <View style={styles.noReviewsContainer}>
                    <Text style={styles.noReviewsText}>No reviews yet</Text>
                    <Text style={styles.noReviewsSubtext}>
                      Be the first to review this product!
                    </Text>
                  </View>
                  <Pressable style={styles.viewAllButton} onPress={goToReviewList}>
                    <Text style={styles.viewAllText}>Add Your Review</Text>
                    <AntDesign name="arrowright" size={20} color="#5A31F4" />
                  </Pressable>
                </View>
              )}
              <Link
                href={{
                  pathname: `/(main)/(tabs)/Home/reviewList/[...reviewList]`,
                  params: {
                    productId: id,
                    productImage:
                      typeof images[0] === "string"
                        ? images[0]
                        : images[0]?.uri || "",
                    totalReviews: dynamicReviews.length,
                    productName: title,
                    productPrice: price,
                  },
                }}
                asChild
              >
              </Link>
              <View style={styles.buttonContainer}>
                <Pressable
                  onPress={handleAddToCart}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.cartButton,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <AntDesign name="shoppingcart" size={20} color="#5A31F4" />
                  <Text style={styles.cartButtonText}>{isCart ? "Go to Cart" : "Add to Cart"}</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleBuyNow}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: "#5A31F4" },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.buyButtonText}>Buy Now</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
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
    backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight || 0,
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
    width: "300",
    height: "300",
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
    elevation: 2,
  },
  bottomsection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    // backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5A31F4",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  reviews: {
    fontSize: 14,
    color: "#777",
    marginLeft: 5,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedColorBox: {
    borderWidth: 2,
    borderColor: "#5A31F4",
  },
  reviewItem: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewComment: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  noReviewsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  noReviewsText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginBottom: 4,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: "#999",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f0f0ff",
    borderRadius: 8,
    marginTop: 10,
  },
  viewAllText: {
    color: "#5A31F4",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cartButton: {
    backgroundColor: "#f0f0ff",
    borderWidth: 1,
    borderColor: "#5A31F4",
  },
  cartButtonText: {
    color: "#5A31F4",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginLeft: 6,
  },
  reviewsCount: {
    fontSize: 15,
    color: "#777",
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
});