import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  register,
  login as firebaseLogin,
  logout as firebaseLogout,
} from "../firebase/Auth.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get user profile data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let userData;

          if (userDoc.exists()) {
            // Combine Firebase user with Firestore profile data
            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data(),
            };
          } else {
            // If no Firestore doc, use basic Firebase user data
            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
            };
          }

          // Store user in AsyncStorage for offline access
          await AsyncStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      } else {
        // User is signed out
        await AsyncStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    });

    // Check for stored user on cold start
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser && !user) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error retrieving stored user:", error);
      }
    };

    checkStoredUser();

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signup = async (userData) => {
    try {
      // Register with Firebase
      const firebaseUser = await register(userData.email, userData.password);

      // Remove password from userData before storing
      const { password, ...userDataToStore } = userData;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...userDataToStore,
        createdAt: new Date().toISOString(),
      });

      // Fetch the complete profile to store locally
      const fullUserData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        ...userDataToStore,
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(fullUserData));
      setUser(fullUserData);

      return fullUserData;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Firebase login
      const firebaseUser = await firebaseLogin(email, password);

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      let userData;
      if (userDoc.exists()) {
        userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDoc.data(),
        };
      } else {
        userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
        };
      }

      // Store user in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Firebase logout
      await firebaseLogout();
      // Clear AsyncStorage
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  // Add this function to the AuthContext component
  const updateUserProfile = async (userId, userData) => {
    try {
      // Remove sensitive fields before storing in Firestore
      const { password, ...userDataToStore } = userData;

      // Update user profile in Firestore
      await setDoc(
        doc(db, "users", userId),
        {
          ...userDataToStore,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ); // Use merge to update fields without overwriting the entire document

      // Get updated user profile
      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const updatedUserData = {
          id: userId,
          email: userData.email,
          ...userDoc.data(),
        };

        // Update local storage
        await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));
        setUser(updatedUserData);

        return updatedUserData;
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, loading, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
