import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert, StatusBar, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCategory, addCategory, updateCategory } from "../../../../../../firebase/Category";
import Toast from 'react-native-toast-message';

export default function CategoryForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isEditing) {
        fetchCategory();
      }
    }, [params.id])
  );

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await getCategory(params.id);

      if (!category) {
        throw new Error('Category not found');
      }

      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
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

  const handleSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.length > 0) {
        showFeedback('error', 'Validation Error', errors.join(', '));
        return;
      }

      setSaving(true);

      const categoryData = {
        ...formData,
        id: isEditing ? params.id : undefined,
        updatedAt: new Date(),
      };

      const actionLabel = isEditing ? 'Updating category...' : 'Adding category...';
      showFeedback('info', actionLabel, 'Please wait');

      if (isEditing) {
        await updateCategory(params.id, categoryData);
        showFeedback('success', 'Category Updated', 'Category has been updated successfully');
      } else {
        await addCategory(categoryData);
        showFeedback('success', 'Category Added', `Category "${categoryData.name}" has been added successfully`);
      }

      setTimeout(() => router.back(), 2000);
    } catch (error) {
      console.error("Operation failed:", error);
      showFeedback('error', 'Operation Failed', error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !saving) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text style={styles.loadingText}>
          {isEditing ? 'Loading category...' : 'Creating category...'}
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
        <Text style={styles.title}>{isEditing ? 'Edit Category' : 'Add Category'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Category name"
          editable={!saving}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Category description"
          multiline
          numberOfLines={4}
          editable={!saving}
        />

        <Pressable
          style={[styles.submitButton, saving && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Category' : 'Add Category'}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight + 10,
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
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});