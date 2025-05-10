import React, { useState, useCallback } from 'react';
import Entypo from "@expo/vector-icons/Entypo";
import { Text, View, StyleSheet, StatusBar, Alert, Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import Wishlistitems from "../../../Components/Wishlistitems";
import { deleteAll } from '../../../firebase/Wishlist';
import { useAuth } from "../../../context/useAuth";
import Empty from '../../../Components/Empty';

const screen = Dimensions.get('window');

const Wishlist = () => {
  const router = useRouter();
  const { user, guest } = useAuth();
  const [refreshing, setRefreshing] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteAll();
      setRefreshing(refreshing + 1);
      // Alert.alert("Success", "All products removed from wishlist");
    } catch (error) {
      Alert.alert("Error", "Failed to delete all products from wishlist");
    }
    setDeleting(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: StatusBar.currentHeight + 20 }]}>
        <Entypo
          name="chevron-left"
          size={screen.width * 0.06} // Responsive icon size
          color="black"
          onPress={() => router.back()}
        />
        <Text style={styles.textHeader}>Wishlist</Text>

        {/* for delete all product */}
        {!guest && (
          <Entypo
            name="eraser"
            size={screen.width * 0.05} // Responsive icon size
            color="black"
            onPress={() => handleDeleteAll()}
          />
        )}
      </View>
      <View style={styles.content}>
        {guest ? (
          <Empty text="Guest User" subText="Login to see your wishlist" />
        ) : (
          <Wishlistitems refreshstate={refreshing} />
        )}
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
    paddingHorizontal: screen.width * 0.03, // Responsive padding
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: screen.height * 0.02, // Responsive margin
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: screen.width * 0.05, // Responsive font size
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
});

export default Wishlist;
