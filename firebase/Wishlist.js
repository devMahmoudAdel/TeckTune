import {db} from './firebase.js';
import {collection, doc, setDoc, deleteDoc, getDocs} from 'firebase/firestore';
import {auth} from './firebase.js';

const addToWishlist = async (product) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(collection(db, 'users', user.uid, 'wishlist'));
    await setDoc(wishlistDocRef, ...product);
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

export {addToWishlist, getWishlist, removeFromWishlist};