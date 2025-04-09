import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/useAuth";

export default function SignIn() {
  // State management for form inputs and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get router and auth context
  const router = useRouter();
  const { login } = useAuth();

  // Handle login submission
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setIsSubmitting(true);

      // Here you would normally call your API to authenticate
      // For now we'll simulate an authentication
      // Replace this with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On successful authentication:
      const userData = {
        id: "user123",
        email: email,
        name: "User Name",
        // Add any other user data you need
      };

      // Use the login function from auth context
      await login(userData);

      // Navigate to the main app
      router.replace("/(main)");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.textTitle}>Login Now</Text>
        <Text style={styles.textsubTitle}>
          Welcome back you've been missed!
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/ForgotPassword")}
        style={{ paddingHorizontal: 20 }}
      >
        <Text style={styles.textForgot}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSignin}
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.textButtonSignin}>Sign in</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={{ padding: 20 }}
        onPress={() => router.push("/(auth)/signUp/Step1")}
      >
        <Text style={styles.textButtonSignup}>Create new account</Text>
      </TouchableOpacity>

      <View style={{ marginVertical: 20 }}>
        <Text style={{ color: "#2f2baa", fontSize: 17, textAlign: "center" }}>
          Or continue with
        </Text>
      </View>

      <View style={styles.containerIconSignin}>
        <TouchableOpacity
          style={styles.iconSignin}
          onPress={() => handleSocialSignIn("google")}
        >
          <Ionicons name="logo-google" color="#555" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconSignin}
          onPress={() => handleSocialSignIn("apple")}
        >
          <Ionicons name="logo-apple" color="#555" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconSignin}
          onPress={() => handleSocialSignIn("facebook")}
        >
          <Ionicons name="logo-facebook" color="#555" size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Helper function for social sign-in (to be implemented)
const handleSocialSignIn = (provider) => {
  // Implement social sign-in logic here
  console.log(`Sign in with ${provider}`);
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    padding: 40,
    paddingTop: 80,
    paddingBottom: 40,
  },
  textTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#2f2baa",
    textAlign: "center",
  },
  textsubTitle: {
    fontSize: 20,
    marginTop: 13,
    color: "#555",
    textAlign: "center",
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
  inputGroup: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  textForgot: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#2f2baa",
    alignSelf: "flex-end",
  },
  buttonSignin: {
    padding: 20,
    marginVertical: 30,
    backgroundColor: "#2f2baa",
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#9d9aff",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textButtonSignin: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  textButtonSignup: {
    color: "#555",
    fontSize: 20,
    textAlign: "center",
  },
  containerIconSignin: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconSignin: {
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginHorizontal: 10,
    padding: 10,
  },
});
