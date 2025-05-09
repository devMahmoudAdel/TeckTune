import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, StatusBar, ActivityIndicator, ToastAndroid, Platform, Image, FlatList, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { getBrand, addBrand, updateBrand } from "../../../../../../firebase/Brand";
import Toast from 'react-native-toast-message';
import Loading from '../../../../../../Components/Loading';
import { takePhoto, selectImage, uploadImage } from '../../../../../../supabase/loadImage';

const { width, height } = Dimensions.get('window');

export default function BrandForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [percent, setPercent] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isEditing) {
        fetchBrand();
      }
    }, [params.id])
  );

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const brand = await getBrand(params.id);

      if (!brand) {
        throw new Error('Brand not found');
      }

      setFormData({
        name: brand.name || '',
        description: brand.description || '',
        logo: brand.logo || '',
      });
    } catch (error) {
      console.error('Error fetching brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    if (!formData.logo.trim()) {
      errors.push('Logo is required');
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
        type: type,
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
      const uploadedImage = await uploadImage(image, null, (percent) => setPercent(percent));
      if (uploadedImage.success) {
        setFormData({ ...formData, logo: uploadedImage.url });
        setPercent(0);
      }
    }
  };

  const handleSelectImage = async () => {
    setShowImagePicker(true);
    const image = await selectImage();
    if (image.success) {
      setShowImagePicker(false);
      const uploadedImage = await uploadImage(image, null, (percent) => setPercent(percent));
      if (uploadedImage.success) {
        setFormData({ ...formData, logo: uploadedImage.url });
        setPercent(0);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.length > 0) {
        showFeedback('error', 'Validation Error', errors.join(', '));
        return;
      }

      setSaving(true);

      const brandData = {
        ...formData,
        id: isEditing ? params.id : undefined,
        updatedAt: new Date(),
      };

      const actionLabel = isEditing ? 'Updating brand...' : 'Adding brand...';
      showFeedback('info', actionLabel, 'Please wait');

      if (isEditing) {
        await updateBrand(params.id, brandData);
        showFeedback('success', 'Brand Updated', 'Brand has been updated successfully');
      } else {
        await addBrand(brandData);
        showFeedback('success', 'Brand Added', `Brand "${brandData.name}" has been added successfully`);
      }

      setTimeout(() => router.back(), 2000);
    } catch (error) {
      console.error("Operation failed:", error);
      showFeedback('error', 'Operation Failed', error.message || 'Failed to save brand');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !saving) {
    return (
      <Loading/>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} disabled={saving}>
          <Ionicons name="arrow-back" size={24} color={saving ? "#ccc" : "black"} />
        </Pressable>
        <Text style={styles.title}>{isEditing ? 'Edit Brand' : 'Add Brand'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Brand name"
          editable={!saving}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Brand description"
          multiline
          numberOfLines={4}
          editable={!saving}
        />

        <Text style={styles.label}>Logo *</Text>
        <View style={styles.imagesContainer}>
          {formData.logo ? (
            <View style={{ margin: 5 }}>
              <Image source={{ uri: formData.logo }} style={styles.image} />
              <MaterialIcons
                name="delete"
                size={24}
                color="red"
                style={styles.deleteIcon}
                onPress={() => setFormData({ ...formData, logo: '' })}
              />
            </View>
          ) : (
            <Pressable style={styles.addImg} onPress={() => setShowImagePicker(true)}>
              <Text style={styles.uploadText}>+</Text>
            </Pressable>
          )}
        </View>

        {percent > 0 && percent < 100 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${percent}%` }]} />
            <Text style={styles.progressText}>{percent}%</Text>
          </View>
        )}

        <Pressable
          style={[styles.submitButton, saving && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Brand' : 'Add Brand'}
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
    paddingHorizontal: width * 0.05, // Adjust padding based on screen width
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: width > 400 ? 20 : 18, // Adjust font size for smaller screens
    fontWeight: 'bold',
  },
  form: {
    paddingVertical: 15,
  },
  label: {
    fontSize: width > 400 ? 16 : 14,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: width > 400 ? 16 : 14,
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
  submitButtonText: {
    color: '#fff',
    fontSize: width > 400 ? 16 : 14,
    fontWeight: 'bold',
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addImg: {
    width: width * 0.15, // Adjust size based on screen width
    height: width * 0.15,
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
    fontSize: width > 400 ? 25 : 20,
    padding: 5,
  },
  image: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 8,
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 2,
    borderRadius: 50,
    backgroundColor: 'white',
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
    height: '100%',
    backgroundColor: '#2f2baa',
  },
  progressText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
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
    fontSize: width > 400 ? 20 : 18,
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
    fontSize: width > 400 ? 16 : 14,
    color: '#2f2baa',
    marginLeft: 12,
    fontWeight: '500',
  },
});