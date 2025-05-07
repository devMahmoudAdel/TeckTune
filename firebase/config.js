/**
 * Firebase Configuration
 * This file initializes Firebase services including Authentication, Firestore, and Storage.
 * It provides the core Firebase instances that are used throughout the app.
 */

// Import the functions you need from the SDKs
import { initializeApp, getApps, getApp } from "firebase/app"; // Core Firebase functionality
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firebase Firestore (database)
import { getStorage } from "firebase/storage"; // Firebase Storage for files and images

/**
 * Firebase configuration object
 * Contains the credentials and connection information for the Firebase project
 * These values come from the Firebase console when you create a project
 * 
 * WARNING: In a production app, these values should be stored in environment variables
 * rather than being hard-coded in the source code
 */
const firebaseConfig = {
  apiKey: "AIzaSyCuzHbnOeWZZZLX9ihVn1JqPB2BqOQV4jw",
  authDomain: "software-3b26b.firebaseapp.com",
  projectId: "software-3b26b",
  storageBucket: "software-3b26b.appspot.com", // This is particularly important for Storage functionality
  messagingSenderId: "781918532588",
  appId: "1:781918532588:web:911f648f05ed84c06f06c9",
};

/**
 * Initialize Firebase app or get existing instance
 * This pattern prevents re-initialization errors when hot reloading in development
 */
let app;
try {
  if (!getApps().length) {
    console.log("Initializing new Firebase app");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Using existing Firebase app");
    app = getApp();
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error; // Re-throw to make initialization failures visible
}

// Initialize Firebase services
const auth = getAuth(app); // Authentication service
const db = getFirestore(app); // Firestore database service
const storage = getStorage(app); // Storage service for files and images

console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);

// Export initialized services for use throughout the app
export { auth, db, storage };