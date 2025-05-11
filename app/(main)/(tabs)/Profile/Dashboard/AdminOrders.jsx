import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert, Modal, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { getAllOrders, deleteOrder, updateOrder } from "../../../../../firebase/Order";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [editingDeliveryDate, setEditingDeliveryDate] = useState(""); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrders();

        const sortedOrders = allOrders.sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return new Date(a.order_date) - new Date(b.order_date);
        });

        setOrders(sortedOrders);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, []);

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const openProductsModal = (order) => {
    setSelectedOrder(order);
    setEditingDeliveryDate(order.expected_delivery_date);
    setProductsModalVisible(true);
  };

  const saveExpectedDeliveryDate = async () => {
    if (selectedOrder) {
      try {
        await updateOrder(selectedOrder.user_id, selectedOrder.id, {
          expected_delivery_date: editingDeliveryDate,
        });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, expected_delivery_date: editingDeliveryDate }
              : order
          )
        );
        Alert.alert("Success", "Expected delivery date updated successfully.");
        setProductsModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to update expected delivery date.");
      }
    }
  };

  const changeStatus = async (newStatus) => {
    if (selectedOrder) {
      try {
        await updateOrder(selectedOrder.user_id, selectedOrder.id, { status: newStatus });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, status: newStatus } : order
          )
        );
        setModalVisible(false);
        setSelectedOrder(null);
      } catch (error) {
        Alert.alert("Error", "Failed to update order status.");
      }
    }
  };

  const removeOrder = (orderId) => {
    Alert.alert("Confirm Action", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await deleteOrder(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
          } catch (error) {
            Alert.alert("Error", "Failed to delete order.");
          }
        },
      },
    ]);
  };

  const calculateTotalPrice = (products, shippingPrice) => {
    const productsTotal = products.reduce((total, product) => total + product.quantity * product.price, 0);
    return productsTotal + shippingPrice;
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter && order.status !== statusFilter) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Orders</Text>

      <View style={styles.filterContainer}>
        {["canceled", "out for delivery", "shipped", "pending"].map((status) => (
          <Pressable
            key={status}
            style={[
              styles.filterButton,
              statusFilter === status && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter(statusFilter === status ? null : status)}
          >
            <Text style={styles.filterText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => openProductsModal(item)}>
            <View style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.text}>User Name: {item.user_name}</Text>
                <Text style={styles.text}>Order Date: {item.order_date}</Text>
                <Text style={styles.text}>
                  Total Price: ${calculateTotalPrice(item.products, item.shipping_price)}
                </Text>
                <Text style={styles.text}>Address: {item.address}</Text>
                <Text style={styles.text}>Status: {item.status}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <Pressable
                  style={[styles.actionButton, styles.statusButton]}
                  onPress={() => openStatusModal(item)}
                >
                  <Text style={styles.actionButtonText}>Change Status</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => removeOrder(item.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select New Status</Text>
              {["canceled", "out for delivery", "shipped", "pending"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.modalButton}
                  onPress={() => changeStatus(status)}
                >
                  <Text style={styles.modalButtonText}>{status}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {productsModalVisible && selectedOrder && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={productsModalVisible}
          onRequestClose={() => setProductsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, styles.largeModalContent]}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <FlatList
                data={selectedOrder.products}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.productItem}>
                    <Text style={styles.text}>Product Name: {item.name}</Text>
                    <Text style={styles.text}>Quantity: {item.quantity}</Text>
                    <Text style={styles.text}>Price of one: ${item.price}</Text>
                  </View>
                )}
              />
              <View style={styles.shippingInfo}>
                <Text style={styles.text}>Shipping Price: ${selectedOrder.shipping_price}</Text>
              </View>
              <View style={styles.deliveryDateContainer}>
                <Text style={styles.text}>Expected Delivery Date:</Text>
                <TextInput
                  style={styles.input}
                  value={editingDeliveryDate}
                  onChangeText={setEditingDeliveryDate}
                  placeholder="YYYY-MM-DD"
                />
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveExpectedDeliveryDate}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setProductsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: windowWidth * 0.05,
    paddingVertical : windowHeight * 0.08
  },
  title: {
    fontSize: windowWidth * 0.07,
    fontWeight: "bold",
    color: "#2f2baa",
    marginBottom: windowHeight * 0.02,
    textAlign: "center",
  },
  orderCard: {
    flexDirection: windowWidth > 600 ? 'row' : 'column',
    alignItems: 'flex-start',
    backgroundColor: "#fff",
    padding: windowWidth * 0.04,
    borderRadius: 10,
    marginBottom: windowHeight * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderInfo: {
    flex: 1,
    marginBottom: windowWidth > 600 ? 0 : windowHeight * 0.01,
  },
  text: {
    fontSize: windowWidth * 0.035,
    color: "#555",
    marginBottom: windowHeight * 0.005,
  },
  buttonsContainer: {
    flexDirection: windowWidth > 600 ? 'column' : 'row',
    justifyContent: 'space-between',
    width: windowWidth > 600 ? windowWidth * 0.25 : '100%',
    marginTop: windowWidth > 600 ? 0 : windowHeight * 0.01,
  },
  actionButton: {
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.03,
    borderRadius: 6,
    margin: windowWidth > 600 ? windowHeight * 0.005 : 0,
    marginHorizontal: windowWidth > 600 ? 0 : windowWidth * 0.01,
    minWidth: windowWidth > 600 ? '100%' : windowWidth * 0.35,
    alignItems: 'center',
  },
  statusButton: {
    backgroundColor: "#2f2baa",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.03,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: windowWidth * 0.8,
    maxHeight: windowHeight * 0.7,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: windowWidth * 0.05,
  },
  largeModalContent: {
    maxHeight: windowHeight * 0.85,
    width: windowWidth * 0.9,
  },
  modalTitle: {
    fontSize: windowWidth * 0.05,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.02,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#2f2baa",
    padding: windowHeight * 0.015,
    borderRadius: 5,
    marginVertical: windowHeight * 0.005,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
  },
  productItem: {
    padding: windowWidth * 0.03,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: windowHeight * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shippingInfo: {
    marginTop: windowHeight * 0.02,
    padding: windowWidth * 0.03,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: "center",
    marginBottom: windowHeight * 0.02,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.03,
    borderRadius: 8,
    margin: windowWidth * 0.005,
  },
  activeFilter: {
    backgroundColor: "#2f2baa",
  },
  filterText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: windowWidth * 0.03,
  },
  deliveryDateContainer: {
    marginTop: windowHeight * 0.02,
    padding: windowWidth * 0.03,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: windowWidth * 0.02,
    marginTop: windowHeight * 0.01,
    marginBottom: windowHeight * 0.01,
    fontSize: windowWidth * 0.035,
  },
});