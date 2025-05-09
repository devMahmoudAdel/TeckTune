import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../../../../context/useAuth"; 
import { getAllOrdersByUserId } from "../../../../firebase/Order";

const ensureStringifiableProducts = (products) => {
  if (!products) return '[]';
  if (typeof products === 'string') {
    try {
      JSON.parse(products);
      return products;
    } catch {
      return '[]';
    }
  }
  return JSON.stringify(products);
};

export default function MyOrders() {
  const [selectedStatus, setSelectedStatus] = useState('shipped');
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getAllOrdersByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  const filteredOrders = orders
    .filter(order => order.status === selectedStatus)
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  const calculateTotal = (products, shipping) => {
    if (!Array.isArray(products)) return shipping || 0;
    return products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0) + (shipping || 0);
  };

  const handleTrackOrder = (order) => {
    router.push({
      pathname: './OrderDetails',
      params: {
        id: order.id || '',
        status: order.status || 'unknown',
        address: order.address || 'Not specified',
        order_date: order.order_date || 'Unknown date',
        expected_delivery_date: order.expected_delivery_date || 'Not specified',
        payment_method: order.payment_method || 'Unknown',
        products: ensureStringifiableProducts(order.products),
        shipping_price: order.shipping_price?.toString() || '0',
        user_name: order.user_name || 'Customer'
      }
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 70, paddingHorizontal: 20, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <TouchableOpacity style={{ position: 'absolute', left: 0 }} onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={28} color='#000' />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Orders</Text>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'space-around' }}>
        {['shipped', 'out for delivery', 'pending', 'canceled'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={{
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: selectedStatus === status ? '#6200EE' : '#ddd'
            }}>
            <Text style={{ color: selectedStatus === status ? '#6200EE' : '#000' }}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredOrders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No orders found with status: {selectedStatus}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, backgroundColor: '#f1f1f1', padding: 15, borderRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.user_name}</Text>
              <Text style={{ fontSize: 16 }}>Total: ${calculateTotal(item.products, item.shipping_price).toFixed(2)}</Text>
              <TouchableOpacity
                onPress={() => handleTrackOrder(item)}
                style={{ marginTop: 10, backgroundColor: '#6200EE', padding: 10, borderRadius: 6 }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Track Order</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}