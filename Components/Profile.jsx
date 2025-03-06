import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import ProfileTags from "./ProfileTags";
import Ionicons from "@expo/vector-icons/Ionicons";

import LogoutButton from "./Auth/LogoutButton";

export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Indexes navigation={navigation} /> */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        {/* <Image
          source={require("../assets/icon.png")}
          style={styles.imageProfile}
        /> */}
        <Ionicons
          name="person"
          size={100}
          color="black"
          style={styles.imageProfile}
        />
        <Text style={styles.userText}>User Name</Text>
        <Text style={styles.emailText}>user-email@email.com</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("MyProfile")}>
        <ProfileTags name="Profile" image={"person"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <ProfileTags name="Settings" image={"settings-sharp"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <ProfileTags name="About" image={"information-circle-sharp"} />
      </TouchableOpacity>
      <TouchableOpacity>
        <ProfileTags name="Share App" image={"share-social-sharp"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Help")}>
        <ProfileTags name="Help" image={"help-circle-sharp"} />
      </TouchableOpacity>
      <LogoutButton/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageProfile: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  emailText: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },
});
