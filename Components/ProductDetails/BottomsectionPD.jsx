import React, { useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function BottomsectionPD(props) {
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.price}>{props.price}</Text>
      </View>

      <View style={styles.ratingContainer}>
        <Icon name="star" size={18} color="#FFD700" />
        <Text style={styles.rating}>{props.rating} </Text>
        <Text style={styles.reviews}>({props.reviews} Reviews)</Text>
      </View>

      <Text style={styles.description}>{props.description}</Text>

      <Text style={styles.colorTitle}>Colors</Text>
      <FlatList
        data={props.colors}
        horizontal
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.colorBox,
              selectedColor === item && styles.selectedColorBox, 
            ]}
            onPress={() => setSelectedColor(item)} 
          >
            <Text
              style={[
                styles.colorText,
                selectedColor === item && styles.selectedColorText, 
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: "#5A31F4",
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginRight: 10,
    marginTop: 10,
  },
  selectedColorBox: {
    backgroundColor: "#000", 
  },
  colorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedColorText: {
    color: "#fff", 
  },
});
