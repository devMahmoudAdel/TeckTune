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
  ToastAndroid,
  Platform,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getProduct, updateProduct, addProduct, deleteProduct } from "../../../../../../firebase/Product";
import { selectImage, uploadImage, deleteImage } from '../../../../../../supabase/laodImage';
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
  
  // Image state
  const [productImages, setProductImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [params.id]);

  // Function to show visual feedback based on platform
  const showFeedback = (type, message, details = '') => {
    // Use Toast for consistent UI across platforms
    Toast.show({
      type: type,
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

      if (product.productImages && Array.isArray(product.productImages)) {
        setProductImages(product.productImages);
      }

      showFeedback('success', 'Product details loaded', product.title);
    } catch (error) {
      console.error('Error fetching product:', error);
      showFeedback('error', 'Failed to load product', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  // Keep existing image handlers
  const handleSelectImage = async (useCamera = false) => {
    try {
      setShowImagePicker(false);
      setUploadingImage(true);
      setUploadProgress(0);
      
      const result = await selectImage(useCamera);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to select image');
      }
      
      const uploadResult = await uploadImage(
        result,
        null,
        (progress) => setUploadProgress(progress)
      );

      if (uploadResult.success) {
        const newImage = {
          url: uploadResult.url,
          filePath: uploadResult.filePath,
          fileName: uploadResult.fileName
        };
        setProductImages(prev => [...prev, newImage]);
        showFeedback('success', 'Image uploaded successfully');
      } else {
        throw new Error(uploadResult.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      showFeedback('error', 'Upload failed', error.message);
    } finally {
      setUploadingImage(false);
    }
  };

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
                await deleteImage(imageToRemove.fileName);
              }
              const newImages = [...productImages];
              newImages.splice(index, 1);
              setProductImages(newImages);
            } catch (error) {
              console.error('Error removing image:', error);
              showFeedback('error', 'Failed to remove image');
            }
          }
        }
      ]
    );
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
      const errors = validateForm();
      if (errors.length > 0) {
        showFeedback('error', 'Validation Error', errors.join(', '));
        return;
      }

      setSaving(true);
      setLoading(true);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        rating: parseFloat(formData.rating) || 0,
        colors: formData.colors.split(',').map(color => color.trim()).filter(Boolean),
        productImages: productImages,
        id: isEditing ? params.id : undefined,
        updatedAt: new Date(),
      };

      showFeedback('info', isEditing ? 'Updating product...' : 'Adding product...', 'Please wait');
      
      if (isEditing) {
        const success = await updateProduct(params.id, productData);
        
        if (success) {
          showFeedback('success', 'Product Updated', 'Product has been updated successfully');
          setTimeout(() => router.back(), 2000);
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        const newProductId = await addProduct(productData);
        if (newProductId) {
          showFeedback('success', 'Product Added', `Product "${productData.title}" has been added successfully`);
          setTimeout(() => router.back(), 2000);
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
          <Ionicons name="arrow-back" size={24} color={saving ? "#ccc" : "#2f2baa"} />
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

        <Text style={styles.label}>Images (Maximum 5)</Text>
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
                disabled={saving}
              >
                <MaterialIcons name="delete-outline" size={12} color="#ff4444" />
              </Pressable>
            </View>
          ))}
          
          {productImages.length < 5 && (
            <Pressable 
              style={styles.addImageButton}
              onPress={() => setShowImagePicker(true)}
              disabled={uploadingImage || saving}
            >
              <MaterialIcons name="add-photo-alternate" size={16} color="#2f2baa" />
              <Text style={styles.addImageText}>Add Image</Text>
            </Pressable>
          )}
        </View>

        {uploadingImage && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color="#2f2baa" />
            <Text style={styles.progressText}>
              Uploading image: {uploadProgress}%
            </Text>
          </View>
        )}

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
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            
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
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  imageContainer: {
    width: '12%', // Even smaller width
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: '#f8f8f8',
    position: 'relative',
    marginRight: 4,
    marginBottom: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  addImageButton: {
    width: '12%', // Match the image container size
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  addImageText: {
    color: '#2f2baa',
    marginTop: 2,
    fontSize: 8,
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