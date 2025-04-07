import React from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
const MyProfile = () => {
  const router = useRouter();
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
          <Text style={styles.label}>Name</Text>
          <TextInput placeholder="Name" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Username</Text>
          <TextInput placeholder="Username" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Email</Text>
          <TextInput placeholder="Email" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Phone</Text>
          <TextInput placeholder="Phone" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Address</Text>
          <TextInput placeholder="Address" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput placeholder="Current Password" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>New Password</Text>
          <TextInput placeholder="New Password" style={styles.input} />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput placeholder="Confirm Password" style={styles.input} />
        </View>

        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>Save Changes</Text>
        </Pressable>
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
});
export default MyProfile;
