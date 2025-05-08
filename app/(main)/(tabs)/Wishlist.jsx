import React, { useState,useCallback } from 'react';
import Entypo from "@expo/vector-icons/Entypo";
import { Text, View, StyleSheet, StatusBar, Alert } from "react-native";
import { useRouter,useFocusEffect } from "expo-router";
import Wishlistitems from "../../../Components/Wishlistitems";
import { deleteAll } from '../../../firebase/Wishlist';
import { useAuth } from "../../../context/useAuth";
import Empty from '../../../Components/Empty';
const Wishlist = () => {
  const router = useRouter();
  const { user, guest } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteAll();
      Alert.alert("Success", "All products removed from wishlist");
    } catch (error) {
      Alert.alert("Error", "Failed to delete all products from wishlist");
    }
    setDeleting(false);
  };
  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { marginTop: StatusBar.currentHeight + 20 }]}
      >
        <Entypo
          name="chevron-left"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text style={styles.textHeader}>Wishlist</Text>

        {/* for delete all product */}
        {!guest && <Entypo name="eraser" size={21} color="black" onPress={() => handleDeleteAll()} />}
      </View>
      <View style={[styles.container, { justifyContent: "center" }]}>
      {guest ? <Empty text="Guest User" subText="Login to see your wishlist"/>:<Wishlistitems/>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "92%",
    alignItems: "center",
    marginBottom: 18,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default Wishlist;
