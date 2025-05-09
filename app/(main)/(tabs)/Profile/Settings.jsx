import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const orders = [
  {
    address: "456 Elm St, Los Angeles, CA",
    expected_delivery_date: "2025-05-10",
    id: "product2",
    order_date: "2025-05-05",
    payment_method: "visa",
    shipping_attribute: 15,
    products: [
      {
        name: "Wireless Mouse",
        price: 250,
        quantity: 1,
        status: "Active",
        total_price: 250
      }
    ]
  },
  {
    address: "789 Oak St, Chicago, IL",
    expected_delivery_date: "2025-05-08",
    id: "product3",
    order_date: "2025-05-04",
    payment_method: "paypal",
    shipping_attribute: 15,
    products: [
      {
        name: "Mechanical Keyboard",
        price: 750,
        quantity: 1,
        status: "Canceled",
        total_price: 750
      },
      {
        name: "Keyboard",
        price: 750,
        quantity: 1,
        status: "Canceled",
        total_price: 750
      }
    ]
  },
  {
    address: "101 Pine St, Houston, TX",
    expected_delivery_date: "2025-05-12",
    id: "product4",
    order_date: "2025-05-06",
    payment_method: "apple pay",
    shipping_attribute: 15,
    products: [
      {
        name: "Bluetooth Speaker",
        price: 500,
        quantity: 2,
        status: "Completed",
        total_price: 1000
      }
    ]
  }
];

export default function Settings() {
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const router = useRouter();

  // Filter orders where any product matches the selected status
  const filteredOrders = orders.filter(order =>
    order.products.some(product => product.status === selectedStatus)
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { color: '#6200EE' };
      case 'Completed':
        return { color: '#28a745' };
      case 'Canceled':
        return { color: '#dc3545' };
      default:
        return { color: '#000' };
    }
  };

  const calculateTotal = (products, shipping) => {
    const productTotal = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    return productTotal + shipping;
  };

  return (
    <View style={{ flex: 1, paddingTop: 70, paddingHorizontal: 20, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <TouchableOpacity style={{ position: 'absolute', left: 0 }} onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={28} color='#000' />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Orders</Text>
      </View>

      {/* Status Filter */}
      <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'space-around' }}>
        {['Active', 'Completed', 'Canceled'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={{
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: selectedStatus === status ? '#6200EE' : '#ddd'
            }}>
            <Text style={{ color: selectedStatus === status ? '#6200EE' : '#000' }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const firstProductStatus = item.products[0].status;
          const total = calculateTotal(item.products, item.shipping_attribute);

          return (
            <View style={{ marginBottom: 15, backgroundColor: '#f1f1f1', padding: 15, borderRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order ID: {item.id}</Text>
              <Text style={getStatusStyle(firstProductStatus)}>Status: {firstProductStatus}</Text>
              <Text style={{ fontSize: 16 }}>Total: ${total}</Text>
              <Text style={{ fontSize: 14, color: '#555' }}>Address: {item.address}</Text>
              <Text style={{ fontSize: 14, color: '#555' }}>Delivery: {item.expected_delivery_date}</Text>
              <Text style={{ fontSize: 14, color: '#555' }}>Shipping: ${item.shipping_attribute}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
