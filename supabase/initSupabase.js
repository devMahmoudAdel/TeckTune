import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { v4 as uuidv4 } from 'uuid';
import * as FileSystem from 'expo-file-system';

// Simple async storage implementation that doesn't use SecureStore
const asyncStorage = {
  getItem: async (key) => {
    try {
      return null; // Don't actually store auth tokens for this simplified implementation
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      return value; // Just return the value without storing it
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  removeItem: async (key) => {
    try {
      return null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }
};

const url = "https://ektldysacqkendukfvkt.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGxkeXNhY3FrZW5kdWtmdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjY0MzQsImV4cCI6MjA2MDgwMjQzNH0.RdQOVzEWm8GeijaRaKkhxu-PTI0yJGppeO7bmdDkv0s";

// Create the Supabase client with minimal settings
export const supabase = createClient(url, key, {
  auth: {
    storage: asyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  }
});

// Helper to select an image from gallery or camera
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
    
    // Always try to get base64 data, either from the result or by reading the file
    let base64 = asset.base64;
    if (!base64) {
      try {
        base64 = await FileSystem.readAsStringAsync(asset.uri, { 
          encoding: FileSystem.EncodingType.Base64 
        });
        console.log("Successfully read base64 data using FileSystem");
      } catch (e) {
        console.error("Failed to read base64 data:", e);
        return { success: false, error: 'Failed to read image data' };
      }
    }
    
    if (!base64) {
      return { success: false, error: 'Failed to get image data' };
    }

    // Get file extension from URI or default to jpg
    const fileType = asset.uri.split('.').pop().toLowerCase() || 'jpg';
    
    return {
      success: true,
      uri: asset.uri,
      base64: base64,
      width: asset.width,
      height: asset.height,
      fileType: fileType,
      fileName: `image_${Date.now()}.${fileType}`,
    };
  } catch (error) {
    console.error('Error selecting image:', error);
    return { success: false, error: error.message || 'Failed to select image' };
  }
};

// Helper to ensure bucket exists
const ensureBucketExists = async (bucketName) => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucket = buckets?.find(b => b.name === bucketName);
    
    if (!bucket) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return { success: false, error: error.message };
  }
};

// Helper to upload an image to Supabase Storage
export const UploadImage = async (
  imageData,
  customFilename = null,
  progressCallback = null
) => {
  try {
    if (!imageData || !imageData.success || !imageData.base64) {
      console.error('Invalid image data:', JSON.stringify(imageData, null, 2));
      return { success: false, error: 'Invalid image data' };
    }

    // Ensure products bucket exists
    const bucketCheck = await ensureBucketExists('products');
    if (!bucketCheck.success) {
      return bucketCheck;
    }

    // Generate a unique filename if not provided
    const filename = customFilename || `${uuidv4()}.${imageData.fileType}`;
    const filePath = `product-images/${filename}`;
    
    console.log('Starting upload:', {
      filename,
      filePath,
      fileType: imageData.fileType
    });

    // Convert base64 to ArrayBuffer for upload
    let arrayBuffer;
    try {
      arrayBuffer = decode(imageData.base64);
    } catch (e) {
      console.error('Failed to decode base64:', e);
      return { success: false, error: 'Could not process the image format' };
    }

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${imageData.fileType}`,
        upsert: true,
        onUploadProgress: progressCallback 
          ? ({ percent }) => {
              console.log(`Upload progress: ${Math.round(percent * 100)}%`);
              progressCallback(Math.round(percent * 100));
            }
          : undefined
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message || 'Failed to upload image' };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('Upload successful, URL:', publicUrl);
    
    return {
      success: true,
      fileName: filename,
      url: publicUrl,
      filePath
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message || 'Failed to upload image' };
  }
};
