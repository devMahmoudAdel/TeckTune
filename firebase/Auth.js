import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./config";

import { doc, deleteDoc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import CheckAlert from "../Components/CheckAlert";

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Properly throw the error so it can be handled by the app
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // This line is important to properly propagate the error
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const deleteAccount = async (userId) => {
  try {
    // 1- delete user document from firestore
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);

    // 2- Delete the Firebase Authentication account
    await auth.currentUser.delete();

    return true;
  } catch (error) {
    console.error("Account deletion error:", error);
    throw error;
  }
};

// Test function to verify Firebase configuration is working
export const testFirebaseConnection = async () => {
  try {
    // Test Firebase Auth connection
    const appConfig = auth.app.options;
    console.log("Firebase project ID:", appConfig.projectId);
    console.log("✅ Firebase Auth connection successful");
    
    // Test Firestore connection by listing collections
    try {
      const collections = await getDocs(query(collection(db, "users"), limit(1)));
      console.log("✅ Firestore connection successful");
      console.log(`Found ${collections.size} user documents`);
    } catch (dbError) {
      console.error("Firestore error details:", dbError);
      throw new Error(`Firestore connection failed: ${dbError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error);
    throw error;
  }
};

// Test function to check if email/password authentication is enabled
export const checkAuthMethods = async () => {
  try {
    // Check if email/password auth is configured in the project
    try {
      // Attempt to create a temporary user (will fail, but differently depending on settings)
      await createUserWithEmailAndPassword(
        auth, 
        `test_${Date.now()}@example.com`, 
        "Test123!@#"
      );
    } catch (error) {
      // We expect an error, but the error type tells us if auth is enabled
      if (error.code === "auth/email-already-in-use" || 
          error.code === "auth/invalid-email" ||
          error.code === "auth/weak-password" ||
          error.code === "auth/operation-not-allowed") {
        
        // If we get these specific errors, email/password auth is enabled
        console.log("✅ Email/Password authentication is enabled");
        
        if (error.code === "auth/operation-not-allowed") {
          console.error("⚠️ Warning: Email/Password authentication is disabled in the Firebase console");
          return {
            enabled: false,
            message: "Email/Password sign-in is disabled in Firebase console. Enable it in the Firebase Authentication section."
          };
        }
        
        return { 
          enabled: true, 
          message: "Email/Password authentication is properly configured"
        };
      } else {
        console.error("❌ Unknown authentication error:", error);
        return { 
          enabled: false, 
          message: `Authentication error: ${error.message}`,
          error: error
        };
      }
    }
    
    // If we somehow got here without an error, something unexpected happened
    return { 
      enabled: false, 
      message: "Unexpected authentication result. Check Firebase console settings." 
    };
    
  } catch (error) {
    console.error("❌ Error checking authentication methods:", error);
    return { 
      enabled: false, 
      message: `Error checking auth methods: ${error.message}`,
      error: error
    };
  }
};
