import { collection, addDoc, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import CheckAlert from "../Components/CheckAlert";
import { deleteAll } from "./Cart";

async function addOrder(orderData) {
  try {
    const orderRef = doc(collection(db, "orders"));
    const userOrderRef = doc(collection(db, "users", orderData.user_id, "orders"));
    const orderDate = new Date();
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + 5);

    await setDoc(orderRef, {
      order_date: orderDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      expected_delivery_date: expectedDeliveryDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      products: orderData.products,
      shipping_price: orderData.shipping_price||50,
      status: "pending", 
      address: orderData.address,
      payment_method: orderData.payment_method,
      user_name: orderData.user_name,
      user_id: orderData.user_id,
      id: orderRef.id
    });

    await setDoc(userOrderRef, {
      orderId: orderRef.id
    })

    await deleteAll();

    <CheckAlert state="success" title="Order added successfully" />;
    return orderRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    <CheckAlert state="error" title="Error adding order" />;
  }
}

async function deleteOrder(orderId) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await deleteDoc(orderRef);
    <CheckAlert state="success" title="Order deleted successfully" />;
  } catch (error) {
    <CheckAlert state="error" title="Error deleting order" />;
  }
}

const getOrder = async (orderId) => {
  try {
    const orderDocRef = doc(db, "orders", orderId);
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

const getAllOrders = async () => {
  try {
    const ordersCollectionRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersCollectionRef);
    const orders = ordersSnapshot.docs.map((doc) => doc.data());
    return orders;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};
const getAllOrdersByUserId = async (userId) => {
  console.log("userId", userId);
  try {
    const ordersCollectionRef = collection(db, "orders");
    const ordersSnapshot = await getDocs(ordersCollectionRef);
    const userOrders = ordersSnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .filter((order) => order.user_id === userId);
    return userOrders;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};
const updateOrder = async (userId, orderId, orderData) => {
  try {
    console.log(userId, orderId, orderData);
    const orderDocRef = doc(db,"orders", orderId);
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

export { addOrder, deleteOrder, getOrder, getAllOrders, updateOrder, createOrder,getAllOrdersByUserId };
