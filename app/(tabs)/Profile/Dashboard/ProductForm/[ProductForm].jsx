import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import data from "../../../../../Components/data";
import { useLocalSearchParams } from "expo-router";
export default function ProductForm() {
  const { id } = useLocalSearchParams();
  const existingProduct = data.find((product) => product.id === Number(id));
  const [title, setTitle] = useState(existingProduct?.title || "");
  const [price, setPrice] = useState(existingProduct?.price.toString() || "");
  const [description, setDescription] = useState(existingProduct?.description || "");
  const [images, setImages] = useState(existingProduct?.images.join(", ") || "");
  const [rating, setRating] = useState(existingProduct?.rating.toString() || "");
  const [colors, setColors] = useState(existingProduct?.colors.join(", ") || "");

  const isExisting = !!existingProduct;

  const validateFields = () => {
    if (!title || !price || !description || !images || !rating || !colors) {
      Alert.alert("Validation Error", "Please fill all the fields.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateFields()) {
      Alert.alert("Confirm", "Are you sure you want to save this new product?", [
        { text: "Cancel" },
        { text: "Save", onPress: () => console.log("Product saved") },
      ]);
    }
  };

  const handleUpdate = () => {
    if (validateFields()) {
      Alert.alert("Confirm", "Are you sure you want to update this product?", [
        { text: "Cancel" },
        { text: "Update", onPress: () => console.log("Product updated") },
      ]);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      { text: "Cancel" },
      { text: "Delete", onPress: () => console.log("Product deleted") },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Product title"
        style={styles.input}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Product price"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Product description"
        style={styles.input}
      />

      <Text style={styles.label}>Images (comma separated URLs)</Text>
      <TextInput
        value={images}
        onChangeText={setImages}
        placeholder="image1.jpg, image2.jpg"
        style={styles.input}
      />

      <Text style={styles.label}>Rating</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        placeholder="Product rating"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Colors</Text>
      <TextInput
        value={colors}
        onChangeText={setColors}
        placeholder="red, blue, green"
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        {isExisting ? (
          <>
            <Button title="Update" color="#4CAF50" onPress={handleUpdate} />
            <View style={styles.space} />
            <Button title="Delete" color="#F44336" onPress={handleDelete} />
          </>
        ) : (
          <Button title="Save" color="#2196F3" onPress={handleSave} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    paddingHorizontal: "5%",
    paddingVertical: "10%",
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  space: {
    height: 10,
  },
});

