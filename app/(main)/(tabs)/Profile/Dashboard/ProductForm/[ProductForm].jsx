import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, StatusBar, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addProduct, getProduct, updateProduct } from '@firebase/Product';
import Toast from 'react-native-toast-message';

export default function ProductForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: '',
    rating: '0',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [params.id]);

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

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', params.id);
      const product = await getProduct(params.id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      console.log('Fetched product:', product);
      
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        rating: product.rating?.toString() || '0',
      });
      showFeedback('success', 'Product details loaded', product.title);
    } catch (error) {
      console.error('Error fetching product:', error);
      showFeedback('error', 'Failed to load product', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) {
      errors.push('Title is required');
    }
    
    if (!formData.price.trim()) {
      errors.push('Price is required');
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.push('Price must be a valid positive number');
    }

    if (formData.stock.trim() && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      errors.push('Stock must be a valid positive number');
    }

    if (formData.rating.trim() && (isNaN(parseFloat(formData.rating)) || parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5)) {
      errors.push('Rating must be between 0 and 5');
    }

    return errors;
  };
  
  const handleSubmit = async () => {
    try {
      // Validate form data
      const errors = validateForm();
      if (errors.length > 0) {
        showFeedback('error', 'Validation Error', errors.join(', '));
        return;
      }

      setSaving(true);
      setLoading(true);
      
      // Prepare data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        rating: parseFloat(formData.rating) || 0,
        colors: formData.colors.split(',').map(color => color.trim()).filter(Boolean),
        id: isEditing ? params.id : undefined, // Make sure ID is preserved for updates
        updatedAt: new Date(),
      };

      // Show initial feedback
      showFeedback('info', isEditing ? 'Updating product...' : 'Adding product...', 'Please wait');
      
      if (isEditing) {
        console.log(`Updating product with ID: ${params.id}`, productData);
        const success = await updateProduct(params.id, productData);
        
        if (success) {
          showFeedback('success', 'Product Updated', 'Product has been updated successfully');
          
          // Allow toast to be visible before navigating back
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        const newProductId = await addProduct(productData);
        
        if (newProductId) {
          showFeedback('success', 'Product Added', `Product "${productData.title}" has been added successfully`);
          
          // Allow toast to be visible before navigating back
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          throw new Error("Failed to add product");
        }
      }
    } catch (error) {
      console.error("Operation failed:", error);
      showFeedback('error', 'Operation Failed', error.message || 'Failed to save product');
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  if (loading && !saving) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text style={styles.loadingText}>
          {isEditing ? 'Loading product...' : 'Creating product...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} disabled={saving}>
          <Ionicons name="arrow-back" size={24} color={saving ? "#ccc" : "black"} />
        </Pressable>
        <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Product title"
          editable={!saving}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Product description"
          multiline
          numberOfLines={4}
          editable={!saving}
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Product price"
          keyboardType="decimal-pad"
          editable={!saving}
        />

        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
          placeholder="Product stock"
          keyboardType="number-pad"
          editable={!saving}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          placeholder="Product category"
          editable={!saving}
        />

        <Text style={styles.label}>Colors (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={formData.colors}
          onChangeText={(text) => setFormData({ ...formData, colors: text })}
          placeholder="red, blue, green"
          editable={!saving}
        />

        <Text style={styles.label}>Rating (0-5)</Text>
        <TextInput
          style={styles.input}
          value={formData.rating}
          onChangeText={(text) => setFormData({ ...formData, rating: text })}
          placeholder="Product rating (0-5)"
          keyboardType="decimal-pad"
          editable={!saving}
        />

        <Pressable 
          style={[styles.submitButton, saving && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <View style={styles.savingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Updating...' : 'Adding...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight + 10,
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
  form: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2f2baa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#9e9dc6',
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  }
});