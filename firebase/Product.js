import {doc, collection, setDoc, getDoc,deleteDoc, getDocs} from 'firebase/firestore';
import { db } from './config';

const addProduct = async (product) => {
  const ref = doc(collection(db, 'products'));
  await setDoc(ref, {
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    productPics: product.productPics,
    createdAt: new Date(),
    rating: product.rating,
    colors: product.colors,
    stock: product.stock,
  }, { merge: true });
  return ref.id;
}

const getProduct = async (id) => {
  const productDocRef = doc(collection(db, 'products'), id);
  const productDoc = await getDoc(productDocRef);
  if (productDoc.exists()) {
    return productDoc.data();
  } else {
    throw new Error('Product does not exist');
  }
}

const getAllProducts = async () => {
  try{
  const productsCollectionRef = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCollectionRef);
  const products = productsSnapshot.docs.map((doc) => doc.data());
  return products;
  }catch (error) {
    throw error;
  }
}

const updateProduct = async (id, product) => {
  try {
  const productDocRef = doc(collection(db, 'products'), id);
  await setDoc(
    productDocRef,
    {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      productPics: product.productPics,
      createdAt: new Date(),
      rating: product.rating,
      colors: product.colors,
      stock: product.stock,
    },
    { merge: true }
  );
  return true;
}catch (error) {
    throw error;
  }
}

const deleteProduct = async (id) => {
  try {
    const productDocRef = doc(collection(db, 'products'), id);
    await deleteDoc(productDocRef);
    return true;
  } catch (error) {
    throw error;
  }
}
export {addProduct, getProduct, getAllProducts, updateProduct, deleteProduct};