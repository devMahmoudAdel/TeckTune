import { db } from "./config";
import { collection, doc, setDoc, deleteDoc, getDocs , getDoc, updateDoc, addDoc} from "firebase/firestore";
import { auth } from "./config";

const addToCart = async (productId) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(db, "users", user.uid, "cart");
    await setDoc(cartDocRef, {productId}, { merge: true });
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

const inCart = async (productId) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(collection(db, "users", user.uid, "cart"), productId);
    const cartDoc = await getDoc(cartDocRef);
    return cartDoc.exists();
  } catch (error) {
    throw error;
  }
}

const deleteAll = async () => {
  try {
    const user = auth.currentUser;
    const cartCollectionRef = collection(db, "users", user.uid, "cart");
    const cartSnapshot = await getDocs(cartCollectionRef);
    cartSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export default { addToCart, removeFromCart, getCart , inCart, deleteAll };