import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  register,
  login as firebaseLogin,
  logout as firebaseLogout,
  deleteAccount as deleteAccountFromFirebase,
} from "../firebase/Auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { processAndUploadAvatar } from "../supabase/loadImage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(null);

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

      let pass = userData.password;

      // Remove password from userData before storing
      const { password, ...userDataToStore } = userData;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...userDataToStore,
        status: "active",
        role: "user",
        createdAt: new Date().toISOString(),
      });

      // If the avatar wasn't processed yet, I handle it now with the user ID
      if (!userData.avatarInfo && userData.avatarUri) {
        const avatarResult = await processAndUploadAvatar(
          userData.avatarUri,
          firebaseUser.uid
        );

        if (avatarResult.success) {
          // Update the user document with avatar info
          await setDoc(
            doc(db, "users", firebaseUser.uid),
            { avatarInfo: avatarResult.avatarInfo },
            { merge: true }
          );

          // Add it to userData for local storage
          userDataToStore.avatarInfo = avatarResult.avatarInfo;
        }
      }

      // Fetch the complete profile to store locally
      const fullUserData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        password: pass,
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

      if (!firebaseUser || !firebaseUser.uid) {
        throw new Error(
          "Authentication failed. Please check your credentials."
        );
      }

      let pass = password;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      let userData;
      if (userDoc.exists()) {
        userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          pasword: pass,
          ...userDoc.data(),
        };

        // Store user in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        return userData;
      } else {
        // if the pre-stored data in the firestore has been deleted.
        await auth.currentUser.delete();
        throw new Error("account-data-missing");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const enterGuestMode = async () => {
    const guestData = {
      id: "guest",
      email: "guest@example.com",
      password: "",
      firstName: "Guest",
      lastName: "User",
      address: "###########",
      phoneNumber: "00000000000",
      status: "active",
      role: "guest",
      avatarType: "default",
      avatarUri: require("../assets/avatars/avatar7.png"),
      createdAt: new Date().toISOString(),
    };

    // store-locally, my state & data as - guest - :
    await AsyncStorage.setItem("guest", JSON.stringify(guestData));
    setUser(guestData);

    setGuest(guestData);
  };

  const deleteAccount = async () => {
    try {
      if (!user && !guest) throw new Error("No user is logged in.");

      if (guest) {
        await AsyncStorage.removeItem("guest");
        setUser(null);
        setGuest(null);
        return;
      }
      // Delete account from Firestore and Firebase Auth
      await deleteAccountFromFirebase(user.id);

      // Clear local storage and state
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error during account deletion:", error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      if (!guest) {
        // Firebase logout
        await firebaseLogout();
        // Clear AsyncStorage
        await AsyncStorage.removeItem("user");
        // set the local state to null
        setUser(null);
      } else {
        // if (guest) :
        setUser(null);
        setGuest(null);
        await AsyncStorage.removeItem("guest");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        guest,
        signup,
        login,
        logout,
        enterGuestMode,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
