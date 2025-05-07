import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getProduct, updateProduct, addProduct, deleteProduct } from "../../../../../../firebase/Product";

export default function ProductForm() {
  // Router and params setup
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  
  // Form state management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: '',
    rating: '0',
    imageUrl: '',
    brand: '',
    featured: false
  });
  
  // UI state management
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  
  // Load product data when editing
  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [params.id]);

  // Fetch product details
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
        imageUrl: product.imageUrl || '',
        brand: product.brand || '',
        featured: product.featured || false
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Update form field and validate
  const updateField = (field, value) => {
    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    if (!formTouched[field]) {
      setFormTouched(prev => ({
        ...prev,
        [field]: true
      }));
    }
    
    // Validate field
    validateField(field, value);
  };
  
  // Validate a single field
  const validateField = (field, value) => {
    let error = null;
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (value.length < 3) {
          error = 'Title must be at least 3 characters';
        }
        break;
        
      case 'price':
        if (!value.trim()) {
          error = 'Price is required';
        } else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          error = 'Price must be a valid positive number';
        }
        break;
        
      case 'stock':
        if (value.trim() && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
          error = 'Stock must be a valid positive number';
        }
        break;
        
      case 'rating':
        if (value.trim() && (isNaN(parseFloat(value)) || parseFloat(value) < 0 || parseFloat(value) > 5)) {
          error = 'Rating must be between 0 and 5';
        }
        break;
        
      case 'imageUrl':
        const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (value.trim() && !urlPattern.test(value)) {
          error = 'Must be a valid URL';
        }
        break;
    }
    
    // Update errors
    setFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return !error;
  };
  
  // Validate all form fields
  const validateForm = () => {
    const fields = ['title', 'price', 'stock', 'rating', 'imageUrl'];
    let isValid = true;
    
    // Touch all fields to show errors
    const newTouched = {};
    fields.forEach(field => {
      newTouched[field] = true;
      const fieldValid = validateField(field, formData[field]);
      isValid = isValid && fieldValid;
    });
    
    setFormTouched(newTouched);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        Alert.alert('Validation Error', 'Please fix the errors in the form before submitting.');
        return;
      }

      setSaving(true);
      
      // Prepare product data with proper type conversions
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        rating: parseFloat(formData.rating) || 0,
        colors: formData.colors.split(',').map(color => color.trim()).filter(Boolean),
        category: formData.category.trim(),
        imageUrl: formData.imageUrl.trim(),
        brand: formData.brand.trim(),
        featured: Boolean(formData.featured),
        updatedAt: new Date(),
      };

      console.log(`${isEditing ? 'Updating' : 'Adding'} product:`, productData);

      if (isEditing) {
        // Update existing product
        console.log("Updating product with ID:", params.id);
        const success = await updateProduct(params.id, productData);
        
        if (success) {
          Alert.alert('Success', 'Product updated successfully');
          setTimeout(() => router.back(), 1000);
        } else {
          throw new Error('Failed to update product');
        }
      } else {
        // Add new product
        const newProductId = await addProduct(productData);
        if (newProductId) {
          Alert.alert('Success', 'Product added successfully');
          setTimeout(() => router.back(), 1000);
        } else {
          throw new Error('Failed to add product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Delete product handler
  const handleDeleteProduct = () => {
    if (!params.id) return;
    
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
              
              console.log(`Attempting to delete product: ${params.id}`);
              const result = await deleteProduct(String(params.id));
              
              if (result) {
                Alert.alert('Success', 'Product deleted successfully');
                setTimeout(() => router.back(), 1000);
              } else {
                throw new Error('Failed to delete product. Operation returned false.');
              }
            } catch (error) {
              console.error('Error during product deletion:', error);
              Alert.alert('Error', error.message || 'Failed to delete product');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Helper to render error message
  const renderError = (field) => {
    if (formTouched[field] && formErrors[field]) {
      return (
        <Text style={styles.errorText}>
          {formErrors[field]}
        </Text>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text style={styles.loadingText}>{isEditing ? 'Loading product...' : 'Preparing form...'}</Text>
      </View>
    );
  }

  // Main UI
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
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
        {/* Product Image Preview */}
        {formData.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: formData.imageUrl }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
            <Pressable 
              style={styles.clearImageButton}
              onPress={() => updateField('imageUrl', '')}
            >
              <Ionicons name="close-circle" size={24} color="#ff4444" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="image" size={48} color="#ccc" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Required Fields */}
        <Text style={styles.sectionTitle}>Required Information</Text>
        
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, formTouched.title && formErrors.title && styles.inputError]}
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          placeholder="Product title"
          editable={!saving && !deleting}
        />
        {renderError('title')}

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={[styles.input, formTouched.price && formErrors.price && styles.inputError]}
          value={formData.price}
          onChangeText={(text) => updateField('price', text)}
          placeholder="Product price"
          keyboardType="decimal-pad"
          editable={!saving && !deleting}
        />
        {renderError('price')}

        {/* Optional Fields */}
        <Text style={styles.sectionTitle}>Product Details</Text>
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Product description"
          multiline
          numberOfLines={4}
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Stock</Text>
        <TextInput
          style={[styles.input, formTouched.stock && formErrors.stock && styles.inputError]}
          value={formData.stock}
          onChangeText={(text) => updateField('stock', text)}
          placeholder="Product stock"
          keyboardType="number-pad"
          editable={!saving && !deleting}
        />
        {renderError('stock')}

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => updateField('category', text)}
          placeholder="Product category"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          value={formData.brand}
          onChangeText={(text) => updateField('brand', text)}
          placeholder="Product brand"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Colors (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={formData.colors}
          onChangeText={(text) => updateField('colors', text)}
          placeholder="red, blue, green"
          editable={!saving && !deleting}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={[styles.input, formTouched.imageUrl && formErrors.imageUrl && styles.inputError]}
          value={formData.imageUrl}
          onChangeText={(text) => updateField('imageUrl', text)}
          placeholder="https://example.com/image.jpg"
          editable={!saving && !deleting}
        />
        {renderError('imageUrl')}

        <Text style={styles.sectionTitle}>Additional Information</Text>

        <Text style={styles.label}>Rating (0-5)</Text>
        <TextInput
          style={[styles.input, formTouched.rating && formErrors.rating && styles.inputError]}
          value={formData.rating}
          onChangeText={(text) => updateField('rating', text)}
          placeholder="0 to 5"
          keyboardType="decimal-pad"
          editable={!saving && !deleting}
        />
        {renderError('rating')}
        
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Featured Product</Text>
          <Switch
            value={formData.featured}
            onValueChange={(value) => updateField('featured', value)}
            disabled={saving || deleting}
            trackColor={{ false: '#d3d3d3', true: '#8f8dd8' }}
            thumbColor={formData.featured ? '#2f2baa' : '#f4f3f4'}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Submit Button */}
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
              <View style={styles.buttonContent}>
                <FontAwesome name={isEditing ? "save" : "plus"} size={18} color="#fff" />
                <Text style={styles.buttonText}>
                  {isEditing ? 'Update Product' : 'Add Product'}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Delete Button - Only show when editing */}
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
                <View style={styles.buttonContent}>
                  <FontAwesome name="trash" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Delete Product</Text>
                </View>
              )}
            </Pressable>
          )}

          {/* Cancel Button */}
          <Pressable 
            style={[styles.button, styles.cancelButton, (saving || deleting) && styles.disabledButton]} 
            onPress={() => router.back()}
            disabled={saving || deleting}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="close" size={18} color="#666" />
              <Text style={[styles.buttonText, {color: '#666'}]}>Cancel</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight + 10 || 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f2baa',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff0f0',
  },
  errorText: {
    color: '#ff4444',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  clearImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#aaa',
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 5,
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
    elevation: 1,
  },
  submitButton: {
    backgroundColor: '#2f2baa',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
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