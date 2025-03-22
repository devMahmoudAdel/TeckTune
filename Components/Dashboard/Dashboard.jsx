import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";

const Dashboard = ({ navigation }) => {
  const files = [
    { name: "AdminBrands", title: "Admin Brands" },
    { name: "AdminCategories", title: "Admin Categories" },
    { name: "AdminOrders", title: "Admin Orders" },
    { name: "AdminProducts", title: "Admin Products" },
    { name: "AdminUsers", title: "Admin Users" },
    { name: "Notificationn", title: "Notifications" },
  ];

  const handleButtonPress = (fileName) => {
    navigation.navigate(fileName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.buttonContainer}>
        {files.map((file) => (
          <TouchableOpacity
            key={file.name}
            style={styles.button}
            onPress={() => handleButtonPress(file.name)}
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
