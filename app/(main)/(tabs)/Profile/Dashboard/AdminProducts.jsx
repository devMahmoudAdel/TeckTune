import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, TextInput, StatusBar, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAllProducts, deleteProduct } from '@firebase/Product';
import Toast from 'react-native-toast-message';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
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
      visibilityTime: 3000,
    });
    
    // Additional feedback for Android
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
    
    console.log(`[${type.toUpperCase()}]: ${message} - ${details}`);
  };

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
      showFeedback('success', 'Products loaded successfully');
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
      showFeedback('error', 'Failed to load products', err.message);
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

  const toggleProductSelection = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleDeleteSelected = async () => {
    const selectedCount = selectedProducts.size;
    const selectedIds = Array.from(selectedProducts);
    
    if (selectedCount === 0) {
      showFeedback('info', 'No products selected', 'Please select products to delete');
      return;
    }
    
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedCount} products?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Show initial feedback
              showFeedback('info', 'Deleting products...', 'Please wait');
              
              // Track success and failures
              let successCount = 0;
              let failureCount = 0;
              
              // Delete products one by one to handle individual failures
              for (const id of selectedIds) {
                try {
                  await deleteProduct(id);
                  successCount++;
                } catch (err) {
                  console.error(`Failed to delete product ${id}:`, err);
                  failureCount++;
                }
              }
              
              // Clear selection regardless of outcome
              setSelectedProducts(new Set());
              setIsDeleteMode(false);
              
              // Show appropriate feedback based on results
              if (failureCount === 0) {
                showFeedback(
                  'success', 
                  'Products deleted successfully', 
                  `${successCount} products removed`
                );
              } else if (successCount > 0) {
                showFeedback(
                  'info', 
                  'Some products deleted', 
                  `${successCount} deleted, ${failureCount} failed`
                );
              } else {
                showFeedback(
                  'error', 
                  'Failed to delete products', 
                  'Please try again later'
                );
              }
              
              // Refresh product list
              await fetchProducts();
            } catch (error) {
              console.error('Delete operation error:', error);
              showFeedback(
                'error', 
                'Delete operation failed', 
                error.message || 'Unknown error occurred'
              );
            } finally {
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
        <Pressable onPress={() => setIsDeleteMode(!isDeleteMode)}>
          <Ionicons name={isDeleteMode ? "close" : "trash"} size={24} color={isDeleteMode ? "red" : "black"} />
        </Pressable>
      </View>

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
        
        {isDeleteMode && (
          <View style={styles.deleteActions}>
            <Text style={styles.selectedCount}>
              Selected: {selectedProducts.size}
            </Text>
            <Pressable
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteSelected}
              disabled={selectedProducts.size === 0}
            >
              <Text style={styles.buttonText}>Delete Selected</Text>
            </Pressable>
          </View>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.productItem,
              selectedProducts.has(item.id) && styles.selectedItem,
            ]}
            onPress={() => {
              if (isDeleteMode) {
                toggleProductSelection(item.id);
              } else {
                router.push({
                  pathname: "/Profile/Dashboard/ProductForm/[ProductForm]",
                  params: { id: item.id }
                });
              }
            }}
            onLongPress={() => {
              setIsDeleteMode(true);
              toggleProductSelection(item.id);
              Toast.show({
                type: 'info',
                text1: 'Delete mode activated',
                text2: 'Select items to delete',
                position: 'bottom'
              });
            }}
          >
            <View style={styles.productContent}>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productPrice}>${item.price?.toFixed(2)}</Text>
                <Text style={styles.productStock}>Stock: {item.stock || 0}</Text>
                {item.category && (
                  <Text style={styles.productCategory}>{item.category}</Text>
                )}
              </View>
              {selectedProducts.has(item.id) ? (
                <MaterialIcons name="check-circle" size={24} color="#2f2baa" />
              ) : (
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              )}
            </View>
            {item.description && (
              <Text numberOfLines={2} style={styles.productDescription}>
                {item.description}
              </Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 10,
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
  deleteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  selectedCount: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  productItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
    borderColor: '#2f2baa',
    borderWidth: 1,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
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
    lineHeight: 20,
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
