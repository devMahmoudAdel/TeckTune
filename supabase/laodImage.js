// This file is kept for backwards compatibility
// The main implementation has been moved to initSupabase.js
import { supabase, SelectImage, UploadImage as uploadImageImpl } from './initSupabase';

export const SelectImageFromGallery = () => SelectImage(false);
export const SelectImageFromCamera = () => SelectImage(true);
export const UploadImage = uploadImageImpl;

// Re-export for backwards compatibility
export const deleteImage = async (fileName) => {
  if (!fileName) {
    return { success: false, error: 'No filename provided for deletion' };
  }

  try {
    const { error } = await supabase.storage
      .from('products')
      .remove([`product-images/${fileName}`]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }
};