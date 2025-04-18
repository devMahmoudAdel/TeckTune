import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "../node_modules/firebase/auth";
import { auth, db } from "./config";
import { doc, deleteDoc } from "firebase/firestore";

const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
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

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (userId) => {
  try {
    // 1- delete user document from firestore
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);

    // 2- Delete the Firebase Authentication account
    await auth.currentUser.delete();

    return true;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export { login, logout, deleteAccount, register };
