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
import { isUserExists,isPasswordExists, isEmailExists } from "../../firebase/User";

export default function SignIn() {
  // State management for form inputs and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Get router and auth context
  const router = useRouter();
  const { login, enterGuestMode } = useAuth();

  const handleSkip = () => {
    enterGuestMode();
    router.replace("../(main)/(tabs)/Home");
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return null;
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password is too short";
    return null;
  };

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      if (emailError) setEmailError("");
    } else if (field === "password") {
      setPassword(value);
      if (passwordError) setPasswordError("");
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
    // Clear errors when focusing
    if (field === "email" && emailError) setEmailError("");
    if (field === "password" && passwordError) setPasswordError("");
  };

  const handleBlur = (field) => {
    setFocusedField(null);

    // Validate on blur
    if (field === "email") {
      const error = validateEmail(email);
      setEmailError(error || "");
    } else if (field === "password") {
      const error = validatePassword(password);
      setPasswordError(error || "");
    }
  };

  const validateInputs = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setEmailError(emailError || "");
    setPasswordError(passwordError || "");

    return !emailError && !passwordError;
  };

  const handleCredentialError = (error) => {
    setEmailError("");
    setPasswordError("");

    console.log("Error details:", error.code, error.message);

    // Handle specific Firebase authentication errors
    switch (error.code) {
      // Email-specific errors
      case "auth/user-not-found":
        setEmailError(
          "Email not found. Please check your email or create an account."
        );
        break;
      case "auth/invalid-email":
        setEmailError("Please enter a valid email address.");
        break;
      case "auth/user-disabled":
        setEmailError("This account has been disabled.");
        break;

      // Password-specific errors
      case "auth/wrong-password":
        setPasswordError("Incorrect password. Please try again.");
        break;

      // Combined credential errors
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        setEmailError("Invalid email or password.");
        setPasswordError("Invalid email or password.");
        break;

      // Network and rate limiting errors
      case "auth/too-many-requests":
        setEmailError("Too many login attempts. Please try again later.");
        break;
      case "auth/network-request-failed":
        setEmailError("Network error. Please check your connection.");
        break;

      // Account missing error (special handling)
      case "account-data-missing":
        handleAccountDataMissing();
        break;

      // Fallback for unknown errors
      default:
        // Check if there's a message in the error object
        if (error.message && error.message.includes("account-data-missing")) {
          handleAccountDataMissing();
        } else {
          setEmailError("Authentication failed. Please try again.");
          console.error("Unhandled auth error:", error);
        }
        break;
    }
  };

  // handling the account-data-missing scenario
  const handleAccountDataMissing = () => {
    if (Platform.OS === "web") {
      if (
        confirm(
          "Your account data has been deleted. Would you like to create a new account with the same email address?"
        )
      ) {
        router.push("/(auth)/signUp/Step1");
      }
    } else {
      Alert.alert(
        "Account Not Found",
        "Your account data has been deleted. Would you like to create a new account with the same email address?",
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
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    if (validateInputs()) {
      setIsSubmitting(true);

      try {
        const emailExists = await isEmailExists(email);
        const passwordExists = await isPasswordExists(password);
        const userExists = await isUserExists(email, password);

        if(!passwordExists && !emailExists) {
          setEmailError(
            "Email not found. Please check your email or create an account."
          );
          setPasswordError(
            "Password is incorrect."
          );
          setIsSubmitting(false);
          return;
        }
        

        else if (!emailExists) {
          setEmailError(
            "Email not found. Please check your email or create an account."
          );
          setPasswordError("");
          setIsSubmitting(false);
          return;
        }


        if (!userExists){
          setPasswordError(
            "Password is incorrect."
          );
          setIsSubmitting(false);
          return;
        }

        

        await login(email, password);
        router.replace("../(main)/(tabs)/Home");
      } catch (error) {
        handleCredentialError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
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
          style={[
            styles.input,
            focusedField === "email" && styles.focusedInput,
            emailError && styles.errorInput,
          ]}
          placeholder="Enter your Email"
          value={email}
          onChangeText={(text) => handleInputChange("email", text)}
          onFocus={() => handleFocus("email")}
          onBlur={() => handleBlur("email")}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              focusedField === "password" && styles.focusedInput,
              passwordError && styles.errorInput,
            ]}
            placeholder="Enter your Password"
            value={password}
            onChangeText={(text) => handleInputChange("password", text)}
            onFocus={() => handleFocus("password")}
            onBlur={() => handleBlur("password")}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#2f2baa"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.buttonSignin, isSubmitting && styles.disabledButton]}
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
  disabledButton: {
    backgroundColor: "#9d9aff",
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
  // New styles for enhanced validation
  focusedInput: {
    borderColor: "#2f2baa",
    backgroundColor: "#fff",
    shadowColor: "#2f2baa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  errorInput: {
    borderColor: "#FF4D4D",
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
  },
});
