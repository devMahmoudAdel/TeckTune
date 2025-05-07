import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { getAllProducts, deleteProduct } from '../../../../../firebase/Product';

export default function AdminProducts() {
  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ visible: false, success: false, message: '' });
  const router = useRouter();

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to show visual feedback
  const showFeedback = (type, message, details = '') => {
    // Platform specific feedback
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
      message: `${message}${details ? ': ' + details : ''}`
    });
    
    // Auto-hide status after 3 seconds
    setTimeout(() => {
      setDeleteStatus({ visible: false, success: false, message: '' });
    }, 3000);
    
    console.log(`[${type.toUpperCase()}]: ${message} - ${details}`);
  };

  // Data fetching function
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      
      if (!productsData || productsData.length === 0) {
        console.log('No products found or empty array returned');
      } else {
        console.log(`Fetched ${productsData.length} products`);
      }
      
      setProducts(productsData || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
      showFeedback('error', 'Failed to load products', err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Search filter
  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete product handler
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
              // Show initial feedback
              showFeedback('info', 'Deleting product...', 'Please wait');
              
              console.log(`Starting deletion of product ${productId}`);
              const result = await deleteProduct(String(productId));
              
              if (result) {
                // Show success before refreshing products for better UX
                showFeedback(
                  'success', 
                  'Product deleted successfully', 
                  `"${productTitle}" has been removed`
                );
                
                // Refresh products
                await fetchProducts();
              }
            } catch (error) {
              console.error(`Failed to delete product ${productId}:`, error);
              showFeedback(
                'error', 
                'Failed to delete product', 
                error.message || 'Unknown error occurred'
              );
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Main UI render
  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Add Product Button */}
      <View style={styles.actionButtons}>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/Profile/Dashboard/ProductForm')}
        >
          <Text style={styles.buttonText}>Add New Product</Text>
        </Pressable>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id || String(Math.random())}
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
            <Pressable
              style={[styles.addButton, {marginTop: 20}]}
              onPress={() => router.push('/Profile/Dashboard/ProductForm')}
            >
              <Text style={styles.buttonText}>Add New Product</Text>
            </Pressable>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Pressable
              style={styles.productContent}
              onPress={() => router.push({
                pathname: "/Profile/Dashboard/ProductForm/[ProductForm]",
                params: { id: item.id }
              })}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>
                  {item.title || 'Untitled Product'}
                </Text>
                <Text style={styles.productPrice}>
                  ${(item.price || 0).toFixed(2)}
                </Text>
                <Text style={styles.productStock}>
                  Stock: {item.stock || 0}
                </Text>
                {item.category && (
                  <Text style={styles.productCategory}>{item.category}</Text>
                )}
              </View>
              
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Pressable>
            
            {item.description && (
              <Text numberOfLines={2} style={styles.productDescription}>
                {item.description}
              </Text>
            )}
            
            <Pressable 
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item.id, item.title || 'Untitled Product')}
            >
              <AntDesign name="delete" size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight || 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  statusMessage: {
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
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
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
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
    paddingTop: 0,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2f2baa',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
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
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  productDescription: {
    marginTop: 8,
    marginBottom: 40,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
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
    elevation: 1,
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
