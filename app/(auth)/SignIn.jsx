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

      // Call the Firebase login function from auth context
      await login(email, password);

      // Navigate to the main app
      router.replace("../(main)/(tabs)/Home");
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Please check your credentials and try again.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed login attempts. Please try again later.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    // Implement social sign-in logic here
    Alert.alert(
      "Social Sign In",
      `${provider} sign-in is not implemented yet.`
    );
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
          onPress={() => handleSocialSignIn("Google")}
        >
          <Ionicons name="logo-google" color="#555" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconSignin}
          onPress={() => handleSocialSignIn("Apple")}
        >
          <Ionicons name="logo-apple" color="#555" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconSignin}
          onPress={() => handleSocialSignIn("Facebook")}
        >
          <Ionicons name="logo-facebook" color="#555" size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
