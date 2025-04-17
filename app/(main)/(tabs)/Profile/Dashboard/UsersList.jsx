import React, { useState, useEffect } from "react";
import {View,Text,TextInput,FlatList,StyleSheet,Pressable,Alert,} from "react-native";
import { getAllUsers, updateUser } from "../../../../../firebase/User";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (statusFilter && user.status !== statusFilter) return false;
      if (searchQuery && !user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return 0;
    });

  const toggleStatus = (id) => {
    const user = users.find((user) => user.id === id);
    const newStatus = user.status === "active" ? "banned" : "active";

    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${newStatus === "active" ? "activate" : "ban"} ${user.firstName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await updateUser(id, { status: newStatus });
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === id ? { ...user, status: newStatus } : user
                )
              );
            } catch (error) {
              Alert.alert("Error", "Failed to update user status.");
            }
          },
        },
      ]
    );
  };

  const toggleRole = (id) => {
    const user = users.find((user) => user.id === id);
    const newRole = user.role === "admin" ? "user" : "admin";

    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${newRole === "admin" ? "promote" : "demote"} ${user.firstName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await updateUser(id, { role: newRole });
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === id ? { ...user, role: newRole } : user
                )
              );
            } catch (error) {
              Alert.alert("Error", "Failed to update user role.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users List</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by first name..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, roleFilter === "admin" && styles.activeFilter]}
          onPress={() => setRoleFilter(roleFilter === "admin" ? null : "admin")}
        >
          <Text style={styles.filterText}>Admin</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, roleFilter === "user" && styles.activeFilter]}
          onPress={() => setRoleFilter(roleFilter === "user" ? null : "user")}
        >
          <Text style={styles.filterText}>User</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, statusFilter === "active" && styles.activeFilter]}
          onPress={() => setStatusFilter(statusFilter === "active" ? null : "active")}
        >
          <Text style={styles.filterText}>Active</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, statusFilter === "banned" && styles.activeFilter]}
          onPress={() => setStatusFilter(statusFilter === "banned" ? null : "banned")}
        >
          <Text style={styles.filterText}>Banned</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.email}>{item.email}</Text>
              {item.phone && <Text style={styles.phone}>Phone: {item.phone}</Text>}
              <Text style={styles.role}>Role: {item.role}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>
            <Pressable
              style={[styles.actionButton, styles.banButton]}
              onPress={() => toggleStatus(item.id)}
            >
              <Text style={styles.actionButtonText}>
                {item.status === "active" ? "Ban" : "Activate"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.demoteButton]}
              onPress={() => toggleRole(item.id)}
            >
              <Text style={styles.actionButtonText}>
                {item.role === "admin" ? "Demote" : "Promote"}
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingBottom: 50, 
   },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f2baa",
    margin: 20,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center", 
    marginBottom: 25,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
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
  userCard: {
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
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  phone: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  role: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: "#2f2baa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    position: "absolute",
  },
  banButton: {
    top: 10,
    right: 10,
  },
  demoteButton: {
    bottom: 10,
    right: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
