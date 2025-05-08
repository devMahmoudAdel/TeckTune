import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";

// Function to add a brand to Firestore
async function addBrand(brandData) {
  try {
    const docRef = doc(collection(db, "brands"));
    await setDoc(docRef, {...brandData, id: docRef.id});
    <CheckAlert state="success" title="Brand added successfully"/>
    return docRef.id;
  } catch (error) {
    <CheckAlert state="error" title="Error adding brand"/>
  }
}

// Function to delete a brand from Firestore
async function deleteBrand(brandId) {
  try {
    const brandRef = doc(db, "brands", brandId);
    await deleteDoc(brandRef);
    <CheckAlert state="success" title="brand deleted successfully"/>
  } catch (error) {
    <CheckAlert state="error" title="Error deleting brand"/>
  }
}

const getBrand = async (id) => {
  const brandDocRef = doc(collection(db, 'brands'), id);
  const brandDoc = await getDoc(brandDocRef);
  if (brandDoc.exists()) {
    return brandDoc.data();
  } else {
    <CheckAlert state="error" title="brand does not exist"/>
  }
}

const getAllBrands = async () => {
  try{
  const brandsCollectionRef = collection(db, 'brands');
  const brandsSnapshot = await getDocs(brandsCollectionRef);
  const brands = brandsSnapshot.docs.map((doc) => doc.data());
  return brands;
  }catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const getProductsByBrand = async (brandId) => {
  try {
    const productsCollectionRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollectionRef);
    const products = productsSnapshot.docs.map((doc) => doc.data());
    return products.filter(product => product.brandId === brandId);
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}

const updateBrand = async (id, brand) => {
  try {
  const brandDocRef = doc(collection(db, 'brands'), id);
  await setDoc(
    brandDocRef,
    brand,
    { merge: true }
  );
  return true;
}catch (error) {
  <CheckAlert state="error" title={error.message}/>
  }
}

export { getBrand, getAllBrands, updateBrand, addBrand, deleteBrand, getProductsByBrand };
