import { Text, View,Image,StyleSheet,TouchableOpacity } from "react-native";
import ProfileTags from "./ProfileTags"; 
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import About from "./About";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Home from "./Home";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import Settings from "./Settings";

const Stack = createNativeStackNavigator();
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
          <Text style={styles.userText}>User Profile</Text>
          <Text style={styles.emailText}>User email</Text>
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
