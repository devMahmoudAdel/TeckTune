import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { getAllUsers } from "../../../../../firebase/User";

export default function UsersList() {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State to manage loading
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers(); // Fetch users using getAllUsers
        setUsers(fetchedUsers); // Store fetched users in state
      } catch (error) {
        console.error("Error fetching users:", error); // Log any errors
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };
    fetchUsers();
  }, []);

  // Filter and search
  const filteredUsers = users
    .filter((user) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (statusFilter && user.status !== statusFilter) return false;
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {//sort by admin then active then lastActive
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      if (a.lastActive < b.lastActive) return -1;
      if (a.lastActive > b.lastActive) return 1;
      return 0;
    });

  // Toggle user status between active and banned
  const toggleStatus = (id) => {
    const user = users.find((user) => user.id === id);
    const newStatus = user.status === "active" ? "banned" : "active";

    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${newStatus === "active" ? "activate" : "ban"} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () =>
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === id ? { ...user, status: newStatus } : user
              )
            ),
        },
      ]
    );
  };

  // Toggle user role between admin and user
  const toggleRole = (id) => {
    const user = users.find((user) => user.id === id);
    const newRole = user.role === "admin" ? "user" : "admin";

    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${newRole === "admin" ? "promote" : "demote"} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () =>
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === id ? { ...user, role: newRole } : user
              )
            ),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f2baa" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users List</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
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
        </View>
        <View style={styles.filterGroup}>
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
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.phone}>Phone: {item.phone}</Text>
              <Text style={styles.role}>Role: {item.role}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.lastActive}>
                Last Active: {item.lastActive} days ago
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.actionButton}
                onPress={() => toggleStatus(item.id)}
              >
                <Text style={styles.actionButtonText}>
                  {item.status === "active" ? "Ban" : "Activate"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => toggleRole(item.id)}
              >
                <Text style={styles.actionButtonText}>
                  {item.role === "admin" ? "Demote" : "Promote"}
                </Text>
              </Pressable>
            </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f2baa",
    margin: 20,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterGroup: {
    flexDirection: "row",
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
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
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
  lastActive: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  actionButtons: {
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#2f2baa",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
