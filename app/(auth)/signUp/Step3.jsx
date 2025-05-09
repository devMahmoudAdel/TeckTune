import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Modal,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { takePhoto,selectImage,uploadImage } from "../../../supabase/loadImage";


const { width } = Dimensions.get("window");
const AVATAR_SIZE = width / 3 - 20;


const Step3 = () => {
  const router = useRouter();
  const { signup } = useAuth();

  // Get passed parameters from previous steps
  const params = useLocalSearchParams();
  const {
    username = "",
    email = "",
    password = "",
    firstName = "",
    lastName = "",
    address = "",
    phoneNumber = "",
  } = params;

  const [avatar, setAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const progressValue = useRef(new Animated.Value(0)).current;

  // Animate progress bar to full on component mount
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);
  

  

  const handleImageSelection = (imageUri) => {
    setIsUploading(true);

    setTimeout(() => {
      setAvatar(imageUri);
      setIsUploading(false);
    }, 1500);
  };

  const handleTakePhoto = async () => {
    const image = await takePhoto();
    if (image.success) {
      setIsUploading(true)
      const uploadedImage = await uploadImage(image, null, (percent) => { });
      if (uploadedImage.success) {
        handleImageSelection(uploadedImage.url);
        setIsUploading(false);
      }
    }
  };

  const handlePickImage = async () => {
    const image = await selectImage();
    if (image.success) {
      setIsUploading(true)
      const uploadedImage = await uploadImage(image, null, (percent) => {});
      if (uploadedImage.success) {
        handleImageSelection(uploadedImage.url);
        setIsUploading(false);
        console.log("Image URL:",uploadedImage.url);
      }
    }
  };



  const handleSignup = async () => {
    if (!avatar) {
      Alert.alert(
        "Profile Picture Required",
        "Please select a profile picture or choose a default avatar."
      );
      return;
    }

    setIsProcessing(true);

    try {
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        address: address || "",
        phoneNumber: phoneNumber || "",
        profilePic: avatar,
      };

      console.log("Submitting user data:", {
        ...userData,
        password: "[HIDDEN]",
      });

      // Call signup function from AuthContext
      await signup(userData);

      // After successful signup, redirect to main application
      router.replace("../../(main)/(tabs)/Home");
    } catch (error) {
      console.error("Error during signup:", error);

      // Display appropriate error message based on the error code
      let errorMessage =
        "There was an error creating your account. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use a different email or sign in.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "The password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.stepIndicator}>Step 3 of 3</Text>
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

        <Text style={styles.title}>Profile Picture</Text>
        <Text style={styles.subtitle}>
          Add a photo to personalize your account
        </Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color="#6055D8" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            ) : avatar ? (
              <>
                <Image
                  source={typeof avatar === "string" ? { uri: avatar } : avatar}
                  style={styles.avatar}
                />
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="person" size={60} color="#ccc" />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.cameraButton]}
            onPress={handleTakePhoto}
          >
            <Ionicons name="camera" size={24} color="#6055D8" />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.galleryButton]}
            onPress={handlePickImage}
          >
            <Ionicons name="images" size={24} color="#6055D8" />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          
        </View>

        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={22} color="#6055D8" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.finishButton, !avatar && styles.disabledButton]}
            onPress={handleSignup}
            disabled={!avatar || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.finishButtonText}>Finish</Text>
                <Ionicons name="checkmark" size={22} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
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
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6055D8",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#999",
    fontSize: 14,
  },
  uploadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadingText: {
    marginTop: 8,
    color: "#6055D8",
    fontSize: 14,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
  },
  cameraButton: {
    backgroundColor: "#F0F0FF",
  },
  galleryButton: {
    backgroundColor: "#F0F8FF",
  },
  defaultButton: {
    backgroundColor: "#F5F0FF",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#444",
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#6055D8",
    fontWeight: "500",
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6055D8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  avatarGrid: {
    padding: 15,
  },
  avatarOption: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    margin: 5,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  selectedAvatarOption: {
    borderColor: "#6055D8",
    borderWidth: 3,
  },
  avatarOptionImage: {
    width: "100%",
    height: "100%",
    borderRadius: AVATAR_SIZE / 2,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectButton: {
    backgroundColor: "#6055D8",
    marginHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Step3;
