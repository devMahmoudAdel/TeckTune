import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { useAuth } from "../context/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const AdminCreator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup, login } = useAuth();

  const createAdminUser = async () => {
    if (!email || !password || !firstName || !lastName || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Register the user
      const userData = {
        email,
        password,
        firstName,
        lastName,
        username,
        phoneNumber: "",
        address: "",
        avatarType: "default",
        avatarIndex: 0,
        role: "admin" // Set role directly in the initial user data
      };

      console.log("Creating user with email:", email);
      const newUser = await signup(userData);
      console.log("User created successfully:", newUser.id);

      // Step 2: Update the user's role to admin in Firestore to ensure it's set
      await setDoc(
        doc(db, "users", newUser.id),
        {
          role: "admin" // This ensures the role is properly set
        },
        { merge: true }
      );

      console.log("User promoted to admin successfully");

      Alert.alert(
        "Success",
        `Admin user created successfully!\n\nEmail: ${email}\nPassword: ${password}`,
        [
          {
            text: "Login Now",
            onPress: async () => {
              try {
                await login(email, password);
                Alert.alert("Success", "Logged in as admin successfully!");
              } catch (error) {
                console.error("Login error:", error);
                Alert.alert("Login Error", error.message);
              }
            },
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );

      // Clear the form
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setUsername("");
    } catch (error) {
      console.error("Error creating admin user:", error);
      Alert.alert("Error", error.message || "Failed to create admin user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Admin User</Text>
        <Text style={styles.subtitle}>Create a new user with admin privileges</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={createAdminUser}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Admin User</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f2baa",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#2f2baa",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminCreator;