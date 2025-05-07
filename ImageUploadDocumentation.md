# TeckTune Image Upload System Documentation

## Overview

This document outlines the image upload functionality implemented in the TeckTune application. The system allows users to upload up to 5 images per product to Supabase storage, with the image references stored in Firebase. The implementation includes a progress bar, image selection from gallery or camera, and proper error handling.

## Components Added

### 1. Supabase Integration (in `supabase/initSupabase.js`)

Two primary functions were added to handle image selection and uploading:

#### SelectImage Function
```javascript
export const SelectImage = async (useCamera = false) => {
  try {
    // Request permission first
    if (Platform.OS !== 'web') {
      const permissionType = useCamera 
        ? ImagePicker.requestCameraPermissionsAsync()
        : ImagePicker.requestMediaLibraryPermissionsAsync();
        
      const { status } = await permissionType;
      if (status !== 'granted') {
        return {
          success: false,
          error: `Permission to access ${useCamera ? 'camera' : 'media library'} was denied`
        };
      }
    }

    // Launch the image picker or camera
    const pickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    };
    
    const result = useCamera 
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync(pickerOptions);

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, error: 'Image selection was cancelled' };
    }

    const asset = result.assets[0];
    return {
      success: true,
      uri: asset.uri,
      base64: asset.base64,
      width: asset.width,
      height: asset.height,
      fileType: asset.uri.split('.').pop() || 'jpg',
    };
  } catch (error) {
    console.error('Error selecting image:', error);
    return { success: false, error: error.message || 'Failed to select image' };
  }
};
```

