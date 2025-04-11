import React, { useState } from 'react';
import { Dimensions, Text, FlatList, StyleSheet, Pressable,RefreshControl, TouchableOpacity, View } from 'react-native';
import CartItem from './CartItem';
import { SwipeListView } from 'react-native-swipe-list-view';
const screen = Dimensions.get('window');
const CartItems = ({navigation}) => {
  const [products, setProducts] = useState([
    {
      key: "1",
      title: "Apple iPhone 15 Pro ",
      price: 45000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      key: "2",
      title: "Samsung Galaxy S24 Ultra",
      price: 42000,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "3",
      title: "Xiaomi Redmi Note 13",
      price: 9500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "4",
      title: "Lenovo IdeaPad 3 Laptop",
      price: 21000,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "5",
      title: "HP Victus Gaming Laptop",
      price: 30000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      key: "6",
      title: "Sony WH-1000XM5 Headphones",
      price: 18000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      key: "7",
      title: "Apple AirPods Pro 2",
      price: 9000,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "8",
      title: "Samsung Galaxy Watch 6",
      price: 8500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "9",
      title: "Anker PowerCore 20000mAh",
      price: 1500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "10",
      title: "JBL Flip 6 Bluetooth Speaker",
      price: 4500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      key: "11",
      title: "Canon EOS 200D II Camera",
      price: 27000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      key: "12",
      title: "Amazon Kindle Paperwhite",
      price: 5500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
  ]);
  
  const handleDelete = (key) => {
    setProducts(prev => prev.filter(item => item.key !== key));
  };

  return (

    <View style={{ flex: 1, alignItems: 'center' }}>
    <SwipeListView
      data={products}
      renderItem={({item}) => (
        <CartItem
            title={item.title}
            price={item.price}
            image={item.image}
            rating={item.rating}
            navigation={navigation}
          />
      )}
      renderHiddenItem={({ item }) => (
          <View style={styles.hiddenContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.key)}
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
            onPress={() => navigation.navigate("Checkout")}
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
