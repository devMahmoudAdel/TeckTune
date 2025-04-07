import { db } from "./config";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { auth } from "./config";

const addToCart = async (product) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(collection(db, "users", user.uid, "cart"));
    await setDoc(cartDocRef, ...product);
    return true;
  } catch (error) {
    throw error;
  }
};

const removeFromCart = async (productId) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(collection(db, "users", user.uid, "cart"), productId);
    await deleteDoc(cartDocRef);
    return true;
  } catch (error) {
    throw error;
  }
};

const getCart = async () => {
  try {
    const user = auth.currentUser;
    const cartCollectionRef = collection(db, "users", user.uid, "cart");
    const cartSnapshot = await getDocs(cartCollectionRef);
    const cart = cartSnapshot.docs.map((doc) => doc.data());
    return cart;
  } catch (error) {
    throw error;
  }
};

export { addToCart, removeFromCart, getCart };