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

export default function MyOrders() {
  const [selectedStatus, setSelectedStatus] = useState('shipped');
  const router = useRouter();
  const filteredOrders = orders
    .filter(order => order.status === selectedStatus)
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  const calculateTotal = (products, shipping) => {
    const productTotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
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

      <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'space-around' }}>
        {['shipped', 'OutForDelivery', 'pending', 'Canceled'].map((status) => (
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

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, backgroundColor: '#f1f1f1', padding: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.user_name}</Text>
            <Text style={{ fontSize: 16 }}>Total: ${calculateTotal(item.products, item.shipping_price)}</Text>
            <TouchableOpacity
              onPress={() => {
    router.push({
      pathname: './OrderDetails',
      params: { id: item.id }, 
    }) }  
  }
              style={{ marginTop: 10, backgroundColor: '#6200EE', padding: 10, borderRadius: 6 }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Track Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
