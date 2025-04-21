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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../../context/useAuth";
import { getUser, createUser } from "../../../../firebase/User";
import { auth } from "../../../../firebase/config";
const MyProfile = () => {
  const router = useRouter();
  const { user, deleteAccount } = useAuth();
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phoneNumber);
  const [address, setAddress] = useState(user.address);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserData(await getUser(user.id));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userData]);
  const handleFirstName = (text) => {
    setFirstName(text);
    handleChanged();
  };
  const handleLastName = (text) => {
    setLastName(text);
    handleChanged();
  };
  const handleUsername = (text) => {
    setUsername(text);
    handleChanged();
  };
  const handleEmail = (text) => {
    setEmail(text);
    handleChanged();
  };
  const handlePhone = (text) => {
    setPhone(text);
    handleChanged();
  };
  const handleAddress = (text) => {
    setAddress(text);
    handleChanged();
  };
  const handleProfilePic = (text) => {
    setProfilePic(text);
    handleChanged();
  };
  const handleCurrentPassword = (text) => {
    setCurrentPassword(text);
    handleChanged();
  };
  const handleNewPassword = (text) => {
    setNewPassword(text);
    handleChanged();
  };
  const handleConfirmPassword = (text) => {
    setConfirmPassword(text);
    handleChanged();
  };
  function handleChanged() {
    if (
      firstName !== user.firstName ||
      lastName !== user.lastName ||
      username !== user.username ||
      email !== user.email ||
      phone !== user.phoneNumber ||
      address !== user.address ||
      profilePic !== user.profilePic ||
      currentPassword !== "" ||
      newPassword !== "" ||
      confirmPassword !== ""
    ) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }
  const handleSave = () => {
    createUser(useAuth().user.id, {
      firstName,
      lastName,
      username,
      email,
      phoneNumber: phone,
      address,
      profilePic,
    });
  };

  const handleDeleteAccount = () => {
    // For native platforms, show an alert
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
      // For web, use confirm dialog
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
        <Image
          source={require("../../../../assets/icon.png")}
          style={styles.imageProfile}
        />
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            placeholder="first name"
            style={styles.input}
            value={firstName}
            onChangeText={handleFirstName}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChangeText={handleLastName}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={handleUsername}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={handleEmail}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            placeholder="Phone"
            style={styles.input}
            value={phone}
            onChangeText={handlePhone}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={address}
            onChangeText={handleAddress}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            placeholder="Current Password"
            style={styles.input}
            value={currentPassword}
            onChangeText={handleCurrentPassword}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            placeholder="New Password"
            style={styles.input}
            value={newPassword}
            onChangeText={handleNewPassword}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChangeText={handleConfirmPassword}
          />
        </View>

        {changed && (
          <Pressable style={styles.btn}>
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
    marginBottom: 70,
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
});
export default MyProfile;
