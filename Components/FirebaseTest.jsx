import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { testFirebaseConnection } from "../firebase/Auth";
import { useAuth } from "../context/useAuth";

const FirebaseTest = () => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const { signup, login } = useAuth();

  const runConnectionTest = async () => {
    setTesting(true);
    setErrorDetails(null);
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
      
      if (result) {
        Alert.alert("Success", "Firebase connection is working correctly!");
      } else {
        Alert.alert("Error", "Firebase connection test failed. Check details below.");
      }
    } catch (error) {
      console.error("Test error:", error);
      setTestResult(false);
      setErrorDetails(error.message || JSON.stringify(error));
      Alert.alert("Error", "Test failed. Details shown below.");
    } finally {
      setTesting(false);
    }
  };

  const testSignup = async () => {
    setTesting(true);
    setErrorDetails(null);
    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const testPassword = "Test@123456";
      
      const userData = {
        email: testEmail,
        password: testPassword,
        firstName: "Test",
        lastName: "User",
        username: `testuser_${Date.now()}`,
        phoneNumber: "1234567890",
        address: "Test Address",
        avatarType: "default",
        avatarIndex: 0,
      };
      
      console.log("Attempting to create test user:", {...userData, password: "[HIDDEN]"});
      await signup(userData);
      Alert.alert(
        "Success", 
        `Test user created successfully!\nEmail: ${testEmail}\nPassword: ${testPassword}\n\nYou can now try logging in with these credentials.`
      );
      setTestResult(true);
    } catch (error) {
      console.error("Signup test error:", error);
      setTestResult(false);
      setErrorDetails(error.message || JSON.stringify(error));
      Alert.alert("Error", "Test signup failed. Details shown below.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Configuration Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={runConnectionTest}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? "Testing..." : "Test Firebase Connection"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testSignup}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? "Creating..." : "Create Test User"}
        </Text>
      </TouchableOpacity>
      
      {testResult !== null && (
        <Text style={[
          styles.resultText, 
          {color: testResult ? "#4CAF50" : "#F44336"}
        ]}>
          {testResult 
            ? "✅ Test passed! Firebase is configured correctly." 
            : "❌ Test failed. See details below:"}
        </Text>
      )}
      
      {errorDetails && (
        <ScrollView style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorDetails}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2f2baa",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  errorContainer: {
    maxHeight: 150,
    width: "100%",
    backgroundColor: "#FFF8F8",
    borderColor: "#F44336",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
  }
});

export default FirebaseTest;