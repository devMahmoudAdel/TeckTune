import {db} from './config.js';
import {collection, doc, setDoc, deleteDoc, getDocs, getDoc} from 'firebase/firestore';
import {auth} from './config.js';
import { getProduct } from './Product.js';
import CheckAlert from '../Components/CheckAlert.jsx';
// import { useAuth } from '../context/useAuth.js';
const addToWishlist = async (productId) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(db, 'users', user.uid, 'wishlist', productId);
    await setDoc(wishlistDocRef, {productId, createdAt: new Date()}, {merge: true});
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}
const getWishlist = async () => {
  try {
    const user = auth.currentUser;
    const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistCollectionRef);
    const wishlist = await Promise.all(wishlistSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const product = await getProduct(data.productId);
      if(product){
        return {
        exists:true,
        ...data,
        ...product,
      };
      }else return{exists:false,id: doc.id};
      
    }));
    return wishlist;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const removeFromWishlist = async (productId) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(collection(db, 'users', user.uid, 'wishlist'), productId);
    await deleteDoc(wishlistDocRef);
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const inWishlist = async (productId) => {
  try {
    const user = auth.currentUser;
    const wishlistDocRef = doc(collection(db, 'users', user.uid, 'wishlist'), productId);
    const wishlistDoc = await getDoc(wishlistDocRef);
    return wishlistDoc.exists();
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const deleteAll = async () => {
  try {
    const user = auth.currentUser;
    const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistCollectionRef);
    wishlistSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}
export {addToWishlist, getWishlist, removeFromWishlist, inWishlist, deleteAll};