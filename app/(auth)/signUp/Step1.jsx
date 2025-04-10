import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Step1 = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const progressValue = new Animated.Value(0.33);

  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 0.33,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must include an uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must include a number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      return "Password must include a special character";
    return null;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: "None", color: "#ccc", width: "0%" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    if (score === 0)
      return { strength: "Very Weak", color: "#ff4d4d", width: "20%" };
    if (score === 1)
      return { strength: "Weak", color: "#ffaa00", width: "40%" };
    if (score === 2)
      return { strength: "Medium", color: "#ffcc00", width: "60%" };
    if (score === 3)
      return { strength: "Strong", color: "#a3e048", width: "80%" };
    return { strength: "Very Strong", color: "#32cd32", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateInput = (field, value) => {
    let errorMessage = null;

    switch (field) {
      case "username":
        if (!value.trim()) errorMessage = "Username is required";
        else if (value.length < 3)
          errorMessage = "Username must be at least 3 characters";
        break;
      case "email":
        errorMessage = validateEmail(value);
        break;
      case "password":
        errorMessage = validatePassword(value);
        break;
      case "confirmPassword":
        if (value !== password) errorMessage = "Passwords do not match";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));

    return !errorMessage;
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    if (focusedField === field) {
      validateInput(field, value);
    }
  };

  const validateInputs = () => {
    const isUsernameValid = validateInput("username", username);
    const isEmailValid = validateInput("email", email);
    const isPasswordValid = validateInput("password", password);
    const isConfirmPasswordValid = validateInput(
      "confirmPassword",
      confirmPassword
    );
    return (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    );
  };

  const handleNext = () => {
    if (validateInputs()) {
      router.push({
        pathname: "/(auth)/signUp/Step2",
        params: { username, email, password },
      });
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = (field) => {
    setFocusedField(null);
    validateInput(
      field,
      field === "username"
        ? username
        : field === "email"
        ? email
        : field === "password"
        ? password
        : confirmPassword
    );
  };

  // A block used to handle the scroll in the web bundle
  const scrollViewProps =
    Platform.OS === "web"
      ? { style: { maxHeight: "100vh", overflowY: "auto" } }
      : {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        {...scrollViewProps}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.stepIndicator}>Step 1 of 3</Text>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Let's get started with your journey</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "username" && styles.focusedInput,
                errors.username && styles.errorInput,
              ]}
              placeholder="Enter your username"
              value={username}
              onChangeText={(text) => handleInputChange("username", text)}
              onFocus={() => handleFocus("username")}
              onBlur={() => handleBlur("username")}
              autoCapitalize="none"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.focusedInput,
                errors.email && styles.errorInput,
              ]}
              placeholder="Enter your email address"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => handleInputChange("email", text)}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  focusedField === "password" && styles.focusedInput,
                  errors.password && styles.errorInput,
                ]}
                placeholder="Create a strong password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => handleInputChange("password", text)}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#6055D8"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <View style={styles.passwordStrengthContainer}>
              <View style={styles.strengthLabelContainer}>
                <Text style={styles.strengthLabel}>Password Strength:</Text>
                <Text
                  style={[
                    styles.strengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.strength}
                </Text>
              </View>
              <View style={styles.strengthBarBackground}>
                <View
                  style={[
                    styles.strengthBarFill,
                    {
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  focusedField === "confirmPassword" && styles.focusedInput,
                  errors.confirmPassword && styles.errorInput,
                ]}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) =>
                  handleInputChange("confirmPassword", text)
                }
                onFocus={() => handleFocus("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#6055D8"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/SignIn")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  progressContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  stepIndicator: {
    fontSize: 14,
    color: "#6055D8",
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6055D8",
    borderRadius: 4,
    width: "33%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
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
  focusedInput: {
    borderColor: "#6055D8",
    backgroundColor: "#fff",
    shadowColor: "#6055D8",
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
  passwordStrengthContainer: {
    marginTop: 12,
  },
  strengthLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  strengthLabel: {
    fontSize: 12,
    color: "#666",
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  strengthBarBackground: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#6055D8",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {
    fontSize: 14,
    color: "#555",
    flexShrink: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: "#6055D8",
    fontWeight: "bold",
  },
  termsError: {
    marginTop: 0,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#6055D8",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signInText: {
    fontSize: 14,
    color: "#666",
  },
  signInLink: {
    fontSize: 14,
    color: "#6055D8",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default Step1;
