// Simple ProductForm Page - Add/Edit/Delete product functionality
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProduct, updateProduct, addProduct, deleteProduct } from "../../../../../../firebase/Product";

export default function ProductForm() {
  // --- INITIALIZATION & ROUTING ---
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id; // Check if we're editing an existing product
  
  // --- STATE MANAGEMENT ---
  // Form data for the product
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: '',
    rating: '0',
  });
  
  // UI states
  const [loading, setLoading] = useState(isEditing); // Loading state for initial data fetch
  const [saving, setSaving] = useState(false);       // Saving state while submitting form
  const [deleting, setDeleting] = useState(false);   // Deleting state while deleting product
  
  // --- DATA FETCHING ---
  // Fetch product data when editing existing product
  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [params.id]);
  // Fetch product details from Firebase
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProduct(params.id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Populate form with product data
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        rating: product.rating?.toString() || '0',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- FORM VALIDATION ---
  const validateForm = () => {
    const errors = [];
    
    // Title is required
    if (!formData.title.trim()) {
      errors.push('Title is required');
    }
    
    // Price must be a valid positive number
    if (!formData.price.trim()) {
      errors.push('Price is required');
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.push('Price must be a valid positive number');
    }

    // Stock must be a valid non-negative number if provided
    if (formData.stock.trim() && (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      errors.push('Stock must be a valid positive number');
    }

    // Rating must be between 0-5 if provided
    if (formData.rating.trim() && (isNaN(parseFloat(formData.rating)) || parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5)) {
      errors.push('Rating must be between 0 and 5');
    }

    return errors;
  };
    // --- EVENT HANDLERS ---
  // Handle form submission (add/update product)
  const handleSubmit = async () => {
    try {
      // Validate form
      const errors = validateForm();
      if (errors.length > 0) {
        Alert.alert('Validation Error', errors.join('\n'));
        return;
      }

      setSaving(true);
      
      // Prepare data - convert strings to appropriate types
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        rating: parseFloat(formData.rating) || 0,
        colors: formData.colors.split(',').map(color => color.trim()).filter(Boolean),
        id: isEditing ? params.id : undefined,
        updatedAt: new Date(),
      };

      if (isEditing) {
        // Update existing product
        const success = await updateProduct(params.id, productData);
        if (success) {
          Alert.alert('Success', 'Product updated successfully');
          setTimeout(() => router.back(), 1000);
        }
      } else {
        // Add new product
        const newProductId = await addProduct(productData);
        if (newProductId) {
          Alert.alert('Success', 'Product added successfully');
          setTimeout(() => router.back(), 1000);
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = () => {
    if (!params.id) return;
    
    // Show confirmation dialog
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${formData.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              // Convert ID to string to ensure proper format
              await deleteProduct(String(params.id));
              Alert.alert('Success', 'Product deleted successfully');
              setTimeout(() => router.back(), 1000);
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete product');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };
  // --- LOADING STATE ---
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text>{isEditing ? 'Loading product...' : 'Preparing form...'}</Text>
      </View>
    );
  }

  // --- RENDER UI ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} disabled={saving || deleting}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <ScrollView style={styles.form}>
        {/* Required fields */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Product title"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Product price"
          keyboardType="decimal-pad"
          editable={!saving && !deleting}
        />

        {/* Optional fields */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Product description"
          multiline
          numberOfLines={4}
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={styles.input}
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
          placeholder="Product stock"
          keyboardType="number-pad"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          placeholder="Product category"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Colors (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={formData.colors}
          onChangeText={(text) => setFormData({ ...formData, colors: text })}
          placeholder="red, blue, green"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Rating (0-5)</Text>
        <TextInput
          style={styles.input}
          value={formData.rating}
          onChangeText={(text) => setFormData({ ...formData, rating: text })}
          placeholder="0 to 5"
          keyboardType="decimal-pad"
          editable={!saving && !deleting}
        />

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          {/* Submit button */}
          <Pressable 
            style={[styles.button, styles.submitButton, (saving || deleting) && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={saving || deleting}
          >
            {saving ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </Text>
            )}
          </Pressable>

          {/* Delete button - Only show when editing */}
          {isEditing && (
            <Pressable 
              style={[styles.button, styles.deleteButton, (deleting || saving) && styles.disabledButton]} 
              onPress={handleDeleteProduct}
              disabled={deleting || saving}
            >
              {deleting ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Deleting...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Delete Product</Text>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#2f2baa',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});