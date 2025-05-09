import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert, Modal, TouchableOpacity, RefreshControl } from "react-native";
import { getAllUsers } from "../../../../../firebase/User";
import { getAllOrders, deleteOrder, updateOrder } from "../../../../../firebase/Order";
import Loading from "../../../../../Components/Loading";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [users, allOrders] = await Promise.all([
        getAllUsers(),
        Promise.all(
          (await getAllUsers()).map((user) =>
            getAllOrders(user.id).then((orders) =>
              orders.map((order) => ({
                ...order,
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
              }))
            )
          )
        ),
      ]);

      const flattenedOrders = allOrders.flat();

      const sortedOrders = flattenedOrders.sort((a, b) => {
        if (a.status === "preparing" && b.status !== "preparing") return -1;
        if (a.status !== "preparing" && b.status === "preparing") return 1;
        return new Date(a.order_date) - new Date(b.order_date);
      });

      setOrders(sortedOrders);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const openProductsModal = (order) => {
    setSelectedOrder(order);
    setProductsModalVisible(true);
  };

  const changeStatus = async (newStatus) => {
    if (selectedOrder) {
      try {
        await updateOrder(selectedOrder.userId, selectedOrder.id, { status: newStatus });
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

  const removeOrder = (userId, orderId) => {
    Alert.alert("Confirm Action", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await deleteOrder(userId, orderId);
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

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Orders</Text>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        {["canceled", "completed", "shipped", "preparing"].map((status) => (
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => openProductsModal(item)}>
            <View style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.text}>User Name: {item.userName}</Text>
                <Text style={styles.text}>Order Date: {item.order_date}</Text>
                <Text style={styles.text}>
                  Total Price: ${calculateTotalPrice(item.products, item.shipping_price)}
                </Text>
                <Text style={styles.text}>Address: {item.address}</Text>
                <Text style={styles.text}>Status: {item.status}</Text>
              </View>
              <Pressable
                style={[styles.actionButton, styles.statusButton]}
                onPress={() => openStatusModal(item)}
              >
                <Text style={styles.actionButtonText}>Change Status</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => removeOrder(item.userId, item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
      {productsModalVisible && selectedOrder && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={productsModalVisible}
          onRequestClose={() => setProductsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Details</Text>
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
              {["canceled", "completed", "shipped", "preparing"].map((status) => (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f2baa",
    marginBottom: 20,
    textAlign: "center",
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  orderInfo: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    position: "absolute",
  },
  statusButton: {
    backgroundColor: "#2f2baa",
    top: 10,
    right: 80,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    top: 10,
    right: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2f2baa",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shippingInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: "#2f2baa",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
