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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Step2 = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse parameters from URL
  const username = params.username || "";
  const email = params.email || "";
  const password = params.password || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const progressValue = new Animated.Value(0.66);

  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 0.66,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const validateInput = (field, value) => {
    let errorMessage = null;

    switch (field) {
      case "firstName":
        if (!value.trim()) errorMessage = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) errorMessage = "Last name is required";
        break;
      case "phoneNumber":
        if (value.trim() && !/^\d{11}$/.test(value.replace(/[^0-9]/g, ""))) {
          errorMessage = "Please enter a valid 11-digit phone number";
        }
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
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }

    if (focusedField === field) {
      validateInput(field, value);
    }
  };

  const validateInputs = () => {
    const isFirstNameValid = validateInput("firstName", firstName);
    const isLastNameValid = validateInput("lastName", lastName);
    const isPhoneNumberValid = validateInput("phoneNumber", phoneNumber);

    return isFirstNameValid && isLastNameValid && isPhoneNumberValid;
  };

  const handleNext = () => {
    if (validateInputs()) {
      router.push({
        pathname: "/(auth)/signUp/Step3",
        params: {
          username,
          email,
          password,
          firstName,
          lastName,
          address,
          phoneNumber,
        }
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
      field === "firstName"
        ? firstName
        : field === "lastName"
        ? lastName
        : field === "phoneNumber"
        ? phoneNumber
        : address
    );
  };

  const goBack = () => {
    router.back();
  };
  
  const scrollViewProps =
    Platform.OS === "web"
      ? { style: { maxHeight: "100vh", overflowY: "auto" } }
      : {};
      
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        {...scrollViewProps}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.stepIndicator}>Step 2 of 3</Text>
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

        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>
          Tell us a little more about yourself
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "firstName" && styles.focusedInput,
                errors.firstName && styles.errorInput,
              ]}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              onFocus={() => handleFocus("firstName")}
              onBlur={() => handleBlur("firstName")}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "lastName" && styles.focusedInput,
                errors.lastName && styles.errorInput,
              ]}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              onFocus={() => handleFocus("lastName")}
              onBlur={() => handleBlur("lastName")}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (optional)</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "phoneNumber" && styles.focusedInput,
                errors.phoneNumber && styles.errorInput,
              ]}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              onFocus={() => handleFocus("phoneNumber")}
              onBlur={() => handleBlur("phoneNumber")}
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                styles.addressInput,
                focusedField === "address" && styles.focusedInput,
              ]}
              placeholder="Enter your address"
              value={address}
              onChangeText={(text) => handleInputChange("address", text)}
              onFocus={() => handleFocus("address")}
              onBlur={() => handleBlur("address")}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={22} color="#6055D8" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
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
    width: "66%",
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
  addressInput: {
    height: 100,
    paddingTop: 16,
    textAlignVertical: "center",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#6055D8",
    borderRadius: 10,
    width: "48%",
  },
  backButtonText: {
    color: "#6055D8",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: "#6055D8",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
    flexDirection: "row",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default Step2;