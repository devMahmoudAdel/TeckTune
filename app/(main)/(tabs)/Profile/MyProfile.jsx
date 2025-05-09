import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../../context/useAuth";
import { getUser, updateUser } from "../../../../firebase/User";
import {takePhoto,
  selectImage,
  uploadImage} from "../../../../supabase/loadImage";
const MyProfile = () => {
  const router = useRouter();
  const { user, deleteAccount, updateUserData } = useAuth();
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [changed, setChanged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(user.id);
        setUserData(userData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setUsername(userData.username);
        setEmail(userData.email);
        setPhone(userData.phoneNumber || "");
        setAddress(userData.address || "");
        setProfilePic(userData.profilePic || "");

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (
      firstName === userData.firstName &&
      lastName === userData.lastName &&
      username === userData.username &&
      email === userData.email &&
      phone === userData.phoneNumber &&
      address === userData.address &&
      profilePic === userData.profilePic
    ) {
      setChanged(false);
    } else {
      setChanged(true);
    }
  }, [firstName, lastName, username, email, phone, address, profilePic, userData]);

  const handleFirstName = (text) => {
    setFirstName(text);
  };
  const handleLastName = (text) => {
    setLastName(text);
  };
  const handleUsername = (text) => {
    setUsername(text);
  };
  const handleEmail = (text) => {
    setEmail(text);
  };
  const handlePhone = (text) => {
    setPhone(text);
  };
  const handleAddress = (text) => {
    setAddress(text);
  };
  const handleProfilePic = (text) => {
    setProfilePic(text);
  };
  const handleTakePhoto = async () => {
    const image = await takePhoto();
    if (image) {
      const image2 = await uploadImage(image);
      if (image2.success) {
        handleProfilePic(image2.url);
        setModalVisible(false);
      }
    }
  };
  const handleSelectImage = async () => {
    const image = await selectImage();
    if (image) {
      const image2 = await uploadImage(image);
      if (image2.success) {
        handleProfilePic(image2.url);
        setModalVisible(false);
      }
    }
  };

  const handleSave = async() => {
    try {
      await updateUser(user.id, {
        firstName,
        lastName,
        username,
        email,
        phoneNumber: phone,
        address,
        profilePic,
      });
      setUserData({
        firstName,
        lastName,
        username,
        email,
        phoneNumber: phone,
        address,
        profilePic,
      });
      await updateUserData(userData);
      Alert.alert("Success", "Profile updated successfully");
      setChanged(false);
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS !== "web") {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => confirmDeleteAccount(),
            style: "destructive",
          },
        ]
      );
    } else {
      if (
        window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        confirmDeleteAccount();
      }
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      deleteAccount();
      router.replace("../../../(auth)/SignIn");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  const scrollViewProps =
    Platform.OS === "web"
      ? { style: { maxHeight: "100vh", overflowY: "auto" } }
      : {};
  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      {...scrollViewProps}
    >
      <View style={styles.container}>
        <View
          style={[styles.header, { marginTop: StatusBar.currentHeight + 20 }]}
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color="black"
            onPress={() => router.back()}
          />
          <Text style={styles.textHeader}> Edit Profile</Text>
        </View>
        <View>
          {profilePic ? (
            <Image
            source={{ uri: profilePic }}
            style={styles.imageProfile}
          />
        ) : (
          <Image
            source={require("../../../../assets/icon.png")}
            style={styles.imageProfile}
          />
        )}
        <Pressable
              style={styles.editButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Ionicons name="camera" size={24} color="white" />
            </Pressable>
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            placeholder="first name"
            style={styles.input}
            value={firstName}
            onChangeText={(text) => handleFirstName(text)}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChangeText={(text) => handleLastName(text)}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={(text) => handleUsername(text)}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={(text) => handleEmail(text)}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            placeholder="Phone"
            keyboardType="numeric"
            style={styles.input}
            value={phone}
            onChangeText={(text) => handlePhone(text)}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={address}
            onChangeText={(text) => handleAddress(text)}
          />
        </View>
        

        {(
          <Pressable style={[styles.btn,{opacity: changed ? 1 : 0.5}]} disabled={!changed} onPress={handleSave}>
            <Text style={styles.btnText}>Save Changes</Text>
          </Pressable>
        )}

        {/* Delete Account Button */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
          <Pressable style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Text style={styles.deleteBtnText}>Delete Account</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
          <Text style={styles.modalTitle}>Profile Picture</Text>
          <Pressable
            style={styles.modalButton}
            onPress={() => {
              handleTakePhoto();
            }}
          >
            <Text style={styles.modalButtonText}>Take Photo</Text>
          </Pressable>
          <Pressable
            style={styles.modalButton}
            onPress={() => {
              handleSelectImage();
            }}
          >
            <Text style={styles.modalButtonText}>Select Image</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 24,
  },
  imageProfile: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginHorizontal: 45,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    width: "80%",
    height: 45,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: "#000",
    marginHorizontal: 20,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#6055D8",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 70,
  },
  deleteBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#6055D8",
    borderRadius: 50,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  modalButton: {
    backgroundColor: "#6055D8",
    padding: 15,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 55,
    height: 55,
    backgroundColor: "#363636",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },

});
export default MyProfile;
