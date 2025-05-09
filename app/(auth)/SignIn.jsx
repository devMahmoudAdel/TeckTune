import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Get router and auth context
  const router = useRouter();
  const { login, enterGuestMode } = useAuth();

  const handleSkip = () => {
    enterGuestMode();
    router.replace("../(main)/(tabs)/Home");
  };

  // No longer needed as we're using alert dialogs instead
  // of inline validation errors
  const validateInputs = () => {
    return email && password;
  };

  const handleLogin = async () => {
    // Basic validation before sending to auth - this prevents unnecessary network requests
    if (!email || !password) {
      const message = "Please enter both email and password";
      if (Platform.OS === 'web') {
        // Custom alert for web to avoid "localhost:8081 says" header
        showWebAlert("Missing Information", message);
      } else {
        Alert.alert("Missing Information", message);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      router.replace("../(main)/(tabs)/Home");
    } catch (error) {
      console.error("Login error:", error);
      
      let title = "Authentication Failed";
      let message = "We couldn't sign you in. Please try again later.";

      // Handle specific Firebase errors with more descriptive messages
      if (error.message === "account-data-missing") {
        title = "Account Not Found";
        message = "Your account data has been deleted. Would you like to create a new account with the same email address?";
        
        if (Platform.OS === 'web') {
          if (confirm(message)) {
            router.push("/(auth)/signUp/Step1");
          }
        } else {
          Alert.alert(
            title,
            message,
            [
              {
                text: "Create New Account",
                onPress: () => router.push("/(auth)/signUp/Step1"),
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          );
        }
        setIsSubmitting(false);
        return;
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        title = "Incorrect Credentials";
        message = "The email or password you entered is incorrect. Please check your information and try again.";
      } else if (error.code === "auth/too-many-requests") {
        title = "Too Many Attempts";
        message = "You've made too many login attempts in a short period of time. Please try again later or reset your password.";
      } else if (error.code === "auth/network-request-failed") {
        title = "Network Error";
        message = "We couldn't connect to our servers. Please check your internet connection and try again.";
      } else if (error.code === "auth/invalid-email") {
        title = "Invalid Email";
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/user-disabled") {
        title = "Account Disabled";
        message = "Your account has been disabled. Please contact support for assistance.";
      } else if (error.code === "auth/requires-recent-login") {
        title = "Session Expired";
        message = "Your login session has expired. Please log in again to continue.";
      }

      // Show appropriate alert based on platform
      if (Platform.OS === 'web') {
        showWebAlert(title, message);
      } else {
        Alert.alert(title, message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showWebAlert = (title, message) => {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.right = '0';
    dialog.style.bottom = '0';
    dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialog.style.zIndex = '10000';
    dialog.style.display = 'flex';
    dialog.style.justifyContent = 'center';
    dialog.style.alignItems = 'center';

    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.borderRadius = '8px';
    content.style.padding = '20px';
    content.style.maxWidth = '400px';
    content.style.width = '80%';
    content.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.margin = '0 0 10px 0';
    titleEl.style.color = '#2f2baa';
    titleEl.style.fontSize = '18px';

    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.margin = '0 0 20px 0';
    messageEl.style.fontSize = '14px';
    messageEl.style.color = '#555';

    const button = document.createElement('button');
    button.textContent = 'OK';
    button.style.backgroundColor = '#2f2baa';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.padding = '8px 16px';
    button.style.cursor = 'pointer';
    button.style.float = 'right';
    button.style.fontWeight = 'bold';
    button.onclick = () => document.body.removeChild(dialog);
    
    document.body.appendChild(dialog);
    dialog.appendChild(content);
    content.appendChild(titleEl);
    content.appendChild(messageEl);
    content.appendChild(button);

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Add Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

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

      {/* <TouchableOpacity
        style={styles.googleButton}
        onPress={() => Alert.alert("Google Sign In", "Google sign-in is not implemented yet.")}
      >
        <Ionicons name="logo-google" color="#fff" size={20} />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity> */}
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
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  skipText: {
    color: "#2f2baa",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});