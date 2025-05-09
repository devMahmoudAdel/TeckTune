import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Modal, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Buffer } from 'buffer';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AIImageSearch({ onPrediction }) {
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleImage = async (pickerFn) => {
    setShowPicker(false);
    let result = await pickerFn({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const imageUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        const response = await axios({
          method: "POST",
          url: "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "image/jpeg",
            Accept: "application/json"
          },
          data: Buffer.from(base64, 'base64')
        });
        if (onPrediction && Array.isArray(response.data)) {
          const labels = response.data.slice(0, 5).map(item => item.label);
          onPrediction(labels);
        }
      } catch (error) {
        alert('Error analyzing image. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        {loading ? (
          <ActivityIndicator size="small" color="#5A31F4" />
        ) : (
          <MaterialIcons name="photo-camera" size={24} color="#5A31F4" />
        )}
      </TouchableOpacity>
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImage(ImagePicker.launchCameraAsync)}
            >
              <MaterialIcons name="camera-alt" size={24} color="#2f2baa" />
              <Text style={styles.modalOptionText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImage(ImagePicker.launchImageLibraryAsync)}
            >
              <MaterialIcons name="photo-library" size={24} color="#2f2baa" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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