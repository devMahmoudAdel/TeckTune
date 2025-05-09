import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc , updateDoc } from "firebase/firestore";



const addReview = async (reviewData, productId) => {
  if (!productId) {
    console.error("addReview: productId is missing");
    return false;
  }
  try {
    const reviewDocRef = doc(collection(db, "products", productId, "reviews"));
    await setDoc(reviewDocRef, reviewData);
    return true;
  } catch (error) {
    console.error("addReview error:", error);
    return false;
  }
};

const getReviews = async (productId) => {
  if (!productId) {
    console.error("getReviews: productId is missing");
    return [];
  }
  try {
    const reviewsCollectionRef = collection(db, "products", productId, "reviews");
    const reviewsSnapshot = await getDocs(reviewsCollectionRef);
    const reviews = reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return reviews;
  } catch (error) {
    console.error("getReviews error:", error);
    return [];
  }
};

const deleteReview = async (productId, reviewId) => {
  if (!productId || !reviewId) {
    console.error("deleteReview: productId or reviewId is missing");
    return false;
  }
  try {
    const reviewDocRef = doc(db, "products", productId, "reviews", reviewId);
    await deleteDoc(reviewDocRef);
    return true;
  } catch (error) {
    console.error("Failed to delete review:", error);
    return false;
  }
};

const getReview = async (productId, reviewId) => {
  if (!productId || !reviewId) {
    console.error("getReview: productId or reviewId is missing");
    return null;
  }
  try {
    const reviewDocRef = doc(db, "products", productId, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewDocRef);
    return reviewDoc.data();
  } catch (error) {
    console.error("getReview error:", error);
    return null;
  }
};


export async function updateProductRating(productId) {
  try {
    const reviewsCollectionRef = collection(db, "products", productId, "reviews");
    const reviewsSnapshot = await getDocs(reviewsCollectionRef);
    const reviews = reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
      : 0;
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { rating: avgRating });
    console.log("Updated product rating to:", avgRating);
  } catch (error) {
    console.error("Failed to update product rating:", error);
  }
}

export { addReview, getReviews, deleteReview, getReview };