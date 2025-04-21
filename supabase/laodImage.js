import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from './initSupabase';


const SelectAndUploadImage = async (userId, nameFile = null) => {
  try {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled) {
      return { success: false, error: 'Choese image is cancelled' };
    }

    const img = result.assets[0];
    const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });

    const fileExt = img.uri.split('.').pop() || 'png';
    const fileName = nameFile ? nameFile : `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    const contentType = `image/${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, decode(base64), { contentType, upsert: true }); 

    if (uploadError) throw uploadError;

    
    const { data, error: getUrlError } = await supabase.storage
      .from('files')
      .getPublicUrl(filePath);
      
    if (getUrlError) throw getUrlError;

    return {
      success: true,
      fileName,
      url: data.publicUrl,
    };
  } catch (error) {
    return { success: false, error: error.message || error };
  }
};

const deleteImage = async (userId, fileName) => {
  try {
    const { error } = await supabase.storage
      .from('files')
      .remove([`${userId}/${fileName}`]);

    if (error) throw error;

    console.log("error", error)

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export {
    SelectAndUploadImage,
    deleteImage,
};