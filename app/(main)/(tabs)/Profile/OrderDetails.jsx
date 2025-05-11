import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const parseProductsParam = (productsParam) => {
  if (Array.isArray(productsParam)) return productsParam;
  if (typeof productsParam === 'string') {
    try {
      const parsed = JSON.parse(productsParam);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Products parsing error:", e);
      return [];
    }
  }
  return [];
};

export default function OrderDetails() {
  const params = useLocalSearchParams();
  
  const {
    id = '',
    user_name = 'Customer',
    address = 'Not specified',
    status = 'unknown',
    order_date = 'Unknown date',
    expected_delivery_date = 'Not specified',
    payment_method = 'Unknown',
    products: productsParam = '[]',
    shipping_price = '0'
  } = params;

  const productsArray = parseProductsParam(productsParam);
  const shippingCost = parseFloat(shipping_price) || 0;

  const calculateTotal = (products, shipping) => {
    return products.reduce((sum, p) => {
      const price = parseFloat(p.price) || 0;
      const quantity = parseInt(p.quantity) || 0;
      return sum + (price * quantity);
    }, 0) + shipping;
  };

  const totalCost = calculateTotal(productsArray, shippingCost);

  if (productsArray.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>No products found in this order.</Text>
        <Text style={styles.smallText}>Order ID: {id || 'N/A'}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.sectionTitle}>Order #{id || 'N/A'}</Text>
      
      <Text style={styles.sectionTitle}>Customer Information</Text>
      <View style={styles.card}>
        <Text style={styles.label}>👤 Name: <Text style={styles.value}>{user_name}</Text></Text>
        <Text style={styles.label}>📦 Status: <Text style={[
          styles.value, 
          status === 'canceled' ? styles.statusCanceled : 
          status === 'shipped' ? styles.statusShipped :
          status === 'out for delivery' ? styles.statusOutForDelivery :
          styles.statusPending
        ]}>{status}</Text></Text>
        <Text style={styles.label}>🏠 Address: <Text style={styles.value}>{address}</Text></Text>
        <Text style={styles.label}>🗓️ Order Date: <Text style={styles.value}>{order_date}</Text></Text>
        <Text style={styles.label}>🚚 Expected Delivery: <Text style={styles.value}>{expected_delivery_date}</Text></Text>
        <Text style={styles.label}>💳 Payment Method: <Text style={styles.value}>{payment_method}</Text></Text>
      </View>

      <Text style={styles.sectionTitle}>Products ({productsArray.length})</Text>
      <View style={styles.card}>
        {productsArray.map((product, index) => (
          <View key={`${product.name}-${index}`} style={styles.productItem}>
            <Text style={styles.productName}>
              {product.name || 'Unnamed Product'} × {product.quantity || 0}
            </Text>
            <Text style={styles.productPrice}>
              ${((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 0)).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Subtotal: <Text style={styles.price}>${(totalCost - shippingCost).toFixed(2)}</Text></Text>
        <Text style={styles.summaryText}>Shipping: <Text style={styles.price}>${shippingCost.toFixed(2)}</Text></Text>
        <Text style={styles.totalText}>Total: <Text style={styles.totalPrice}>${totalCost.toFixed(2)}</Text></Text>
      </View>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    paddingVertical: windowHeight * 0.02,
    paddingHorizontal: windowWidth * 0.05,
  },
  sectionTitle: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    marginTop: windowHeight * 0.03,
    marginBottom: windowHeight * 0.015,
    color: '#2563EB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: windowWidth * 0.04,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: windowHeight * 0.02,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
    color: '#6B7280',
  },
  value: {
    color: '#111827',
    fontWeight: '600',
  },
  statusShipped: {
    color: '#10B981',
  },
  statusOutForDelivery: {
    color: '#3B82F6',
  },
  statusPending: {
    color: '#F59E0B',
  },
  statusCanceled: {
    color: '#EF4444',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: windowHeight * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productName: {
    fontSize: windowWidth * 0.04,
    color: '#374151',
    flex: 1,
    marginRight: windowWidth * 0.03,
  },
  productPrice: {
    fontSize: windowWidth * 0.04,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: windowWidth * 0.2,
    textAlign: 'right',
  },
  summaryContainer: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: windowWidth * 0.04,
    marginBottom: windowHeight * 0.05,
    borderColor: '#60A5FA',
    borderWidth: 1,
  },
  summaryText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
    color: '#1D4ED8',
  },
  price: {
    fontWeight: '600',
  },
  totalText: {
    fontSize: windowWidth * 0.045,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: windowHeight * 0.01,
  },
  totalPrice: {
    color: '#DC2626',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: windowWidth * 0.05,
  },
  notFoundText: {
    fontSize: windowWidth * 0.05,
    color: '#9CA3AF',
    marginBottom: windowHeight * 0.02,
    textAlign: 'center',
  },
  smallText: {
    fontSize: windowWidth * 0.035,
    color: '#6B7280',
  },
});