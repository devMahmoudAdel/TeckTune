import { Text, View, StyleSheet, Pressable, ScrollView, Image,StatusBar } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import CartItems from "./CartItems";
export default function Cart({ navigation }) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { marginTop: StatusBar.currentHeight + 20 }]}
      >
        <Ionicons
          name="chevron-back-outline"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.textHeader}>Cart</Text>
        <Entypo name="dots-three-vertical" size={24} color="black" />
      </View>
      <CartItems/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});