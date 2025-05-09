import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderDetails() {
  const {
    user_name,
    address,
    status,
    order_date,
    expected_delivery_date,
    payment_method,
    products,
    shipping_price,
  } = useLocalSearchParams(); // Use the passed parameters directly

  const router = useRouter();

  // Convert products map to an array
  const productsArray = products
    ? Object.entries(products).map(([name, details]) => ({
        name,
        ...details,
      }))
    : [];

  const calculateTotal = (products, shipping) => {
    const productTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return productTotal + shipping;
  };

  if (productsArray.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, paddingTop: 30, paddingHorizontal: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Customer: {user_name}</Text>
      <Text style={{ fontSize: 16 }}>Status: {status}</Text>
      <Text style={{ fontSize: 16 }}>Address: {address}</Text>
      <Text style={{ fontSize: 16 }}>Order Date: {order_date}</Text>
      <Text style={{ fontSize: 16 }}>Expected Delivery: {expected_delivery_date}</Text>
      <Text style={{ fontSize: 16 }}>Payment Method: {payment_method}</Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Products:</Text>
      {productsArray.map((product, index) => (
        <View key={index} style={{ marginVertical: 5 }}>
          <Text>
            - {product.name} x {product.quantity} = ${product.price * product.quantity}
          </Text>
        </View>
      ))}

      <Text style={{ marginTop: 10, fontSize: 16 }}>Shipping: ${shipping_price}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
        Total: ${calculateTotal(productsArray, shipping_price)}
      </Text>
    </ScrollView>
  );
}