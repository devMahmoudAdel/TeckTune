import { Button,ScrollView, Text, View, Image, TextInput, StyleSheet, Modal, FlatList, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductList from "./ProductList";
import Search from "../../../Components/Search";
import { useState } from "react";
import notifications from "../../../Components/notifictionsdata";

export default function Home() {
  const [filterSearch, setFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons
            name="notifications-none"
            size={24}
            color="black"
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={notifications
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .slice(0, 5)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationDescription}>{item.description}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Search */}
      <Search setFilter={setFilter} />

      <View style={{ flex: 1 }}>
        <ProductList filterSearch={filterSearch} />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  notificationCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#555",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2f2baa",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
