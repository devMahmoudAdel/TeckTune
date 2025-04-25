import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from './initSupabase';
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

    return {
      success: true,
      base64,
      uri: img.uri,
      fileName: img.fileName || `image_${Date.now()}`,
      type: img.type || 'image/jpeg'
    };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

const uploadImage = async (imageData, nameFile = null, onProgress = null) => {
  try {
    const { base64, uri, fileName: originalFileName, type } = imageData;
    const arrayBuffer = decode(base64);
    const fileExt = uri.split('.').pop() || 'png';
    const fileName = nameFile ? nameFile : `${Date.now()}.${fileExt}`;
    const filePath = `TECKTUNE/${fileName}`;
    const contentType = type || `image/${fileExt}`;

    const fileSize = arrayBuffer.byteLength;
    const chunkSize = 1024 * 1024;
    let uploadedBytes = 0;

    for (let offset = 0; offset < fileSize; offset += chunkSize) {
      const chunk = arrayBuffer.slice(offset, offset + chunkSize);
      const { error } = await supabase.storage
        .from('files')
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
      .from('files')
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
      .from('files')
      .remove([`TECKTUNE/${fileName}`]);

    if (error) throw error;

    console.log("error", error)

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