import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from './initSupabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'TECKTUNE';

const selectImage = async () => {
  try {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) {
      return { success: false, error: 'Image selection was cancelled' };
    }

    const img = result.assets[0];
    const base64 = await FileSystem.readAsStringAsync(img.uri, { 
      encoding: 'base64' 
    });

    const fileType = img.uri.split('.').pop() || 'jpeg';

    return {
      success: true,
      base64,
      uri: img.uri,
      fileName: `${uuidv4()}.${fileType}`,
      type: img.type || `image/${fileType}`
    };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

const uploadImage = async (imageData, nameFile = null, onProgress = null) => {
  try {
    // Check if bucket exists and create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucket = buckets?.find(b => b.name === BUCKET_NAME);
    
    if (!bucket) {
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createBucketError) {
        console.error('Error creating storage bucket:', createBucketError);
        throw createBucketError;
      }
    }

    const { base64, uri, fileName: originalFileName, type } = imageData;
    const arrayBuffer = decode(base64);
    const fileExt = uri.split('.').pop() || 'png';
    const fileName = nameFile ? nameFile : `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`; // No need for subfolder since we're using a dedicated bucket
    const contentType = type || `image/${fileExt}`;

    const fileSize = arrayBuffer.byteLength;
    const chunkSize = 1024 * 1024;
    let uploadedBytes = 0;

    for (let offset = 0; offset < fileSize; offset += chunkSize) {
      const chunk = arrayBuffer.slice(offset, offset + chunkSize);
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, offset === 0 ? chunk : new Uint8Array(chunk), {
          contentType,
          upsert: true,
          cacheControl: '3600'
        });

      if (error) throw error;

      uploadedBytes += chunk.byteLength;
      const percent = Math.round((uploadedBytes / fileSize) * 100);
      if (onProgress) onProgress(percent);
    }
    const { data, error: getUrlError } = await supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
      
    if (getUrlError) throw getUrlError;

    return {
      success: true,
      fileName,
      url: data.publicUrl,
      filePath
    };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

const deleteImage = async (fileName) => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]); // No need for TECKTUNE/ prefix since we're using a dedicated bucket

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export {
  selectImage,
  uploadImage,
  deleteImage,
};