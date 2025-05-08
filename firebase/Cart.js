import { db } from "./config";
import { collection, doc, setDoc, deleteDoc, getDocs , getDoc, updateDoc, addDoc} from "firebase/firestore";
import { auth } from "./config";
import { getProduct } from "./Product";
import CheckAlert from "../Components/CheckAlert";
const addToCart = async (productId, quantity=1,attributes={}) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(db, "users", user.uid, "cart", productId);
    await setDoc(cartDocRef, {  quantity, productId, attributes, createdAt: new Date() }, { merge: true });
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};

const removeFromCart = async (productId) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(collection(db, "users", user.uid, "cart"), productId);
    await deleteDoc(cartDocRef);
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};

const getCart = async () => {
  try {
    const user = auth.currentUser;
    const cartCollectionRef = collection(db, "users", user.uid, "cart");
    const cartSnapshot = await getDocs(cartCollectionRef);
    const cart = await Promise.all(cartSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const product = await getProduct(data.productId);
      return {
        ...data,
        ...product,
      };
    }));

    return cart;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};

const inCart = async (productId) => {
  try {
    const user = auth.currentUser;
    const cartDocRef = doc(collection(db, "users", user.uid, "cart"), productId);
    const cartDoc = await getDoc(cartDocRef);
    return cartDoc.exists();
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
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
    <CheckAlert state="error" title={error.message}/>
  }
};

export { addToCart, removeFromCart, getCart , inCart, deleteAll };