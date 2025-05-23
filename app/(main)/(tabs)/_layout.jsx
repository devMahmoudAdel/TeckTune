import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: "#ffffff",
    height: 50,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    paddingVertical: "auto",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
};

export default function MainAppNavigator() {

  return (
    <Tabs screenOptions={screenOptions} initialRouteName="Home">
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <AntDesign
                name="home"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialIcons
                name="favorite-border"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <AntDesign
                name="shoppingcart"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                name="person"
                size={focused ? 25 : 22}
                color={focused ? "#6055D8" : "black"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
