import { Button,ScrollView, Text, View, Image, TextInput, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductList from "./ProductList";
import Search from "../../../../Components/Search";
import { useState } from "react";
export default function Home() {
  const [filterSearch , setFilter] = useState('')
  
  
  
  return (
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Text>Home</Text>
    //   <Button title="About" onPress={() => navigation.navigate("About")} />
    //   <Button title="Cart" onPress={() => navigation.navigate("Cart")} />
    //   <Button
    //     title="Checkout"
    //     onPress={() => navigation.navigate("Checkout")}
    //   />
    //   <Button
    //     title="ProductList"
    //     onPress={() => navigation.navigate("ProductList")}
    //   />
    //   <Button
    //     title="ProductDetails"
    //     onPress={() => navigation.navigate("ProductDetails")}
    //   />
    //   <Button title="Profile" onPress={() => navigation.navigate("Profile")} />
    //   <Button
    //     title="Settings"
    //     onPress={() => navigation.navigate("Settings")}
    //   />
    // </View>

    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userContainer}>
          {/* <Image source={} /> */}
          <Ionicons
            name="person"
            size={40}
            color="black"
            style={styles.imageProfile}
          />
          <View>
            <Text style={styles.helloText}>Hello!</Text>
            <Text style={styles.userNameText}>User Name</Text>
          </View>
        </View>
        <MaterialIcons
          name="notifications-none"
          size={24}
          color="black"
          style={styles.notificationIcon}
        />
      </View>
      {/* // Search */}
      <Search setFilter={setFilter} />

      <View style={{ flex: 1 }}>
        <ProductList filterSearch ={filterSearch} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eeeeee",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    
  },
  helloText: {
    fontSize: 16,
    color: "gray",
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  notificationIcon: {
    padding: 10,
    backgroundColor: "#e5e5e5",
    borderRadius: 25,
  },
  imageProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  inputSearch: {
    fontSize: 16,
    marginLeft: 10,
  },
});
