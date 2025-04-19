import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

// Function to add a product to Firestore
async function addProduct(productData) {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    await updateDoc(docRef, { id: docRef.id });
    console.log("Product added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
}

// Function to delete a product from Firestore
async function deleteProduct(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Product deleted with ID: ", productId);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
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

export { getProduct, getAllProducts, updateProduct, addProduct, deleteProduct };
