import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

// import the AuthContext i.e. the Global Container.
import { AuthContext } from "../../../context/AuthContext";

// import the utility Hook.
import { useContext } from "react";

const defaultAvatars = [
  require("../../../assets/avatars/avatar1.png"),
  require("../../../assets/avatars/avatar2.png"),
  require("../../../assets/avatars/avatar3.png"),
];

const Step3 = ({ route }) => {
  const navigation = useNavigation();

  // destructure and bring to use " the signup function ".
  const { signup } = useContext(AuthContext);

  const { username, email, password, firstName, lastName, address } =
    route.params;

  const [avatar, setAvatar] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    try {
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        address,
        avatar: avatar,
        createdAt: new Date().toISOString(),
      };

      // Use the signup function from the AuthContext
      await signup(userData);
      
      // After successful signup, the AuthFlow should automatically redirect to MainAppNavigator
      // because the AuthContext's user state will be set


    } catch (error) {
      console.error('Error during signup:', error);
      // we can also Handle it -> maybe show an error message to the user
      Alert.alert('Sign Up Failed, There was an error creating your account.\nPlease try again.');
    }
  };

  const handleSkip = () => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    setAvatar(defaultAvatars[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Profile Picture</Text>

      <View style={styles.imageContainer}>
        {avatar ? (
          <Image
            source={typeof avatar === "string" ? { uri: avatar } : avatar}
            style={styles.avatar}
          />
        ) : (
          <Text style={styles.placeholder}>No Image Selected</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.skipButton]}
        onPress={handleSkip}
      >
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        disabled={!avatar}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholder: {
    color: "#888",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginVertical: 5,
  },
  skipButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Step3;
