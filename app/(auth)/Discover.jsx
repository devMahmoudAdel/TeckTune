import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
const { height } = Dimensions.get("window");
import { useAuth } from "../../context/useAuth";

export default function SignIn({ navigation }) {
    
  const { enterGuestMode } = useAuth();
  const handleSkip = () => {
    enterGuestMode();
    router.replace("../(main)/(tabs)/Home");
  };
  const router = useRouter();
  return (
    <>
      <StatusBar barStyle="dark-content" hidden={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <ImageBackground
            style={styles.image}
            resizeMode="contain"
            source={require("../../assets/discover.png")}
          />
        </View>
        <View style={styles.discoverContainer}>
          <Text style={styles.discoverText1}>
            Discover top deals{"\n"}and trending products!
          </Text>
          <Text style={styles.discoverText2}>
            Find the best offers and latest trends,{"\n"}all in one place!
          </Text>
        </View>
        <View style={styles.containerButtons}>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => router.push("/(auth)/SignIn")}
          >
            <Text style={styles.textButtonLogin}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={() => router.push("/(auth)/signUp/Step1")}
          >
            <Text style={styles.textButtonRegister}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center", // فقط تمركز أفقي
    paddingBottom: 20,
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
  imageContainer: {
    width: "100%",
    height: height / 2.5,
    marginTop: 60,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discoverContainer: {
    paddingTop: 30,
    alignItems: "center",
  },
  discoverText1: {
    fontSize: 30,
    color: "#2f2baa",
    textAlign: "center",
    fontFamily: "bold",
  },
  discoverText2: {
    fontSize: 17,
    textAlign: "center",
    color: "#333",
    marginTop: 15,
  },
  containerButtons: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  buttonLogin: {
    backgroundColor: "#2f2baa",
    width: "45%",
    borderRadius: 10,
    shadowColor: "#9d9aff",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
  },
  textButtonLogin: {
    fontFamily: "bold",
    fontSize: 20,
    color: "white",
    paddingVertical: 12,
    textAlign: "center",
  },
  buttonRegister: {
    backgroundColor: "#f0f0f0",
    width: "45%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2f2baa",
  },
  textButtonRegister: {
    fontFamily: "regular",
    fontSize: 20,
    color: "#2f2baa",
    paddingVertical: 12,
    textAlign: "center",
  },
});
