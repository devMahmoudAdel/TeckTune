import React from 'react';
import { Dimensions, Text, FlatList, StyleSheet, Pressable,RefreshControl, TouchableOpacity } from 'react-native';
import CartItem from './Wishlistitem';
const screen = Dimensions.get('window');
const Wishlistitems = ({navigation}) => {
  const products = [
    {
      title: "Apple iPhone 15 Pro ",
      price: 45000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Samsung Galaxy S24 Ultra",
      price: 42000,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Xiaomi Redmi Note 13",
      price: 9500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Lenovo IdeaPad 3 Laptop",
      price: 21000,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "HP Victus Gaming Laptop",
      price: 30000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Sony WH-1000XM5 Headphones",
      price: 18000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Apple AirPods Pro 2",
      price: 9000,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Samsung Galaxy Watch 6",
      price: 8500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Anker PowerCore 20000mAh",
      price: 1500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "JBL Flip 6 Bluetooth Speaker",
      price: 4500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Canon EOS 200D II Camera",
      price: 27000,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Amazon Kindle Paperwhite",
      price: 5500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
  ];
  

  return (
    <FlatList
      keyExtractor={(item) => item.title}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingBottom: 100, // عشان يكون في مساحة للزر تحت
      }}
      refreshControl={<RefreshControl refreshing={false} />}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      data={products}
      renderItem={({ item }) => (
        <Pressable>
          <CartItem
            title={item.title}
            price={item.price}
            image={item.image}
            rating={item.rating}
            navigation={navigation}
          />
        </Pressable>
      )}
    />
  );
  
}

const styles = StyleSheet.create({

});
export default Wishlistitems;
