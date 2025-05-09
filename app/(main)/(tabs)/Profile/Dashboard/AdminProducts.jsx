import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, TextInput, StatusBar, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
// import { getAllProducts, deleteProduct } from '@firebase/Products';
import {
  getProduct,
  getAllProducts,
  updateProduct,
  addProduct,
  deleteProduct,
} from "../../../../../firebase/Product";
import Toast from 'react-native-toast-message';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ visible: false, success: false, message: '' });
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to show visual feedback based on platform
  const showFeedback = (type, message, details = '') => {
    // Use Toast for consistent UI across platforms
    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: message,
      text2: details,
      position: 'bottom',
      visibilityTime: 1500,
    });
    
    // Additional feedback for Android
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
    
    // Show status message in UI
    setDeleteStatus({
      visible: true,
      success: type === 'success',
      message: `${message}: ${details}`
    });
    
    // Auto-hide status after 3 seconds
    setTimeout(() => {
      setDeleteStatus({ visible: false, success: false, message: '' });
    }, 3000);
    
    console.log(`[${type.toUpperCase()}]: ${message} - ${details}`);
  };

  // Enhanced fetchProducts to better handle product data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      if (!productsData || productsData.length === 0) {
        console.log('No products found or empty array returned');
      } else {
        console.log(`Fetched ${productsData.length} products`);
      }
      console.log('Products data:', productsData);
      setProducts(productsData || []);
      // Don't show success toast for initial load, it's distracting
      // showFeedback('success', 'Products loaded successfully');
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
      showFeedback('error', 'Failed to load products', err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };
  
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to delete a single product
  const handleDeleteProduct = (productId, productTitle) => {
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
              showFeedback('info', 'Deleting product...', 'Please wait');
              const loadingId = Toast.show({
                type: 'info',
                text1: 'Deleting product...',
                text2: 'Please wait',
                position: 'bottom',
                visibilityTime: 1500,
              });
              
              console.log(`Starting deletion of product ${productId}`);
              const result = await deleteProduct(productId);
              
              if (result) {
                Toast.hide(loadingId);
                showFeedback(
                  'success', 
                  'Product deleted successfully', 
                  `"${productTitle}" has been removed`
                );
              }
            } catch (error) {
              console.error(`Failed to delete product ${productId}:`, error);
              showFeedback(
                'error', 
                'Failed to delete product', 
                error.message || 'Unknown error occurred'
              );
            } finally {
              fetchProducts();
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Products Management</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Show delete status message */}
      {deleteStatus.visible && (
        <View style={[
          styles.statusMessage, 
          deleteStatus.success ? styles.successMessage : styles.errorMessage
        ]}>
          <Text style={styles.statusText}>{deleteStatus.message}</Text>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => router.push('/Profile/Dashboard/ProductForm')}
        >
          <Text style={styles.buttonText}>Add New Product</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id || item._id || String(Math.random())}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        showsVerticalScrollIndicator={true}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Pressable
              style={styles.productContent}
              onPress={() => {
                router.push({
                  pathname: "/Profile/Dashboard/ProductForm/[ProductForm]",
                  params: { id: item.id }
                });
              }}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title || 'Untitled Product'}</Text>
                <Text style={styles.productPrice}>${(item.price || 0).toFixed(2)}</Text>
                <Text style={styles.productStock}>Stock: {item.stock || 0}</Text>
                {item.category.name && (
                  <Text style={styles.productCategory}>{item.category.name}</Text>
                )}
              </View>
              
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Pressable>
            
            {item.description && (
              <Text numberOfLines={2} style={styles.productDescription}>
                {item.description}
              </Text>
            )}
            {/* Individual delete button for each product */}
            <Pressable 
              style={styles.productDeleteButton}
              onPress={() => handleDeleteProduct(item.id, item.title)}
            >
              <AntDesign name="delete" size={18} color="#fff" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusMessage: {
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  successMessage: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight + 10,
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
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    fontSize: 16,
  },
  actionButtons: {
    padding: 15,
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#2f2baa',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,  // Add extra padding at the bottom
  },
  productItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    color: '#333',
  },
  productPrice: {
    fontSize: 15,
    color: '#2f2baa',
    fontWeight: 'bold',
    marginTop: 4,
  },
  productStock: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  productCategory: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 30,  // Give space for the delete button
    lineHeight: 20,
  },
  productDeleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  productDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});
