import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth } from "./config";
import CheckAlert from "../Components/CheckAlert";

const getNotifications = async () => {
  try {
    const notificationsCollectionRef = collection(db, "notifications");
    const notificationsSnapshot = await getDocs(notificationsCollectionRef);
    const notifications = notificationsSnapshot.docs.map((doc) => doc.data());
    return notifications;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};

const addNotification = async (notificationData) => {
  try {
    const notificationDocRef = doc(collection(db, "notifications"));
    await setDoc(notificationDocRef, notificationData);
    await updateDoc(notificationDocRef, { id: notificationDocRef.id }, { merge: true });
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const notificationDocRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationDocRef);
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};
const getNotification = async (notificationId) => {
  try {
    const notificationDocRef = doc(db, "notifications", notificationId);
    const notificationDoc = await getDoc(notificationDocRef);
    return notificationDoc.data();
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};

export { getNotifications, addNotification, deleteNotification, getNotification };