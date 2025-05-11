import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./config";

import { doc, deleteDoc } from "firebase/firestore";
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
    throw error;
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
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    <CheckAlert state="error" title={error.message} />
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
    <CheckAlert state="error" title="Error deleting account" />
    throw error;
  }
};
