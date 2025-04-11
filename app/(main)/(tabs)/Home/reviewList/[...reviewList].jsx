import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ReviewList() {
  const { productId, reviews } = useLocalSearchParams();
  const parsedReviews = reviews ? JSON.parse(reviews) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews for {productId}</Text>
      <FlatList
        data={parsedReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewUser}>{item.user}</Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <View style={styles.reviewRating}>
              {Array.from({ length: item.rating }).map((element, index) => (
                <AntDesign key= {index} name="star" size={16} color="#FFD700" />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", 
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center", 
  },
  reviewItem: {
    marginBottom: 15,
    padding: 15, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    elevation: 3, 
  },
  reviewUser: {
    fontSize: 18, // Increased font size
    fontWeight: "bold",
    color: "#444",
  },
  reviewComment: {
    fontSize: 16, 
    color: "#666",
    marginTop: 8,
    lineHeight: 22,
  },
  reviewRating: {
    flexDirection: "row",
    marginTop: 10,
  },
});