import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";

// Function to add a product to Firestore
async function addProduct(productData) {
  try {
    const docRef = doc(collection(db, "products"));
    await setDoc(docRef, {...productData, id: docRef.id});
    <CheckAlert state="success" title="Product added successfully"/>
    return docRef.id;
  } catch (error) {
    <CheckAlert state="error" title="error adding product"/>
  }
}

// Function to delete a product from Firestore
async function deleteProduct(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    <CheckAlert state="success" title="product deleted successfully"/>
  } catch (error) {
    <CheckAlert state="error" title="Error deleting product"/>
  }
}

const getProduct = async (id) => {
  const productDocRef = doc(collection(db, 'products'), id);
  const productDoc = await getDoc(productDocRef);
  if (productDoc.exists()) {
    return productDoc.data();
  } else {
    <CheckAlert state="error" title="product does not exist"/>
  }
}

const getAllProducts = async () => {
  try{
  const productsCollectionRef = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCollectionRef);
  const products = productsSnapshot.docs.map((doc) => doc.data());
  return products;
  }catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const updateProduct = async (id, product) => {
  try {
  const productDocRef = doc(collection(db, 'products'), id);
  await setDoc(
    productDocRef,
    product,
    { merge: true }
  );
  return true;
}catch (error) {
  <CheckAlert state="error" title={error.message}/>
  }
}

export { getProduct, getAllProducts, updateProduct, addProduct, deleteProduct };
