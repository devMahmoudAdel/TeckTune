import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";


const addReview = async (reviewData, productId) => {
  try {
    const reviewDocRef = doc(collection(db, "products", productId, "reviews"));
    await setDoc(reviewDocRef, reviewData);
    return true;
  } catch (error) {
    throw error;
  }
}

const getReviews = async (productId) => {
  try {
    const reviewsCollectionRef = collection(db, "products", productId, "reviews");
    const reviewsSnapshot = await getDocs(reviewsCollectionRef);
    const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
    return reviews;
  }
  catch (error) {
    throw error;
  }
}

const deleteReview = async (productId, reviewId) => {
  try {
    const reviewDocRef = doc(db, "products", productId, "reviews", reviewId);
    await deleteDoc(reviewDocRef);
    return true;
  } catch (error) {
    throw error;
  }
}
const getReview = async (productId, reviewId) => {
  try {
    const reviewDocRef = doc(db, "products", productId, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewDocRef);
    return reviewDoc.data();
  } catch (error) {
    throw error;
  }
}

export { addReview, getReviews, deleteReview, getReview };