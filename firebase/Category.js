import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";

// Function to add a category to Firestore
async function addCategory(categoryData) {
  try {
    const docRef = doc(collection(db, "categories"));
    await setDoc(docRef, {...categoryData, id: docRef.id});
    <CheckAlert state="success" title="Category added successfully"/>
    return docRef.id;
  } catch (error) {
    <CheckAlert state="error" title="error adding category"/>
  }
}

// Function to delete a category from Firestore
async function deleteCategory(categoryId) {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
    <CheckAlert state="success" title="category deleted successfully"/>
  } catch (error) {
    <CheckAlert state="error" title="Error deleting category"/>
  }
}

const getCategory = async (id) => {
  const categoryDocRef = doc(collection(db, 'categories'), id);
  const categoryDoc = await getDoc(categoryDocRef);
  if (categoryDoc.exists()) {
    return categoryDoc.data();
  } else {
    <CheckAlert state="error" title="category does not exist"/>
  }
}

const getAllCategories = async () => {
  try{
  const categoriesCollectionRef = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollectionRef);
  const categories = categoriesSnapshot.docs.map((doc) => doc.data());
  return categories;
  }catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const getProductsByCategory = async (categoryId) => {
  try {
    const productsCollectionRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollectionRef);
    const products = productsSnapshot.docs.map((doc) => doc.data());
    return products.filter(product => product.categoryId === categoryId);
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const updateCategory = async (id, category) => {
  try {
  const categoryDocRef = doc(collection(db, 'categories'), id);
  await setDoc(
    categoryDocRef,
    category,
    { merge: true }
  );
  return true;
}catch (error) {
  <CheckAlert state="error" title={error.message}/>
  }
}

export { getCategory, getAllCategories, updateCategory, addCategory, deleteCategory, getProductsByCategory };
