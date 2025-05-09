import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {Dimensions, Text, Alert, StyleSheet, TouchableOpacity, View, RefreshControl,} from 'react-native';
import CartItem from './CartItem';
import { useRouter } from "expo-router";
import { SwipeListView } from 'react-native-swipe-list-view';
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
  deleteAll,
} from '../firebase/Cart';
import Empty from './Empty';
import Loading from './Loading';
import OrderSummary from './OrderSummary';

const screen = Dimensions.get('window');

const CartItems = ({ navigation }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countItems, setCountItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleDeleteAll = async () => {
    try {
      await deleteAll();
      setProducts([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id);
      const updatedProducts = await getCart();
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeFromCart(id);
      const updatedProducts = await getCart();
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      await updateCartQuantity(id, newQuantity);
      const updatedProducts = await getCart();
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const cartItems = await getCart();
      setProducts(cartItems);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    let count = 0;
    let subtotalAmount = 0;

    products.forEach((item) => {
      count += item.quantity;
      subtotalAmount += item.quantity * item.price;
    });

    const discountValue = subtotalAmount > 500 ? 20 : 0;
    const deliveryValue = subtotalAmount > 200 ? 0 : 30;
    const totalValue = (subtotalAmount + deliveryValue) - (subtotalAmount + deliveryValue) * discountValue/100;

    setCountItems(count);
    setSubtotal(subtotalAmount);
    setDiscount(discountValue);
    setDeliveryCharges(deliveryValue);
    setTotal(totalValue);
  }, [products]);

  if (loading) {
    return <Loading />;
  }

  if (products.length === 0) {
    return (
      <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Empty text="Cart is empty" subText="Add products and try again" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <SwipeListView
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2f2baa']}
            tintColor="#2f2baa"
          />
        }
        data={products}
        renderItem={({ item }) => (
          <CartItem
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.images[0]}
            rating={item.rating}
            quantity={item.quantity}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.hiddenContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={100}
        rightOpenValue={0}
        disableLeftSwipe={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingBottom: 100,
        }}
        ListFooterComponent={() => (
          <View style={{ marginTop: 20 }}>
            <OrderSummary
              numOfItems={countItems}
              Subtotal={subtotal}
              Discount={discount}
              Delivery_Charges={deliveryCharges}
              total={total}
            />
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.replace({
                pathname: "../../(checkout)/Checkout",
                params: {
                  subtotal: subtotal,
                  discount: discount,
                  delivery: deliveryCharges,
                  count: countItems,
                  total: total
                }
              })}
            >
              <Text style={styles.textButtonCheckout}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    alignItems: 'flex-start',
    backgroundColor: 'red',
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: '100%',
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#2e2a9d',
    borderRadius: 10,
    width: screen.width - 40,
    shadowColor: '#2e2a9d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  textButtonCheckout: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default CartItems;
