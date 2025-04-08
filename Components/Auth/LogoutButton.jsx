import React, { useContext } from "react";
import { TouchableOpacity, Pressable, Text, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";

import { useRouter } from "expo-router";

import ProfileTags from "../ProfileTags";

const LogoutButton = () => {
  
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  
  const onPress = () => {
    logout;
    router.replace("../../../../(auth)/SignIn");
  };
  
  return (
    <TouchableOpacity onPress={onPress}>
      <ProfileTags name="Log Out" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LogoutButton;
