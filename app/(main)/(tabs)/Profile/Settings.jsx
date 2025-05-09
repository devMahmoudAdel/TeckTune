import React, { useContext,useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../../../../context/useAuth"; 
import { getAllOrdersByUserId } from "../../../../firebase/Order";

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
  }, []);
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
        {['shipped', 'out for delivery', 'pending', 'canceled'].map((status) => (
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
      params: { status: item.status,address: item.address, order_date: item.order_date, expected_delivery_date: item.expected_delivery_date, payment_method: item.payment_method, products: item.products,shipping_price: item.shipping_price,user_name: item.user_name}, 
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
