import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const orders = [
  {
    address: "456 Elm St, Los Angeles, CA",
    expected_delivery_date: "2025-05-10",
    id: "product2",
    order_date: "2025-05-05",
    payment_method: "visa",
    shipping_price: 50,
    status: "shipped",
    products: [
      {
        name: "Laptop",
        price: 1500,
        quantity: 1
      }
    ],
    user_id: "user12345",
    user_name: "john_doe"
  },
  {
    address: "890 River St, Denver, CO",
    expected_delivery_date: "2025-05-22",
    id: "product9",
    order_date: "2025-05-18",
    payment_method: "paypal",
    shipping_price: 10,
    status: "OutForDelivery",
    products: [
      {
        name: "Bluetooth Speaker",
        price: 75,
        quantity: 1
      },
      {
        name: "USB Cable",
        price: 10,
        quantity: 3
      }
    ],
    user_id: "user10002",
    user_name: "mason_clark"
  },
  {
    address: "66 Pine St, Austin, TX",
    expected_delivery_date: "2025-05-28",
    id: "product10",
    order_date: "2025-05-21",
    payment_method: "cash on delivery",
    shipping_price: 25,
    status: "pending",
    products: [
      {
        name: "Coffee Maker",
        price: 90,
        quantity: 1
      },
      {
        name: "Coffee Beans",
        price: 20,
        quantity: 2
      }
    ],
    user_id: "user10003",
    user_name: "ella_martin"
  }
];

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const order = orders.find(order => order.id === id);

  const calculateTotal = (products, shipping) => {
    const productTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return productTotal + shipping;
  };

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, paddingTop: 30, paddingHorizontal: 20, backgroundColor: '#fff' }}>
      

      <Text style={{ fontSize: 18, marginBottom: 10 }}>Customer: {order.user_name}</Text>
      <Text style={{ fontSize: 16 }}>Status: {order.status}</Text>
      <Text style={{ fontSize: 16 }}>Address: {order.address}</Text>
      <Text style={{ fontSize: 16 }}>Order Date: {order.order_date}</Text>
      <Text style={{ fontSize: 16 }}>Expected Delivery: {order.expected_delivery_date}</Text>
      <Text style={{ fontSize: 16 }}>Payment Method: {order.payment_method}</Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Products:</Text>
      {order.products.map((product, index) => (
        <View key={index} style={{ marginVertical: 5 }}>
          <Text>- {product.name} x {product.quantity} = ${product.price * product.quantity}</Text>
        </View>
      ))}

      <Text style={{ marginTop: 10, fontSize: 16 }}>Shipping: ${order.shipping_price}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
        Total: ${calculateTotal(order.products, order.shipping_price)}
      </Text>
    </ScrollView>
  );
}