#### UploadImage Function
```javascript
export const UploadImage = async (
  imageData,
  customFilename = null,
  progressCallback = null
) => {
  try {
    if (!imageData || !imageData.success || !imageData.base64) {
      return { success: false, error: 'Invalid image data' };
    }

    // Check if bucket exists and create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const productsBucket = buckets?.find(bucket => bucket.name === 'products');
    
    if (!productsBucket) {
      // Create the bucket if it doesn't exist
      const { error: createBucketError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createBucketError) {
        console.error('Error creating storage bucket:', createBucketError);
        return { success: false, error: 'Failed to create storage bucket' };
      }
    }

    // Generate a unique filename if not provided
    const filename = customFilename || `${uuidv4()}.${imageData.fileType}`;
    const filePath = `product-images/${filename}`;
    
    // Convert base64 to ArrayBuffer for upload
    const base64Data = imageData.base64;
    const arrayBuffer = decode(base64Data);

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${imageData.fileType}`,
        upsert: true,
        onUploadProgress: progressCallback 
          ? ({ percent }) => progressCallback(Math.round(percent * 100)) 
          : undefined
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { success: false, error: error.message || 'Failed to upload image' };
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return { 
      success: true, 
      filePath, 
      url: publicUrl,
      filename
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message || 'Failed to upload image' };
  }
};
```

### 2. Firebase Integration (in `firebase/Product.js`)

The Product.js file was updated to handle storing image references in Firebase:

```javascript
const updateProduct = async (id, product) => {
  try {
    const productDocRef = doc(collection(db, 'products'), id);
    
    // Create an updated product object that includes all fields from the form
    const updatedProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      colors: product.colors,
      rating: product.rating,
      imageUrl: product.imageUrl,
      brand: product.brand,
      featured: product.featured,
      productImages: product.productImages || [], // Include the array of Supabase images
      updatedAt: new Date()
    };
    
    // Use setDoc with merge option to update the document
    await setDoc(productDocRef, updatedProduct, { merge: true });
    
    <CheckAlert state="success" title="Product updated successfully" />
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    <CheckAlert state="error" title={error.message} />
    return false;
  }
}
```

### 3. ProductForm UI Implementation (in `app/(main)/(tabs)/Profile/Dashboard/ProductForm/[ProductForm].jsx`)

The ProductForm component was enhanced with:

#### 3.1 Image State Management
```javascript
// Image upload state
const [productImages, setProductImages] = useState([]);
const [uploadingImage, setUploadingImage] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [showImagePicker, setShowImagePicker] = useState(false);
```

#### 3.2 Image Selection & Upload Handler
```javascript
const handleSelectImage = async (useCamera = false) => {
  try {
    // Close the modal first
    setShowImagePicker(false);
    
    // Start the selection process
    setUploadingImage(true);
    setUploadProgress(0);
    
    console.log(`Starting image selection from ${useCamera ? 'camera' : 'gallery'}`);
    
    // 1. Select image from gallery or camera
    const imageSelection = await SelectImage(useCamera);
    
    if (!imageSelection.success) {
      console.error('Image selection failed:', imageSelection.error);
      Alert.alert('Error', imageSelection.error || 'Failed to select image');
      setUploadingImage(false);
      return;
    }
    
    console.log('Image selected successfully:', {
      width: imageSelection.width,
      height: imageSelection.height,
      fileType: imageSelection.fileType
    });
    
    // 2. Generate a unique filename for the image
    const title = formData.title || 'product';
    const uniqueFilename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${imageSelection.fileType}`;
    
    console.log('Starting upload with filename:', uniqueFilename);
    
    // 3. Upload the image with progress tracking
    const uploadResult = await UploadImage(
      imageSelection,
      uniqueFilename,
      (percent) => {
        console.log(`Upload progress: ${percent}%`);
        setUploadProgress(percent);
      }
    );
    
    // 4. Process the upload result
    if (uploadResult.success) {
      console.log('Upload successful:', uploadResult);
      
      // Add the new image to the product images array
      const newImage = {
        url: uploadResult.url,
        filePath: uploadResult.filePath,
        filename: uploadResult.filename
      };
      
      setProductImages(prev => [...prev, newImage]);
      
      // If this is the first image and no main image is set, use it as the main image
      if (productImages.length === 0 && !formData.imageUrl) {
        updateField('imageUrl', uploadResult.url);
      }
      
      Alert.alert('Success', 'Image uploaded successfully');
    } else {
      console.error('Upload failed:', uploadResult.error);
      Alert.alert('Upload Failed', uploadResult.error || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    Alert.alert('Error', error.message || 'An unexpected error occurred');
  } finally {
    setUploadingImage(false);
  }
};
```

#### 3.3 Image Removal Handler
```javascript
const handleRemoveImage = (index) => {
  Alert.alert(
    'Remove Image',
    'Are you sure you want to remove this image?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          // Remove the image from the array
          const newImages = [...productImages];
          newImages.splice(index, 1);
          setProductImages(newImages);
          
          // If the main image URL matches the removed image, clear it
          if (productImages[index].url === formData.imageUrl) {
            updateField('imageUrl', '');
          }
        }
      }
    ]
  );
};
```

#### 3.4 Loading Product Images
```javascript
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
```

#### 3.5 Saving Product Images to Firebase
```javascript
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
```

#### 3.6 Image Upload UI Components

```jsx
{/* Product Images Section */}
<Text style={styles.sectionTitle}>Product Images</Text>
<View style={styles.imagesContainer}>
  {/* Product Images Grid */}
  {productImages.length > 0 ? (
    <View style={styles.imageGrid}>
      {productImages.map((image, index) => (
        <View key={index} style={styles.imageGridItem}>
          <Image 
            source={{ uri: image.url }} 
            style={styles.gridImage}
            resizeMode="cover"
          />
          <Pressable 
            style={styles.removeImageButton}
            onPress={() => handleRemoveImage(index)}
            disabled={saving || deleting}
          >
            <Ionicons name="close-circle" size={24} color="#ff4444" />
          </Pressable>
        </View>
      ))}
      
      {/* Add Image Button (shown only if less than 5 images) */}
      {productImages.length < 5 && (
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
  ) : (
    <Pressable 
      style={styles.emptyImagesContainer}
      onPress={() => setShowImagePicker(true)}
      disabled={uploadingImage || saving || deleting}
    >
      <MaterialIcons name="add-photo-alternate" size={48} color="#ccc" />
      <Text style={styles.placeholderText}>Add Product Images (up to 5)</Text>
    </Pressable>
  )}
  
  {/* Upload Progress */}
  {uploadingImage && (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Uploading image: {uploadProgress}%</Text>
      {Platform.OS === 'android' ? (
        <ProgressBarAndroid 
          styleAttr="Horizontal"
          indeterminate={false}
          progress={uploadProgress / 100}
          color="#2f2baa"
          style={styles.progressBar}
        />
      ) : (
        <ProgressViewIOS 
          progress={uploadProgress / 100}
          progressTintColor="#2f2baa"
          style={styles.progressBar}
        />
      )}
    </View>
  )}
</View>

{/* Image Picker Modal */}
<Modal
  visible={showImagePicker}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowImagePicker(false)}
>
  <View style={styles.modalOverlay}>
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
      
      <TouchableOpacity 
        style={[styles.modalOption, styles.cancelOption]}
        onPress={() => setShowImagePicker(false)}
      >
        <Ionicons name="close" size={24} color="#666" />
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
```

#### 3.7 Key Styling Elements
```javascript
const styles = StyleSheet.create({
  // ...existing styles...
  
  imagesContainer: {
    marginBottom: 20,
    marginTop: 5,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageGridItem: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 3,
  },
  addImageButton: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addImageText: {
    color: '#2f2baa',
    marginTop: 5,
    fontWeight: '500',
  },
  emptyImagesContainer: {
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
  progressContainer: {
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // ...more styles...
});
```

## Dependencies Used

To implement this functionality, the following packages are used:

1. **@supabase/supabase-js**: For Supabase storage integration
2. **expo-image-picker**: For selecting images from the gallery or taking photos with the camera
3. **base64-arraybuffer**: For converting base64 encoded images to the ArrayBuffer format needed for Supabase storage
4. **uuid**: For generating unique filenames for uploaded images

## How It All Works Together

### 1. Data Flow

The image upload system follows this data flow:

1. **User Action**: User taps "Add Image" button in the ProductForm
2. **Image Selection**: Using expo-image-picker to access camera or gallery
3. **Conversion**: Image is converted to base64 for easier handling
4. **Upload to Supabase**: 
   - Base64 is converted to ArrayBuffer
   - File is uploaded to Supabase storage
   - Progress is tracked and shown to user
5. **Store References in Firebase**:
   - After successful upload, image references (URLs, paths) are stored in an array
   - On form submission, this array is saved along with other product data to Firebase

### 2. Folder Structure

- **supabase/initSupabase.js**: Contains the core image selection and upload logic
- **firebase/Product.js**: Handles storing image references in Firebase
- **app/(main)/(tabs)/Profile/Dashboard/ProductForm/[ProductForm].jsx**: UI implementation for image upload

### 3. Key Features

1. **Multiple Images**: Support for up to 5 images per product
2. **Progress Tracking**: Real-time progress bar during upload
3. **Error Handling**: Comprehensive error handling with user feedback
4. **Image Source Choice**: Option to select from gallery or take a photo
5. **Automatic Bucket Creation**: Checks and creates storage bucket if needed
6. **Image Management**: UI to view, add, and remove product images

## Usage Example

To use the image upload functionality in a product creation or editing context:

```javascript
// 1. Import the necessary functions
import { SelectImage, UploadImage } from '../../../supabase/initSupabase';

// 2. Set up state for images
const [productImages, setProductImages] = useState([]);
const [uploadProgress, setUploadProgress] = useState(0);

// 3. Select an image
const imageSelection = await SelectImage(false); // false = gallery, true = camera

// 4. Upload the image with progress tracking
const uploadResult = await UploadImage(
  imageSelection,
  'custom-filename.jpg',
  (percent) => {
    setUploadProgress(percent);
    // Update progress UI
  }
);

// 5. Store the image reference
if (uploadResult.success) {
  setProductImages(prev => [...prev, {
    url: uploadResult.url,
    filePath: uploadResult.filePath,
    filename: uploadResult.filename
  }]);
}

// 6. Save the product with image references
await updateProduct(productId, {
  // ...other product data
  productImages: productImages
});
```

## Conclusion

The image upload system provides a complete solution for managing product images in the TeckTune application. By leveraging Supabase for storage and Firebase for database functions, the system offers a robust and user-friendly way to handle multiple product images with proper progress tracking and error handling.