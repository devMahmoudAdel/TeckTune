import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";
import { getCategory } from "./Category";
import { getBrand } from "./Brand";
// Function to add a product to Firestore
async function addProduct(productData) {
  try {
    const docRef = doc(collection(db, "products"));
    await setDoc(docRef, {
      ...productData,
      id: docRef.id,
      recommendation: [],
      refreshed: productData.refreshed || false,
    });
    <CheckAlert state="success" title="Product added successfully" />
    return docRef.id;
  } catch (error) {
    <CheckAlert state="error" title="error adding product" />
  }
}

// Function to delete a product from Firestore
async function deleteProduct(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    <CheckAlert state="success" title="product deleted successfully" />
  } catch (error) {
    <CheckAlert state="error" title="Error deleting product" />
  }
}

const getProduct = async (id) => {
  const productDocRef = doc(collection(db, 'products'), id);
  const productDoc = await getDoc(productDocRef);
  if (productDoc.exists()) {
    const productData = productDoc.data();
    const category = await getCategory(productData.category);
    const brand = await getBrand(productData.brand);
    return { ...productData, category, brand };
  } else {
    <CheckAlert state="error" title="product does not exist" />
  }
}

const getAllProducts = async () => {
  try {
    const productsCollectionRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollectionRef);
    const products = await Promise.all(productsSnapshot.docs.map(async (docSnap) => {
      const productData = docSnap.data();
      const category = await getCategory(productData.category);
      const brand = await getBrand(productData.brand);
      return {
        ...productData,
        ...category,
        ...brand,
        id: docSnap.id,
      };
    }));
    return products;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />
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
  } catch (error) {
    <CheckAlert state="error" title={error.message} />
  }
};



const getRecommendation = async (id) => {
  if (!id) {
    console.error("Error: Product ID is invalid or empty.");
    return [];
  }

  const productDocRef = doc(collection(db, "products"), id);
  const productDoc = await getDoc(productDocRef);

  if (productDoc.exists()) {
    const productData = productDoc.data();
    const recommendation = productData.recommendation || [];

    const recommendedProducts = await Promise.all(
      recommendation.map(async (rec) => {
        if (!rec.productId) {
          console.warn("Error: Recommendation contains an invalid productId.");
          return null;
        }

        const productDocRef = doc(collection(db, "products"), rec.productId);
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          return { ...productDoc.data(), coPurchaseCount: rec.coPurchaseCount };
        } else {
          console.warn(`Product with ID ${rec.productId} does not exist.`);
          return null;
        }
      })
    );

    return recommendedProducts
      .filter((product) => product !== null)
      .sort((a, b) => b.coPurchaseCount - a.coPurchaseCount);
  } else {
    console.error(`Error: Product with ID ${id} does not exist.`);
    <CheckAlert state="error" title="Product does not exist" />;
    return [];
  }
};

const updateProductRecommendation = async (newRecommendations) => {
  try {
    console.log("updateProductRecommendation");
    const recommendedProducts = await Promise.all(
      newRecommendations.map(async (productId) => {
        const productDocRef = doc(db, "products", productId);
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          return { id: productId, ...productDoc.data() };
        } else {
          console.warn(`Product with ID ${productId} does not exist.`);
          return null;
        }
      })
    );

    //array of products that its id exists in the newRecommendations
    // الوقت هو عدد المنتجات الاشتراها تربيع في عدد المنتجات المتوصله بالفعل
    const validRecommendations = recommendedProducts.filter((product) => product !== null);

    console.log("\n Fetched Recommended Products: \n", validRecommendations);

    for (const product of validRecommendations) {
      const recommendationOfThisProduct = product.recommendation || [];
      for (const product2 of validRecommendations) {
        if (product.id !== product2.id) {
          const existingPair = recommendationOfThisProduct.find(
            (pair) => pair.productId === product2.id
          );
          if (!existingPair) {
            recommendationOfThisProduct.push({
              productId: product2.id,
              coPurchaseCount: 1,
            });
          }
          else {
            existingPair.coPurchaseCount += 1;
          }
        }
      }
    }
    const batch = writeBatch(db);
    validRecommendations.forEach((product) => {
      const productDocRef = doc(db, "products", product.id);
      batch.set(productDocRef, { recommendation: product.recommendation }, { merge: true });
    });
    await batch.commit();




    console.log("Updated Recommendations for Products");
  } catch (error) {
    console.error("Error updating product recommendations:", error);
    <CheckAlert state="error" title="Error updating product recommendations" />;
    return [];
  }
};
export { getProduct, getAllProducts, updateProduct, addProduct, deleteProduct, updateProductRecommendation, getRecommendation };
