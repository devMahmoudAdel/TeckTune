/**
 * Firebase Image Storage Utility
 * This file handles all image-related operations including:
 * - Image selection from camera or gallery
 * - Image upload to Firebase Storage
 * - Image deletion from Firebase Storage
 * 
 * The flow: User selects image → Convert to blob → Upload to Firebase → Get download URL
 */

import * as ImagePicker from 'expo-image-picker'; // Used to access device camera and image library
import * as FileSystem from 'expo-file-system'; // Used for file operations if needed
import { storage } from './config'; // Firebase storage instance from config.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Firebase storage functions
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

/**
 * Selects an image from camera or gallery
 * @param {boolean} useCamera - Whether to use camera (true) or gallery (false)
 * @returns {Object} Result object with success status and image data or error
 * 
 * Potential issues:
 * - Permissions might be denied by the user
 * - Image picker might fail or user might cancel
 * - Large images might cause memory issues
 */
export const selectImage = async (useCamera = false) => {
  try {
    // Step 1: Request proper permission based on source (camera or gallery)
    if (Platform.OS !== 'web') {
      const permissionType = useCamera 
        ? ImagePicker.requestCameraPermissionsAsync()
        : ImagePicker.requestMediaLibraryPermissionsAsync();
        
      const { status } = await permissionType;
      // Exit if permission denied
      if (status !== 'granted') {
        return {
          success: false,
          error: `Permission to access ${useCamera ? 'camera' : 'media library'} was denied`
        };
      }
    }

    // Step 2: Configure the image picker options
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images (not videos)
      allowsEditing: true, // Allow user to crop/edit the image
      aspect: [4, 3], // Maintain 4:3 aspect ratio
      quality: 0.7, // Slightly reduce quality to reduce file size (0-1)
    };

    // Step 3: Launch camera or image picker based on the useCamera flag
    const result = useCamera 
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    console.log("Image selection result:", JSON.stringify({
      cancelled: result.canceled,
      hasAssets: !!result.assets,
      assetCount: result.assets?.length || 0
    }));

    // Step 4: Handle cancellation or no images selected
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, error: 'Image selection was cancelled' };
    }

    // Step 5: Extract image data from the result
    const asset = result.assets[0];
    
    // Step 6: Determine file type from URI extension or default to jpg
    const fileType = asset.uri.split('.').pop().toLowerCase() || 'jpg';
    
    // Step 7: Return successful result with image details
    return {
      success: true,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileType: fileType,
      fileName: `product_${Date.now()}.${fileType}`,
    };
  } catch (error) {
    // Log and return any errors that occur
    console.error('Error selecting image:', error);
    return { success: false, error: error.message || 'Failed to select image' };
  }
};

/**
 * Uploads an image to Firebase Storage
 * @param {Object} imageData - Image data from selectImage function
 * @param {string} nameFile - Optional custom filename
 * @param {Function} onProgress - Optional callback for upload progress updates
 * @returns {Object} Result object with success status, URL, and file info or error
 * 
 * Potential issues:
 * - Network connectivity problems during upload
 * - Blob conversion might fail for certain image types
 * - Firebase storage might reject the upload (permissions, quotas)
 * - Large images might cause timeouts
 */
export const uploadImage = async (imageData, nameFile = null, onProgress = null) => {
  try {
    // Step 1: Validate input data
    if (!imageData || !imageData.success || !imageData.uri) {
      console.error('Invalid image data provided for upload');
      return { success: false, error: 'Invalid image data' };
    }

    // Step 2: Generate a filename - use provided or create one
    const fileName = nameFile || imageData.fileName || `product_${Date.now()}.${imageData.fileType}`;
    const filePath = `products/${fileName}`; // Store in 'products' folder
    
    console.log(`Starting upload: ${fileName} from URI: ${imageData.uri}`);

    // Step 3: Show initial progress
    if (onProgress) onProgress(10);
    
    try {
      // Step 4: Create a reference to where the file will be stored in Firebase
      const storageRef = ref(storage, filePath);
      
      // Step 5: Fetch the image as a blob (binary large object)
      // This is a critical step that can fail if the URI is invalid or network is unavailable
      const response = await fetch(imageData.uri);
      const blob = await response.blob();
      console.log(`Blob created with size: ${blob.size} bytes`);
      
      // Step 6: Update progress after blob creation
      if (onProgress) onProgress(30);
      
      console.log('Starting Firebase upload...');
      
      // Step 7: Upload blob to Firebase Storage
      // This is where network issues are most likely to occur
      await uploadBytes(storageRef, blob);
      
      // Step 8: Update progress after upload completes
      if (onProgress) onProgress(80);
      
      console.log('Upload completed, getting download URL...');
      
      // Step 9: Get the public download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('Download URL:', downloadURL);
      
      // Step 10: Show complete progress
      if (onProgress) onProgress(100);
      
      // Step 11: Return success result with file info
      return {
        success: true,
        fileName,
        url: downloadURL,
        filePath
      };
    } catch (error) {
      // Handle specific upload errors
      console.error('Upload error:', error);
      return { success: false, error: `Upload failed: ${error.message}` };
    }
  } catch (error) {
    // Handle general errors
    console.error('General error:', error);
    return { success: false, error: 'Image upload failed' };
  }
};

/**
 * Deletes an image from Firebase Storage
 * @param {string} filePath - The path or URL of the file to delete
 * @returns {Object} Result object with success status or error
 * 
 * Potential issues:
 * - Permission issues when deleting files
 * - Incorrect file path extraction from URLs
 * - Network connectivity problems
 */
export const deleteImage = async (filePath) => {
  try {
    // Step 1: Validate input
    if (!filePath) {
      return { success: false, error: 'No file path provided for deletion' };
    }
    
    // Step 2: If a URL is provided, extract the file path
    // This is complex and error-prone due to URL format variations
    if (filePath.startsWith('http')) {
      try {
        // Try to extract the path from Firebase Storage URL format
        const urlParts = filePath.split('/o/')[1];
        if (urlParts) {
          filePath = decodeURIComponent(urlParts.split('?')[0]);
        } else {
          // Fallback to simple extraction if the URL format is different
          filePath = `products/${filePath.split('/').pop().split('?')[0]}`;
        }
      } catch (e) {
        console.error('Error parsing URL:', e);
        // Default folder if parsing fails
        filePath = `products/${filePath.split('/').pop().split('?')[0]}`;
      }
    }
    
    console.log(`Attempting to delete: ${filePath}`);
    
    // Step 3: Create a reference to the file in Firebase Storage
    const fileRef = ref(storage, filePath);
    
    // Step 4: Delete the file
    await deleteObject(fileRef);
    
    console.log('File deleted successfully');
    return { success: true };
    
  } catch (error) {
    // Handle delete errors
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete image' };
  }
};