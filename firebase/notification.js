import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { auth } from "./config";

const getNotifications = async () => {
  try {
    const notificationsCollectionRef = collection(db, "notifications");
    const notificationsSnapshot = await getDocs(notificationsCollectionRef);
    const notifications = notificationsSnapshot.docs.map((doc) => doc.data());
    return notifications;
  } catch (error) {
    throw error;
  }
};

const addNotification = async (notificationData) => {
  try {
    const notificationDocRef = doc(collection(db, "notifications"));
    await setDoc(notificationDocRef, notificationData);
    return true;
  } catch (error) {
    throw error;
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const notificationDocRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationDocRef);
    return true;
  } catch (error) {
    throw error;
  }
};
const getNotification = async (notificationId) => {
  try {
    const notificationDocRef = doc(db, "notifications", notificationId);
    const notificationDoc = await getDoc(notificationDocRef);
    return notificationDoc.data();
  } catch (error) {
    throw error;
  }
};

export { getNotifications, addNotification, deleteNotification, getNotification };