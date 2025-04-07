import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  StatusBar
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import products from "../../../../Components/data";
import { addProduct, deleteProduct } from "../../../../firebase/Product";

export default function AdminProducts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery]);

  // Handle product selection for editing
  const handleProductPress = (product) => {
    if (deleteMode) {
      handleSelectProduct(product.id);
    } else {
      router.push({
        pathname: "/Profile/Dashboard/ProductForm/[ProductForm]",
        params: { id: product.id }
      });
    }
  };

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedProducts([]);
  };

  // Handle product selection for deletion
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Delete selected products
  const handleDeleteProducts = () => {
    if (selectedProducts.length === 0) {
      Alert.alert("No Selection", "Please select products to delete.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${selectedProducts.length} product(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Call the Firebase function to delete the selected products
            selectedProducts.forEach((id) => {
              deleteProduct(id)
                .then(() => console.log(`Deleted product with ID: ${id}`))
                .catch((error) => console.error("Error deleting product:", error));
            });

            Alert.alert("Success", "Products deleted successfully");
            setSelectedProducts([]);
            setDeleteMode(false);
          }
        }
      ]
    );
  };

  // Handle individual product deletion
  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Implement actual deletion logic here
            console.log("Deleting product with ID:", productId);
            Alert.alert("Success", "Product deleted successfully");
          },
        },
      ]
    );
  };

  // Add new product
  const handleAddProduct = () => {
    // Example product data to add
    const newProductData = {
      title: "New Product",
      description: "Description of the new product",
      price: 100,
      category: "Category Name",
      createdAt: new Date(),
    };

    // Call the Firebase function to add a new product
    addProduct(newProductData)
      .then((id) => console.log("Product added with ID:", id))
      .catch((error) => console.error("Error adding product:", error));

    router.push("/Profile/Dashboard/ProductForm/[ProductForm]");
  };

  // Render product item
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/Profile/Dashboard/ProductForm/[ProductForm]",
              params: { id: item.id },
            })
          }
        >
          <Ionicons name="create-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products Management</Text>
        {!deleteMode ? (
          <TouchableOpacity onPress={toggleDeleteMode} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Buttons */}
      {deleteMode ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={toggleDeleteMode}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={handleDeleteProducts}
          >
            <Text style={styles.buttonText}>Delete ({selectedProducts.length})</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deleteButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#e6f0ff",
    borderColor: "#2f2baa",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#2f2baa",
    fontWeight: "bold",
  },
  checkboxContainer: {
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
  },
  confirmButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 60, // Adjusted to move
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2f2baa",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 80,
  },
});
