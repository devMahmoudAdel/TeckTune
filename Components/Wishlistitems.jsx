import React, {useState, useEffect,useCallback} from 'react';
import { useFocusEffect } from 'expo-router';
import { Dimensions, Text, FlatList, StyleSheet, Pressable,RefreshControl, TouchableOpacity, View, _View } from 'react-native';
import CartItem from './Wishlistitem';
import {addToWishlist, getWishlist, removeFromWishlist, inWishlist, deleteAll} from '../firebase/Wishlist';
import Empty from './Empty';
import Loading from './Loading';
const screen = Dimensions.get('window');
const Wishlistitems = ({refreshstate}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshing2, setRefreshing2] = useState(0);
  const fetchProducts = async () => {
    try {
      const wishlistItems = await getWishlist();
      setProducts(wishlistItems);
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
      }, [refreshstate,refreshing2])
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
        <Empty text="The wishlist is empty" subText="Add the product and try again"/>
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
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#2f2baa"]} // Customize refresh indicator color
                  tintColor="#2f2baa" // iOS only
                />
              }
      data={products}
      renderItem={({ item }) => (
        <Pressable>
          <CartItem
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.images[0]}
            rating={item.rating}
            quantity={item.quantity}
            setRefreshing2={setRefreshing2}

          />
        </Pressable>
      )}
    />
  );
  
}

const styles = StyleSheet.create({

});
export default Wishlistitems;
