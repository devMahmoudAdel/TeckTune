// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuzHbnOeWZZZLX9ihVn1JqPB2BqOQV4jw",
  authDomain: "software-3b26b.firebaseapp.com",
  projectId: "software-3b26b",
  storageBucket: "software-3b26b.firebasestorage.app",
  messagingSenderId: "781918532588",
  appId: "1:781918532588:web:911f648f05ed84c06f06c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize auth with different methods based on platform
let auth;
if (Platform.OS === 'web') {
  // For web, use simple auth without persistence
  auth = getAuth(app);
} else {
  // For native (iOS, Android), use AsyncStorage persistence
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const db = getFirestore(app);
export { auth, db };