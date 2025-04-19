import React, {useState, useEffect} from 'react';
import { Dimensions, Text, FlatList, StyleSheet, Pressable,RefreshControl, TouchableOpacity, View } from 'react-native';
import CartItem from './Wishlistitem';
import {addToWishlist, getWishlist, removeFromWishlist, inWishlist, deleteAll} from '../firebase/Wishlist';
const screen = Dimensions.get('window');
const Wishlistitems = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const wishlistItems = await getWishlist();
        setProducts(wishlistItems);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProducts();
  },[])
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (products.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No products in wishlist</Text>
      </View>
    );
  }
  return (
    <FlatList
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingBottom: 100,
      }}
      refreshControl={<RefreshControl refreshing={false} />}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      data={products}
      renderItem={({ item }) => (
        <Pressable>
          <CartItem
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.image}
            rating={item.rating}
            quantity={item.quantity}

            

          />
        </Pressable>
      )}
    />
  );
  
}

const styles = StyleSheet.create({

});
export default Wishlistitems;
