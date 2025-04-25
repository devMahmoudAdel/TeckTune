import React, { useState, useEffect,useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Dimensions, Text, Alert, StyleSheet, TouchableOpacity, View, RefreshControl } from 'react-native';
import CartItem from './CartItem';
import { SwipeListView } from 'react-native-swipe-list-view';
import {addToCart, removeFromCart, getCart , inCart, deleteAll} from '../firebase/Cart';
import Empty from './Empty';
import Loading from './Loading';
const screen = Dimensions.get('window');
const CartItems = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
  if (loading) {
    return (
      <Loading/>
    );
  }
  if (products.length === 0) {
    return (
      <View style={{width:"100%" ,flex:1,justifyContent:"center",alignItems:"center"}}>
        <Empty text="Cart is empty" subText="Add products and try again"/>
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
                  colors={["#2f2baa"]} // Customize refresh indicator color
                  tintColor="#2f2baa" // iOS only
                />
              }
      data={products}
      renderItem={({item}) => (
        <CartItem
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.image}
            rating={item.rating}
            quantity={item.quantity}
            // navigation={navigation}
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
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => Alert.alert("Here hundle goto checkout page")}
          >
            <Text style={styles.textButtonCheckout}>Checkout</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    
  );
}

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
    padding: 10,
    backgroundColor: "#2e2a9d",
    borderRadius: 10,
    top: 20,
    width: screen.width - 40,
    shadowColor: "#2e2a9d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  textButtonCheckout: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});


export default CartItems;
