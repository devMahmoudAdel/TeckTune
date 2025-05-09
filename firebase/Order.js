import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";

async function addOrder(userId, orderData) {
  try {
    const userOrdersRef = collection(db, `users/${userId}/orders`);
    const docRef = await addDoc(userOrdersRef, { ...orderData, id: docRef.id });
    <CheckAlert state="success" title="Order added successfully" />;
    return docRef.id;
  } catch (error) {
    <CheckAlert state="error" title="Error adding order" />;
  }
}

async function deleteOrder(userId, orderId) {
  try {
    const orderRef = doc(db, `users/${userId}/orders`, orderId);
    await deleteDoc(orderRef);
    <CheckAlert state="success" title="Order deleted successfully" />;
  } catch (error) {
    <CheckAlert state="error" title="Error deleting order" />;
  }
}

const getOrder = async (userId, orderId) => {
  try {
    const orderDocRef = doc(db, `users/${userId}/orders`, orderId);
    const orderDoc = await getDoc(orderDocRef);
    if (orderDoc.exists()) {
      return orderDoc.data();
    } else {
      <CheckAlert state="error" title="Order does not exist" />;
    }
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

const getAllOrders = async (userId) => {
  try {
    const ordersCollectionRef = collection(db, `users/${userId}/orders`);
    const ordersSnapshot = await getDocs(ordersCollectionRef);
    const orders = ordersSnapshot.docs.map((doc) => doc.data());
    return orders;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

const updateOrder = async (userId, orderId, orderData) => {
  try {
    console.log(userId, orderId, orderData);
    const orderDocRef = doc(db, `users/${userId}/orders`, orderId);
    console.log("2");
    await updateDoc(orderDocRef, orderData); 
    console.log("3");
    <CheckAlert state="success" title="Order updated successfully" />;
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

const createOrder = async (userId, orderData) => {
  try {
    const orderDocRef = doc(collection(db, `users/${userId}/orders`));
    const orderDate = new Date();
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + 5);

    await setDoc(orderDocRef, {
      products: orderData.products,
      order_date: orderDate,
      expected_delivery_date: expectedDeliveryDate,
      shipping_price: orderData.shipping_price || 0,
      status: orderData.status || "preparing",
      address: orderData.address,
      payment_method: orderData.payment_method,
      id: orderDocRef.id,
    }, { merge: true });

    <CheckAlert state="success" title="Order created successfully" />;
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

export { addOrder, deleteOrder, getOrder, getAllOrders, updateOrder, createOrder };
