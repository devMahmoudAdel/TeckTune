import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
    return SecureStore.deleteItemAsync(key);
  },
};

const url = "https://ektldysacqkendukfvkt.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrdGxkeXNhY3FrZW5kdWtmdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjY0MzQsImV4cCI6MjA2MDgwMjQzNH0.RdQOVzEWm8GeijaRaKkhxu-PTI0yJGppeO7bmdDkv0s";


export const supabase = createClient(url, key, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    detectSessionInUrl: false,
  },
});
