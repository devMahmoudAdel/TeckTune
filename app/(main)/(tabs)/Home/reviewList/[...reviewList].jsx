import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  StatusBar,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
import { getReviews, addReview, deleteReview, updateProductRating } from "../../../../../firebase/reviews";
import { useAuth } from "../../../../../context/useAuth";

function AnimatedReviewItem({ item, animatedRefs, user, handleDeleteReview, styles, highlight }) {
  const cracks = Array(8).fill(0).map(() => ({
    opacity: useSharedValue(0), // <-- Start as invisible
    rotate: useSharedValue('0deg'),
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    scale: useSharedValue(1)
  }));
  const containerOpacity = useSharedValue(highlight ? 0 : 1);
  const containerScale = useSharedValue(highlight ? 0.8 : 1);

  // Animate in if highlight is true (review just added)
  useEffect(() => {
    if (highlight) {
      containerOpacity.value = withTiming(1, { duration: 400 });
      containerScale.value = withTiming(1, { duration: 400 });
    }
  }, [highlight]);

  // Store in refs for animation triggers
  animatedRefs.current[item.id] = {
    cracks,
    containerOpacity,
    containerScale
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const crackStyles = cracks.map((crack, index) => {
    return useAnimatedStyle(() => ({
      position: 'absolute',
      width: '50%',
      height: '50%',
      left: index % 4 < 2 ? 0 : '50%',
      top: index % 2 === 0 ? 0 : '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderColor: 'rgba(200, 200, 255, 0.9)',
      borderWidth: 1,
      opacity: crack.opacity.value,
      transform: [
        { rotate: crack.rotate.value },
        { translateX: crack.translateX.value },
        { translateY: crack.translateY.value },
        { scale: crack.scale.value },
      ],
    }));
  });

  return (
    <Animated.View style={[styles.reviewItem, containerStyle]}>
      {cracks.map((_, index) => (
        <Animated.View key={`crack-${index}`} style={[crackStyles[index], { zIndex: 2 }]} />
      ))}

      <View style={{ zIndex: 1 }}>
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
            {item.userId === user.id && (
              <TouchableOpacity
                onPress={() => handleDeleteReview(item.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={20} color="#FF5252" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.reviewComment}>{item.comment}</Text>
        {item.createdAt && (
          <Text style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

export default function ReviewList() {
  const { user } = useAuth();
  const { productId, productImage, productName, productPrice } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Store refs for animated values per review
  const animatedRefs = useRef({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const fetchedReviews = await getReviews(productId);
      setReviews(fetchedReviews);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch reviews. Please try again later.");
    } finally {      containerScale.value = withTiming(1, { duration: 400 });

      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  // Reset highlighhighlightt after animation
  useEffect(() => {
    if (lastAddedId) {
      const timer = setTimeout(() => setLastAddedId(null), 900);
      return () => clearTimeout(timer);
    }
  }, [lastAddedId]);

  const handleAddReview = async () => {
    if (user.role === "guest") {
      Alert.alert("Not Allowed", "Guest users cannot submit reviews. Please sign in or register.");
      return;
    }
    if (!newReview.comment.trim()) {
      Alert.alert("Warning", "Please enter your review comment");
      return;
    }
    if (newReview.rating <= 0) {
      Alert.alert("Warning", "Please select a rating");
      return;
    }
    const alreadyReviewed = reviews.some((r) => r.userId === user.id);
    if (alreadyReviewed) {
      Alert.alert("Warning", "You have already reviewed this product.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addReview(
        {
          ...newReview,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: Date.now(),
        },
        productId
      );
      console.log("Calling updateProductRating with:", productId);
      await updateProductRating(productId);
      const updatedReviews = await getReviews(productId);
      setReviews(updatedReviews);
      setLastAddedId(updatedReviews[0]?.id); // highlight the newest review (assuming it's first)
      setNewReview({ comment: "", rating: 0 });
    } catch (error) {
      Alert.alert("Error", "Failed to add review. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete your review?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: () => startDeleteAnimation(reviewId),
          style: "destructive",
        },
      ]
    );
  };

  const startDeleteAnimation = (reviewId) => {
    setDeletingId(reviewId);

    if (!animatedRefs.current[reviewId]) {
      animatedRefs.current[reviewId] = {
        cracks: Array(8).fill(0).map(() => ({
          opacity: useSharedValue(1),
          rotate: useSharedValue('0deg'),
          translateX: useSharedValue(0),
          translateY: useSharedValue(0),
          scale: useSharedValue(1)
        })),
        containerOpacity: useSharedValue(1),
        containerScale: useSharedValue(1)
      };
    }

    const { cracks, containerOpacity, containerScale } = animatedRefs.current[reviewId];

    // 1. Initial wobble effect
    cracks.forEach((crack, index) => {
      crack.rotate.value = withSequence(
        withTiming(`${Math.random() * 20 - 10}deg`, { duration: 100 }),
        withTiming('0deg', { duration: 200 })
      );
    });

    // 2. Shatter effect after wobble
    setTimeout(() => {
      cracks.forEach((crack, index) => {
        const angle = (index % 4) * 90 + 45;
        const distance = 100 + Math.random() * 100;
        const directionX = index < 4 ? 1 : -1;
        const directionY = index % 2 === 0 ? 1 : -1;

        crack.opacity.value = withSequence(
          withTiming(0.8, { duration: 100 }),
          withTiming(0, { duration: 400 })
        );

        crack.rotate.value = withTiming(
          `${(Math.random() * 60 - 30)}deg`,
          { duration: 500 }
        );

        crack.translateX.value = withTiming(
          directionX * distance * Math.cos(angle * Math.PI / 180),
          { duration: 500, easing: Easing.out(Easing.exp) }
        );

        crack.translateY.value = withTiming(
          directionY * distance * Math.sin(angle * Math.PI / 180),
          { duration: 500, easing: Easing.out(Easing.exp) }
        );

        crack.scale.value = withTiming(
          0.5 + Math.random() * 0.5,
          { duration: 500 }
        );
      });

      // Shrink and fade the container
      containerOpacity.value = withTiming(0, { duration: 500 });
      containerScale.value = withTiming(0.8, { duration: 500 });

      // Remove the item after animation completes
      setTimeout(() => {
        removeReview(reviewId);
      }, 500);
    }, 300);
  };

  const removeReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    deleteReview(productId, reviewId);
    updateProductRating(productId);
    setDeletingId(null);
    // Clean up animated refs
    delete animatedRefs.current[reviewId];
  };

  const handleRatingSelect = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const renderItem = ({ item }) => (
    <AnimatedReviewItem
      item={item}
      animatedRefs={animatedRefs}
      user={user}
      handleDeleteReview={handleDeleteReview}
      styles={styles}
      highlight={item.id === lastAddedId}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight || 20 }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={productImage ? { uri: productImage } : require("../../../../../assets/icon.png")}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
              {productName}
            </Text>
            <Text style={styles.productPrice}>${Number(productPrice).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={reviews || []}
        keyExtractor={(item, index) => item.id || item.createdAt?.toString() || index.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AntDesign name="inbox" size={48} color="#d3d3d3" />
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share your experience!</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.addReviewContainer}>
            <Text style={styles.sectionTitle}>Add Your Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Share your experience..."
              placeholderTextColor="#999"
              value={newReview.comment}
              onChangeText={(text) => setNewReview((prev) => ({ ...prev, comment: text }))}
              multiline
              numberOfLines={4}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              <View style={styles.starsInputContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingSelect(index + 1)}
                    activeOpacity={0.6}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <AntDesign
                      name={newReview.rating > index ? "star" : "staro"}
                      size={30}
                      color={newReview.rating > index ? "#FFC107" : "#ddd"}
                      style={styles.starInputIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Pressable
              onPress={handleAddReview}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </Pressable>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    maxWidth: "90%",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5A31F4",
  },
  reviewItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
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
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginHorizontal: 1,
  },
  reviewComment: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  addReviewContainer: {
    margin: 16,
    marginTop: 24,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 15,
    color: "#666",
    marginRight: 12,
    fontWeight: "500",
  },
  starsInputContainer: {
    flexDirection: "row",
  },
  starInputIcon: {
    marginHorizontal: 3,
  },
  submitButton: {
    backgroundColor: "#5A31F4",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5A31F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  submitButtonDisabled: {
    backgroundColor: "#aaa",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "#fbe9e7",
  },
  listContent: {
    paddingBottom: 40,
  },
});