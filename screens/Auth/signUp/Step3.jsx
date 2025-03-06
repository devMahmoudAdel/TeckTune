import React, { useState, useContext, useEffect, useRef } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = width / 4 - 20;

const defaultAvatars = [
  require("../../../assets/avatars/avatar1.png"),
  require("../../../assets/avatars/avatar2.png"),
  require("../../../assets/avatars/avatar3.png"),
  require("../../../assets/avatars/avatar4.png"),
];

const Step3 = ({ route }) => {
  const navigation = useNavigation();
  const { signup } = useContext(AuthContext);
  const randomDefaultAvatarIndex = useRef(
    Math.floor(Math.random() * defaultAvatars.length)
  );

  const {
    username = "",
    email = "",
    password = "",
    firstName = "",
    lastName = "",
    address = "",
  } = route.params || {};

  const [avatar, setAvatar] = useState(null);
  const [selectedDefaultAvatar, setSelectedDefaultAvatar] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const progressValue = useRef(new Animated.Value(0)).current;
  // Animate progress bar to full on component mount - will always stay full
  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and photo library permissions to upload a profile picture.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleImageSelection(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleImageSelection(result.assets[0].uri);
    }
  };

  const handleImageSelection = (imageUri) => {
    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setAvatar(imageUri);
      setSelectedDefaultAvatar(null);
      setIsUploading(false);
    }, 1500);
  };

  const selectDefaultAvatar = (index) => {
    setSelectedDefaultAvatar(index);
    setAvatar(defaultAvatars[index]);
    setShowAvatarModal(false);
  };

  const useRandomDefaultAvatar = () => {
    // Use the pre-generated random index from useRef
    selectDefaultAvatar(randomDefaultAvatarIndex.current);
  };

  const handleSignup = async () => {
    if (!avatar) {
      Alert.alert(
        "Profile Picture Required",
        "Please select a profile picture or choose a default avatar.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Create user data object
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        address,
        avatar: typeof avatar === "string" ? avatar : "default_avatar",
        createdAt: new Date().toISOString(),
      };

      // Call signup function from AuthContext
      await signup(userData);

      // Signup successful - AuthFlow will handle navigation to main app
    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert(
        "Signup Failed",
        "There was an error creating your account. Please try again.",
        [{ text: "OK" }]
      );
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
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
                <TouchableOpacity
                  style={styles.changeAvatarButton}
                  onPress={() => setShowAvatarModal(true)}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
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
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={24} color="#6055D8" />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.galleryButton]}
            onPress={pickImage}
          >
            <Ionicons name="images" size={24} color="#6055D8" />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.defaultButton]}
            onPress={useRandomDefaultAvatar}
          >
            <Ionicons name="person-circle" size={24} color="#6055D8" />
            <Text style={styles.optionText}>Use Default Avatar</Text>
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

      {/* Default Avatars Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Avatar</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAvatarModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={defaultAvatars}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.avatarOption,
                    selectedDefaultAvatar === index &&
                      styles.selectedAvatarOption,
                  ]}
                  onPress={() => selectDefaultAvatar(index)}
                >
                  <Image source={item} style={styles.avatarOptionImage} />
                  {selectedDefaultAvatar === index && (
                    <View style={styles.selectedOverlay}>
                      <Ionicons
                        name="checkmark-circle"
                        size={30}
                        color="#fff"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.avatarGrid}
            />

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                if (selectedDefaultAvatar !== null) {
                  setAvatar(defaultAvatars[selectedDefaultAvatar]);
                  setShowAvatarModal(false);
                } else {
                  Alert.alert("Selection Required", "Please select an avatar");
                }
              }}
            >
              <Text style={styles.selectButtonText}>Select Avatar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// This component is defined here since it's not imported from react-native
const ActivityIndicator = ({ size, color }) => (
  <View style={{ padding: 10 }}>
    <Text style={{ color }}>Loading...</Text>
  </View>
);

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
