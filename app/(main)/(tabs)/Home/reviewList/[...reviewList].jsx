import React, { useEffect, useState } from "react";
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
  Image
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getReviews, addReview } from "../../../../../firebase/reviews";

export default function ReviewList() {
  const { productId, productImage, productName, productPrice } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const fetchedReviews = await getReviews(productId);
        setReviews(fetchedReviews);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch reviews. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleAddReview = async () => {
    if (!newReview.comment.trim()) {
      Alert.alert("Warning", "Please enter your review comment");
      return;
    }

    if (newReview.rating <= 0) {
      Alert.alert("Warning", "Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(newReview, productId);
      const updatedReviews = await getReviews(productId);
      setReviews(updatedReviews);
      setNewReview({ comment: "", rating: 0 });
    } catch (error) {
      Alert.alert("Error", "Failed to add review. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingSelect = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: StatusBar.currentHeight || 20 }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={productImage ? { uri: productImage } : require("../../../../../assets/icon.png")} 
            style={styles.productImage} 
          />
          <View>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.productPrice}>${Number(productPrice).toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => item.id || item.createdAt?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.reviewRating}>
              {Array.from({ length: 5 }).map((_, index) => (
                <AntDesign
                  key={index}
                  name={index < item.rating ? "star" : "staro"}
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AntDesign name="inbox" size={48} color="#ccc" />
            <Text
              style={{
                fontSize: 18,
                color: "#666",
                marginTop: 16,
              }}>No reviews yet</Text>
            <Text style={{
              fontSize: 14,
              color: "#999",
              marginTop: 4,
            }}>Be the first to share your experience!</Text>
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
              numberOfLines={3}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingSelect(index + 1)}
                    activeOpacity={0.7}
                  >
                    <AntDesign
                      name={newReview.rating > index ? "star" : "staro"}
                      size={28}
                      color={newReview.rating > index ? "#FFD700" : "#ddd"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Pressable
              onPress={handleAddReview}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && {opacity: 0.9},
                isSubmitting && {backgroundColor : "#aaa"},
              ]}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#5A31F4" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </Pressable>
          </View>
        }
        contentContainerStyle={{paddingBottom : 40}}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
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
    elevation: 2,
  },
  reviewRating: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 4,
  },
  addReviewContainer: {
    margin: 16,
    marginTop: 24,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
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
  },
  submitButton: {
    backgroundColor: "#5A31F4",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
});