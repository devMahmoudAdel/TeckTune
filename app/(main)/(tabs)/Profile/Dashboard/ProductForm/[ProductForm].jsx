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
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { getProduct, updateProduct, addProduct, deleteProduct } from "../../../../../../firebase/Product";
import { selectImage, uploadImage, deleteImage } from '../../../../../../supabase/laodImage';

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
  
  // Image upload state
  const [productImages, setProductImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Rest of your existing state...

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

      // Load product images if they exist
      if (product.productImages && Array.isArray(product.productImages)) {
        setProductImages(product.productImages);
      }
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
        productImages: productImages, // Include the array of uploaded product images
        updatedAt: new Date(),
      };

      console.log(`${isEditing ? 'Updating' : 'Adding'} product with ${productImages.length} images:`, productData);

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

  // Image selection and upload handler
  const handleSelectImage = async (useCamera = false) => {
    try {
      setShowImagePicker(false);
      setUploadingImage(true);
      setUploadProgress(0);
      setUploadStatus('Preparing...');
      
      const result = await selectImage();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to select image');
      }

      setUploadStatus('Uploading...');
      
      const uploadResult = await uploadImage(
        result,
        null,
        (progress) => {
          setUploadProgress(progress);
          setUploadStatus(`Uploading: ${progress}%`);
        }
      );

      if (uploadResult.success) {
        const newImage = {
          url: uploadResult.url,
          filePath: uploadResult.filePath,
          fileName: uploadResult.fileName
        };
        
        setProductImages(prev => [...prev, newImage]);
        
        // If this is the first image, set it as the main product image
        if (productImages.length === 0 && !formData.imageUrl) {
          updateField('imageUrl', uploadResult.url);
        }
        
        setUploadStatus('Upload complete!');
        Alert.alert('Success', 'Image uploaded successfully');
      } else {
        throw new Error(uploadResult.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError(error.message || 'An unexpected error occurred');
      Alert.alert('Error', error.message || 'Failed to upload image');
    } finally {
      setTimeout(() => {
        setUploadStatus('');
        setUploadError('');
        setUploadingImage(false);
      }, 2000);
    }
  };

  // Handle image removal
  const handleRemoveImage = async (index) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const imageToRemove = productImages[index];
              
              if (imageToRemove.fileName) {
                const deleteResult = await deleteImage(imageToRemove.fileName);
                if (!deleteResult.success) {
                  console.warn('Failed to delete image from storage:', deleteResult.error);
                }
              }
              
              const newImages = [...productImages];
              newImages.splice(index, 1);
              setProductImages(newImages);
              
              if (formData.imageUrl === imageToRemove.url) {
                updateField('imageUrl', newImages.length > 0 ? newImages[0].url : '');
              }
            } catch (error) {
              console.error('Error removing image:', error);
              Alert.alert('Error', 'Failed to remove image');
            }
          }
        }
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
          <Ionicons name="arrow-back" size={24} color="#2f2baa" />
        </Pressable>
        <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        {/* Title */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={[styles.input, formTouched.title && formErrors.title && styles.inputError]}
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          placeholder="Enter product name"
          textAlign="left"
          editable={!saving && !deleting}
        />
        {renderError('title')}

        {/* Cost */}
        <Text style={styles.label}>Cost (Optional)</Text>
        <View style={styles.priceInput}>
          <TextInput
            style={[styles.input, styles.priceTextInput]}
            value={formData.cost}
            onChangeText={(text) => updateField('cost', text)}
            placeholder="Enter cost"
            keyboardType="decimal-pad"
            textAlign="left"
            editable={!saving && !deleting}
          />
          <Text style={styles.currencyLabel}>EGP</Text>
        </View>

        {/* Price */}
        <Text style={styles.label}>Price *</Text>
        <View style={styles.priceInput}>
          <TextInput
            style={[styles.input, formTouched.price && formErrors.price && styles.inputError, styles.priceTextInput]}
            value={formData.price}
            onChangeText={(text) => updateField('price', text)}
            placeholder="Enter price"
            keyboardType="decimal-pad"
            textAlign="left"
            editable={!saving && !deleting}
          />
          <Text style={styles.currencyLabel}>EGP</Text>
        </View>
        {renderError('price')}

        {/* Discounted Price */}
        <Text style={styles.label}>Discounted Price (Optional)</Text>
        <View style={styles.priceInput}>
          <TextInput
            style={[styles.input, styles.priceTextInput]}
            value={formData.discountedPrice}
            onChangeText={(text) => updateField('discountedPrice', text)}
            placeholder="Enter discounted price"
            keyboardType="decimal-pad"
            textAlign="left"
            editable={!saving && !deleting}
          />
          <Text style={styles.currencyLabel}>EGP</Text>
        </View>

        {/* Quantity */}
        <Text style={styles.label}>Quantity *</Text>
        <TextInput
          style={[styles.input]}
          value={formData.stock}
          onChangeText={(text) => updateField('stock', text)}
          placeholder="Enter quantity"
          keyboardType="number-pad"
          textAlign="left"
          editable={!saving && !deleting}
        />
        {renderError('stock')}

        {/* Always Available Switch */}
        <View style={styles.switchContainer}>
          <Text style={[styles.label, styles.switchLabel]}>Always Available</Text>
          <Switch
            value={formData.alwaysAvailable}
            onValueChange={(value) => updateField('alwaysAvailable', value)}
            disabled={saving || deleting}
            trackColor={{ false: '#d3d3d3', true: '#8f8dd8' }}
            thumbColor={formData.alwaysAvailable ? '#2f2baa' : '#f4f3f4'}
          />
        </View>

        {/* Description */}
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Product details and specifications"
          multiline
          numberOfLines={4}
          textAlign="left"
          textAlignVertical="top"
          editable={!saving && !deleting}
          maxLength={4000}
        />
        <Text style={styles.charCount}>{formData.description?.length || 0}/4000</Text>

        {/* Images Section */}
        <Text style={styles.label}>Images (Maximum 10 images)</Text>
        <View style={styles.imageGrid}>
          {productImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image 
                source={{ uri: image.url }} 
                style={styles.productImage}
                resizeMode="cover"
              />
              <Pressable 
                style={styles.removeImageButton}
                onPress={() => handleRemoveImage(index)}
                disabled={saving || deleting}
              >
                <MaterialIcons name="delete-outline" size={20} color="#ff4444" />
              </Pressable>
            </View>
          ))}
          {productImages.length < 10 && (
            <Pressable 
              style={styles.addImageButton}
              onPress={() => setShowImagePicker(true)}
              disabled={uploadingImage || saving || deleting}
            >
              <MaterialIcons name="add-photo-alternate" size={32} color="#2f2baa" />
              <Text style={styles.addImageText}>Add Image</Text>
            </Pressable>
          )}
        </View>

        {/* Upload Progress */}
        {uploadingImage && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color="#2f2baa" />
            <Text style={styles.progressText}>Uploading image...</Text>
          </View>
        )}

        {/* Add Group Dropdown */}
        <Text style={styles.label}>Groups</Text>
        <Pressable style={styles.groupSelector}>
          <Text style={styles.groupSelectorText}>Add product to a group</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
        </Pressable>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.submitButton, saving && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={styles.submitButtonText}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowImagePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Image</Text>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleSelectImage(false)}
            >
              <MaterialIcons name="photo-library" size={24} color="#2f2baa" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleSelectImage(true)}
            >
              <MaterialIcons name="camera-alt" size={24} color="#2f2baa" />
              <Text style={styles.modalOptionText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    padding: 20,
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
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
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
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: -12,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  switchLabel: {
    marginLeft: 0,
    marginRight: 8,
    marginBottom: 0,
  },
  imagesLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'left',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  imageContainer: {
    width: (Platform.OS === 'web' ? 100 : '23%'),
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  addImageButton: {
    width: (Platform.OS === 'web' ? 100 : '23%'),
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressText: {
    marginLeft: 8,
    color: '#2f2baa',
    fontSize: 14,
  },
  groupSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  groupSelectorText: {
    color: '#666',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2f2baa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#2f2baa',
    marginLeft: 12,
    fontWeight: '500',
  },
});