import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

// Function to add a product to Firestore
async function addProduct(productData) {
  try {
    // Create product without ID first
    const cleanProductData = { ...productData };
    delete cleanProductData.id; // Remove any existing id to avoid conflicts
    
    const docRef = await addDoc(collection(db, "products"), cleanProductData);
    // Then update with the generated ID
    const generatedId = docRef.id;
    await updateDoc(docRef, { id: generatedId });
    console.log("Product added with ID: ", generatedId);
    return generatedId;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
}

// Function to delete a product from Firestore
async function deleteProduct(productId) {
  try {
    if (!productId) {
      console.error("[Delete Error] Product ID is missing");
      throw new Error("Product ID is required for deletion");
    }
    
    console.log("[Delete] Attempting to delete product with ID:", productId);
    
    const productDocRef = doc(db, "products", productId);
    await deleteDoc(productDocRef);
    
    // Verify deletion
    const verifyDoc = await getDoc(productDocRef);
    if (!verifyDoc.exists()) {
      console.log("[Delete Success] Product deleted with ID:", productId);
      return true;
    } else {
      throw new Error("Product deletion failed - document still exists");
    }
  } catch (error) {
    console.error(`[Delete Error] Failed to delete product ${productId}:`, error);
    throw error;
  }
}

const getProduct = async (id) => {
  try {
    if (!id) {
      throw new Error("Product ID is required");
    }
    const productDocRef = doc(db, "products", id);
    const productDoc = await getDoc(productDocRef);
    if (productDoc.exists()) {
      return productDoc.data();
    } else {
      throw new Error('Product does not exist');
    }
  } catch (error) {
    console.error(`Error getting product with ID ${id}:`, error);
    throw error;
  }
}

const getAllProducts = async () => {
  try {
    const productsCollectionRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollectionRef);
    const products = productsSnapshot.docs.map((doc) => doc.data());
    console.log(`Retrieved ${products.length} products`);
    return products;
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
}

const updateProduct = async (id, product) => {
  try {
    if (!id) {
      throw new Error("Product ID is required for update");
    }
    
    console.log(`Attempting to update product ${id} with data:`, product);
    
    // Keep the original ID in the updated product
    const updatedData = {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      id: id, // Ensure ID is preserved
      updatedAt: new Date(),
      rating: product.rating,
      colors: product.colors,
      stock: product.stock,
    };
    
    // Include productPics only if it exists in the product data
    if (product.productPics) {
      updatedData.productPics = product.productPics;
    }
    
    const productDocRef = doc(db, "products", id);
    await setDoc(productDocRef, updatedData, { merge: true });
    console.log("Product updated with ID:", id);
    return true;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
}

export { getProduct, getAllProducts, updateProduct, addProduct, deleteProduct };
