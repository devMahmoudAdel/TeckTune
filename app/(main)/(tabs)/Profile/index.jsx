import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import ProfileTags from "../../../../Components/ProfileTags";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import LogoutButton from "../../../../Components/Auth/LogoutButton";
import DashboardStack from "../../../../navigation/DashboardStack";
import { useAuth } from "../../../../context/useAuth";
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
      contentContainerStyle={{ paddingBottom: 40 }}
      {...scrollViewProps} // also for web scrolling problem
    >
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          {/* <Ionicons
            name="person"
            size={100}
            color="black"
            style={styles.imageProfile}
          /> */}
          <Image
            source={useAuth().user.avatarUri}
            defaultSource={require("../../../../assets/avatars/avatar2.png")}
            style={styles.imageProfile}
          />
          <Text style={styles.userText}>
            {useAuth().user.firstName} {useAuth().user.lastName}
          </Text>
          <Text style={styles.emailText}>{useAuth().user.email}</Text>
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
            <ProfileTags name="Dashboard" image={"person"} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/Profile/Settings")}
        >
          <ProfileTags name="Settings" image={"settings-sharp"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/Profile/About")}
        >
          <ProfileTags name="About" image={"information-circle-sharp"} />
        </TouchableOpacity>
        <TouchableOpacity>
          <ProfileTags name="Share App" image={"share-social-sharp"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/Profile/Help")}
        >
          <ProfileTags name="Help" image={"help-circle-sharp"} />
        </TouchableOpacity>
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
