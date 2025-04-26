// Simple AdminProducts Page - Displays products with CRUD functionality
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, TextInput, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { getAllProducts, deleteProduct } from '../../../../../firebase/Product.js';

export default function AdminProducts() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]); // Stores all products
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error state
  const [searchQuery, setSearchQuery] = useState(''); // Search input
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const router = useRouter();

  // --- LIFECYCLE HOOKS ---
  // Load products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);
  // --- DATA FETCHING ---
  // Fetch all products from Firebase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      setProducts(productsData || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- EVENT HANDLERS ---
  // Refresh products list
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle product deletion with confirmation
  const handleDeleteProduct = (productId, productTitle) => {
    if (!productId) return;
    
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${productTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(String(productId));
              // Refresh products list after deletion
              await fetchProducts();
            } catch (error) {
              console.error(`Failed to delete product ${productId}:`, error);
            }
          },
        },
      ]
    );  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // --- RENDER UI ---
  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Products Management</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Add new product button */}
      <View style={styles.actionButtons}>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/Profile/Dashboard/ProductForm')}
        >          <Text style={styles.buttonText}>Add New Product</Text>
        </Pressable>
      </View>

      {/* Products list */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id || String(Math.random())}
        contentContainerStyle={styles.listContainer}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No products found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            {/* Product card (clickable) */}
            <Pressable
              style={styles.productContent}
              onPress={() => {
                router.push({
                  pathname: "/Profile/Dashboard/ProductForm/[ProductForm]",
                  params: { id: item.id }
                });
              }}
            >
              {/* Product info */}
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title || 'Untitled Product'}</Text>
                <Text style={styles.productPrice}>${(item.price || 0).toFixed(2)}</Text>
                <Text>Stock: {item.stock || 0}</Text>
                {item.category && <Text>{item.category}</Text>}
              </View>
              
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Pressable>
            
            {/* Product description (if available) */}
            {item.description && (
              <Text numberOfLines={2} style={styles.productDescription}>
                {item.description}
              </Text>
            )}
            
            {/* Delete button */}
            <Pressable 
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item.id, item.title || 'Untitled Product')}
            >
              <AntDesign name="delete" size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>          </View>
        )}
      />
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  actionButtons: {
    padding: 15,
    alignItems: 'center',
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2f2baa',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  productItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    paddingRight: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 15,
    color: '#2f2baa',
    fontWeight: 'bold',
    marginTop: 4,
  },
  productDescription: {
    marginTop: 8,
    marginBottom: 40,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
  },
});
