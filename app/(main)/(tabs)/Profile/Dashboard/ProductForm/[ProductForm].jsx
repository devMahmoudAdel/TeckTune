import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, StatusBar, ActivityIndicator, ToastAndroid, Platform, Image, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
// import { addProduct, getProduct, updateProduct } from '@firebase/Product';
import {
  getProduct,
  getAllProducts,
  updateProduct,
  addProduct,
  deleteProduct,
} from "../../../../../../firebase/Product";
import { getAllCategories, getCategory } from "../../../../../../firebase/Category";
import { getAllBrands, getBrand } from "../../../../../../firebase/Brand";
import Toast from 'react-native-toast-message';
import { takePhoto, selectImage, uploadImage } from '../../../../../../supabase/loadImage';

export default function ProductForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [percent, setPercent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    price: '',
    stock: '',
    category: '',
    brand: '',
    colors: '',
    rating: '0',
    refreshed: false,
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isEditing) {
        fetchProduct();
      }
    }, [params.id])
  );

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategories();
      const formattedCategories = categoriesData.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      setCategories(formattedCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
      showFeedback('error', 'Failed to load categories', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const brandsData = await getAllBrands();
      const formattedBrands = brandsData.map((brand) => ({
        label: brand.name,
        value: brand.id,
      }));
      setBrands(formattedBrands);
    } catch (err) {
      console.error('Failed to load brands:', err);
      showFeedback('error', 'Failed to load brands', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProduct(params.id);

      if (!product) {
        throw new Error('Product not found');
      }

      console.log('Fetched product:', product);
      const category = product.category;
      setSelectedCategory({ label: category.name, value: category.id });
      const brand = product.brand;
      setSelectedBrand({ label: brand.name, value: brand.id });
      setFormData({
        title: product.title || '',
        description: product.description || '',
        images: product.images || [],
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: category.id || '',
        brand: brand.id || '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        rating: product.rating?.toString() || '0',
        refreshed: product.refreshed || false,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
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

    if (!formData.category.trim()) {
      errors.push('Category is required');
    }

    if (!formData.brand.trim()) {
      errors.push('Brand is required');
    }

    if (!formData.colors.trim()) {
      errors.push('Colors are required');
    }

    if (formData.images.length === 0) {
      errors.push('At least one image is required');
    }

    return errors;
  };

  const showFeedback = (type, title, message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        `${title}: ${message}`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    } else {
      Toast.show({
        type: type, // 'success', 'error', 'info'
        text1: title,
        text2: message,
        position: 'bottom',
        visibilityTime: 1500,
      });
    }
  };

  const handleTakePhoto = async () => {
    setShowImagePicker(true);
    const image = await takePhoto();
    if (image.success) {
      setShowImagePicker(false);
      const uploadedImage = await uploadImage(image, null, (percent) => { setPercent(percent) });
      if (uploadedImage.success) {
        setFormData({ ...formData, images: [...formData.images, uploadedImage.url] });
        setPercent(0);
      }
    }
  };

  const handleSelectImage = async () => {
    setShowImagePicker(true);
    const image = await selectImage();
    if (image.success) {
      setShowImagePicker(false);
      const uploadedImage = await uploadImage(image, null, (percent) => {
        setPercent(percent);
      });
      if (uploadedImage.success) {
        setFormData({ ...formData, images: [...formData.images, uploadedImage.url] });
        setPercent(0);
      }
    }
  };

  const handleDeleteImage = (image) => {
    setFormData({ ...formData, images: formData.images.filter((img) => img !== image) })
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
      const { price, stock, rating, colors, images } = formData;
      const productData = {
        ...formData,
        price: parseFloat(price),
        stock: parseInt(stock, 10) || 0,
        rating: parseFloat(rating) || 0,
        colors: colors
          .split(',')
          .map((color) => color.trim())
          .filter(Boolean),
        images: Array.isArray(images) ? images : [images],
        id: isEditing ? params.id : undefined,
        updatedAt: new Date(),
      };

      const actionLabel = isEditing ? 'Updating product...' : 'Adding product...';
      showFeedback('info', actionLabel, 'Please wait');

      let result;
      if (isEditing) {
        result = await updateProduct(params.id, productData);
        showFeedback('success', 'Product Updated', 'Product has been updated successfully');
      } else {
        result = await addProduct(productData);
        showFeedback('success', 'Product Added', `Product "${productData.title}" has been added successfully`);
      }

      setTimeout(() => router.back(), 2000);
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

        <Text style={styles.label}>Images (up to 5 images)</Text>
        <View style={styles.imagesContainer}>
          {formData.images.length < 5 && <Pressable style={styles.addImg} onPress={() => setShowImagePicker(true)}>
            <Text style={styles.uploadText}>+</Text>
          </Pressable>}
          <FlatList
            data={formData.images}
            renderItem={({ item }) => (
              <View style={{ margin: 5 }}>
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                />
                <MaterialIcons name="delete" size={24} color="red" style={styles.deleteIcon} onPress={() => handleDeleteImage(item)} />
              </View>
            )}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

        </View>
        {percent > 0 && percent < 100 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${percent}%` }]} />
            <Text style={styles.progressText}>{percent}%</Text>
          </View>
        )}
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

        <Text style={styles.label}>Category *</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select category..."
          maxHeight={300}
          value={selectedCategory}
          onChange={(item) => {
            setSelectedCategory(item.value);
            setFormData({ ...formData, category: item.value });
          }}
        />
        <Text style={styles.label}>Brand *</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={brands}
          labelField="label"
          valueField="value"
          placeholder="Select Brand..."
          maxHeight={300}
          value={selectedBrand}
          onChange={(item) => {
            setSelectedBrand(item.value);
            setFormData({ ...formData, brand: item.value });
          }}
        />
        <Text style={styles.label}>Colors (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={formData.colors}
          onChangeText={(text) => setFormData({ ...formData, colors: text })}
          placeholder="red, blue, green"
          editable={!saving}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Refreshed Product</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData.refreshed ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => setFormData({ ...formData, refreshed: !formData.refreshed })}
          >
            <View style={[
              styles.toggleCircle,
              formData.refreshed ? styles.toggleCircleRight : styles.toggleCircleLeft
            ]} />
          </TouchableOpacity>
          <Text style={styles.toggleLabel}>
            {formData.refreshed ? 'Yes - Show in Refreshed Section' : 'No - Show in Main Section'}
          </Text>
        </View>

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
              onPress={() => handleTakePhoto()}
            >
              <MaterialIcons name="camera-alt" size={24} color="#2f2baa" />
              <Text style={styles.modalOptionText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSelectImage()}
            >
              <MaterialIcons name="photo-library" size={24} color="#2f2baa" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
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
    marginBottom: 80,
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
  addImg: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e2e2',
    borderRadius: 6,
    borderStyle: 'dashed',
    borderColor: '#919191',
    borderWidth: 2,
    marginVertical: 15,
  },
  uploadText: {
    color: '#919191',
    fontSize: 25,
    padding: 5
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 8
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 2,
    borderRadius: 50,
    backgroundColor: 'white'
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    height: 25,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  progressBar: {
    height: '5',
    backgroundColor: '#2f2baa',
  },
  progressText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  switchContainer: {
    marginBottom: 20,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    marginVertical: 8,
  },
  toggleActive: {
    backgroundColor: '#2f2baa',
  },
  toggleInactive: {
    backgroundColor: '#ccc',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleCircleLeft: {
    alignSelf: 'flex-start',
  },
  toggleCircleRight: {
    alignSelf: 'flex-end',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});