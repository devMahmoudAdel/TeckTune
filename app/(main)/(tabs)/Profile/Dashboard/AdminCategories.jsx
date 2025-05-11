import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, TextInput, StatusBar, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../../../firebase/Category";
import Toast from 'react-native-toast-message';
import Loading from '../../../../../Components/Loading';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ visible: false, success: false, message: '' });
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const showFeedback = (type, message, details = '') => {
    Toast.show({
      type: type,
      text1: message,
      text2: details,
      position: 'bottom',
      visibilityTime: 1500,
    });

    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }

    setDeleteStatus({
      visible: true,
      success: type === 'success',
      message: `${message}: ${details}`
    });

    setTimeout(() => {
      setDeleteStatus({ visible: false, success: false, message: '' });
    }, 3000);

    console.log(`[${type.toUpperCase()}]: ${message} - ${details}`);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
      showFeedback('error', 'Failed to load categories', err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCategory = (categoryId, categoryName) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${categoryName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              showFeedback('info', 'Deleting category...', 'Please wait');
              await deleteCategory(categoryId);
              showFeedback(
                'success',
                'Category deleted successfully',
                `"${categoryName}" has been removed`
              );
            } catch (error) {
              console.error(`Failed to delete category ${categoryId}:`, error);
              showFeedback(
                'error',
                'Failed to delete category',
                error.message || 'Unknown error occurred'
              );
            } finally {
              fetchCategories();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Categories Management</Text>
        <View style={{ width: 24 }} />
      </View>

      {deleteStatus.visible && (
        <View style={[
          styles.statusMessage,
          deleteStatus.success ? styles.successMessage : styles.errorMessage
        ]}>
          <Text style={styles.statusText}>{deleteStatus.message}</Text>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.button, styles.addButton]}
          onPress={() => router.push('/Profile/Dashboard/CategoryForm')}
        >
          <Text style={styles.buttonText}>Add New Category</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id || item._id || String(Math.random())}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        showsVerticalScrollIndicator={true}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Pressable
              style={styles.categoryContent}
              onPress={() => {
                router.push({
                  pathname: "/Profile/Dashboard/CategoryForm/[CategoryForm]",
                  params: { id: item.id }
                });
              }}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.name || 'Untitled Category'}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Pressable>

            <Pressable
              style={styles.categoryDeleteButton}
              onPress={() => handleDeleteCategory(item.id, item.name)}
            >
              <AntDesign name="delete" size={18} color="#fff" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusMessage: {
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  successMessage: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight + 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
  actionButtons: {
    padding: 15,
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#2f2baa',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  categoryItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
    paddingRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDeleteButton: {
    position: 'absolute',
    bottom: "50%",
    right: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});
