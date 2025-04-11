import {db} from './config.js';
import {collection, doc, setDoc, deleteDoc, getDocs, getDoc} from 'firebase/firestore';
import {auth} from './config.js';
// import { useAuth } from '../context/useAuth.js';
const addToWishlist = async (productId) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(db, 'users', user.uid, 'wishlist', productId);
    await setDoc(wishlistDocRef, {productId}, {merge: true});
    return true;
  } catch (error) {
    throw error;
  }
}
const getWishlist = async () => {
  try {
    const user = auth.currentUser;
    const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistCollectionRef);
    const wishlist = wishlistSnapshot.docs.map((doc) => doc.data());
    return wishlist;
  } catch (error) {
    throw error;
  }
}

const removeFromWishlist = async (productId) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(collection(db, 'users', user.uid, 'wishlist'), productId);
    await deleteDoc(wishlistDocRef);
    return true;
  } catch (error) {
    throw error;
  }
}

const inWishlist = async (productId) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(collection(db, 'users', user.uid, 'wishlist'), productId);
    const wishlistDoc = await getDoc(wishlistDocRef);
    return wishlistDoc.exists();
  } catch (error) {
    throw error;
  }
}
export {addToWishlist, getWishlist, removeFromWishlist, inWishlist};