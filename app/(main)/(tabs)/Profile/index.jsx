import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import ProfileTags from "../../../../Components/ProfileTags";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import LogoutButton from "../../../../Components/Auth/LogoutButton";
import { useAuth } from "../../../../context/useAuth";

const screen = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const { user, guest } = useAuth();
  const scrollViewProps =
    Platform.OS === "web"
      ? { style: { maxHeight: "100vh", overflowY: "auto" } }
      : {};

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: screen.height * 0.05 }}
      {...scrollViewProps}
    >
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {user.profilePic ? (
            <Image
              source={{ uri: user.profilePic }}
              style={styles.imageProfile}
            />
          ) : (
            <Ionicons
              name="person"
              size={screen.width * 0.2}
              color="black"
              style={styles.imageProfile}
            />
          )}
          <Text style={styles.userText}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            guest
              ? router.push("/restricted-modal")
              : router.navigate("/(tabs)/Profile/MyProfile")
          }
        >
          <ProfileTags name="Profile" image={"person"} />
        </TouchableOpacity>
        {user?.role === "admin" && (
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/Profile/Dashboard")}
          >
            <ProfileTags name="Dashboard" image={"apps"} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/Profile/Settings")}
        >
          <ProfileTags name="My Orders" image={"cart"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/Profile/About")}
        >
          <ProfileTags name="About" image={"information-circle-sharp"} />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <ProfileTags name="Share App" image={"share-social-sharp"} />
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/Profile/Help")}
        >
          <ProfileTags name="Help" image={"help-circle-sharp"} />
        </TouchableOpacity> */}
        <LogoutButton />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: screen.width * 0.05,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: screen.height * 0.03,
  },
  imageProfile: {
    width: screen.width * 0.25,
    height: screen.width * 0.25,
    borderRadius: screen.width * 0.125,
  },
  userText: {
    fontSize: screen.width * 0.06,
    fontWeight: "bold",
    marginTop: screen.height * 0.01,
  },
  emailText: {
    fontSize: screen.width * 0.045,
    color: "gray",
    marginTop: screen.height * 0.005,
  },
});
