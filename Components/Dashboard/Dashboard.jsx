import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Dashboard = ({ navigation }) => {
  const files = [
    { name: "AdminBrands", title: "Admin Brands" },
    { name: "AdminCategories", title: "Admin Categories" },
    { name: "AdminOrders", title: "Admin Orders" },
    { name: "AdminProducts", title: "Admin Products" },
    { name: "UsersList", title: "Users" },
    { name: "Notificationn", title: "Notifications" },
    { name: "ProductForm", title: "Product Form testing", params: { id: 1 } },
  ];

  const handleButtonPress = (fileName, params = {}) => {
    navigation.navigate(fileName, params);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.buttonContainer}>
        {files.map((file) => (
          <TouchableOpacity
            key={file.name}
            style={styles.button}
            onPress={() => handleButtonPress(file.name, file.params)}
          >
            <Text style={styles.buttonText}>{file.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f2baa",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2f2baa",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Dashboard;
/*
making adminproduct usecase 

AdminProducts contain the products.

user can search for a product by name

If the user selects a product, it will navigate to the ProductForm for editing

If the user selects the delete button in AdminProducts,
it will allow them to choose the products they want to delete.

in delete button mode ,there will be 2 buttons will be shown:
one for delte the selected products and the other for cancel the delete mode

user can longpress to select the products to delete
_______________________________________________________________________
making productform usecase 

productform contains the product details and take input for each detail

it contains 2 buttons one for save and the other for delete

after click on any button ,a message will be shown to confirm
_______________________________________________________________________
the productform and adminproduct will communicate with each other using id
(adminproduct send the productid to productform)



*/