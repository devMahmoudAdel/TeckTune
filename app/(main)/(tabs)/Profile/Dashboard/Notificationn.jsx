import { View, Text, FlatList, StyleSheet, Pressable, Modal, TextInput, Alert, RefreshControl } from "react-native";
import React, { useState,useEffect } from "react";
import { getNotifications, addNotification, deleteNotification, getNotification } from "../../../../../firebase/notification";
import Empty from "../../../../../Components/Empty";
import Loading from "../../../../../Components/Loading";
export default function Notificationn({ isAdmin = true }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchNotifications = async () => {
    try {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setIsLoading(false);
  };
  useEffect(()=>{
    setIsLoading(true);
    fetchNotifications();
  
  },[])
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddNotification = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Both fields are required!");
      return;
    }

    const newNotification = {
      title,
      description,
      time: new Date().toISOString(),
    };

    await addNotification(newNotification);
    setModalVisible(false);
    setTitle("");
    setDescription("");
    fetchNotifications();
    Alert.alert("Success", "Notification added successfully!");
  };
  const handleDeleteNotification = async (notificationId) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await deleteNotification(notificationId);
            fetchNotifications();    
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (<Loading/>)
  }
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.time) - new Date(a.time));
  
  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
      <Empty text="No Notification Found" subText="Add the notification and try again"/>
      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Notification</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.button} onPress={handleAddNotification}>
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={sortedNotifications}
        style={styles.notificationList}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchNotifications} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => handleDeleteNotification(item.id)}>
            <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
            <Text style={styles.notificationTime}>{formatDate(item.time)}</Text>
          </View>
          </Pressable>
        )}
      />

      {isAdmin && (
        <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Notification</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.button} onPress={handleAddNotification}>
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f2baa",
    margin: 20,
    textAlign: "center",
  },
  notificationList: {
    width: "100%",
  },
  notificationCard: {
    backgroundColor: "#fff",
    width: "100%",
    height: 110,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#555",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#2f2baa",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
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
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#2f2baa",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#aaa",
  },
});
