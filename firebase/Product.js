import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";

// Function to add a product to Firestore
async function addProduct(productData) {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    await updateDoc(docRef, { id: docRef.id });
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
    return true; // Return true on successful deletion
  } catch (error) {
    console.error("Error deleting product:", error);
    <CheckAlert state="error" title="Error deleting product"/>
    return false; // Return false on error
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
    
    // Create an updated product object that includes all fields from the form
    const updatedProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      colors: product.colors,
      rating: product.rating,
      // Add the new fields from our enhanced form
      imageUrl: product.imageUrl,
      brand: product.brand,
      featured: product.featured,
      updatedAt: new Date()
    };
    
    // Use setDoc with merge option to update the document
    await setDoc(productDocRef, updatedProduct, { merge: true });
    
    <CheckAlert state="success" title="Product updated successfully" />
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    <CheckAlert state="error" title={error.message} />
    return false;
  }
}

export { getProduct, getAllProducts, updateProduct, addProduct, deleteProduct };
