import { View, Text,Modal,StyleSheet,FlatList,TouchableOpacity } from 'react-native'
import React, { useState, useEffect,useCallback } from 'react'
import { useFocusEffect } from 'expo-router';
import { getNotifications, addNotification, deleteNotification, getNotification } from "../firebase/notification";
import notifications from './notifictionsdata';
import Ionicons from "react-native-vector-icons/Ionicons";
export default function Notifications({modalVisible,setModalVisible}) {
    const [notifications, setNotifications] = useState([]);
    const fetchNotifications = async () => {
        const notificationsData = await getNotifications();
        setNotifications(notificationsData);        
    } 
    useFocusEffect(
        useCallback(() => {
          fetchNotifications();
    },[]));
  return (
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
                    style={styles.notificationList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.notificationCard}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationDescription}>
                        {item.description}
                      </Text>
                    </View>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
  )
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
  notificationList: {
    width: "100%",
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
    position: "absolute",
    top: -10,
    right: 10,
    marginTop: 20,
    backgroundColor: "#2f2baa",
    padding: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
