import { Text, View, StyleSheet, Pressable, ScrollView, Image,StatusBar, Alert} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import CartItems from "../../../Components/CartItems";
import { useRouter } from "expo-router";
import { useState } from "react";
import { deleteAll } from "../../../firebase/Cart";
import { useAuth } from "../../../context/useAuth";
import Empty from "../../../Components/Empty";
export default function Cart() {
  const [deleting, setDeleting] = useState(false);
  const { guest } = useAuth();
  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteAll();
      Alert.alert("Success", "All products removed from cart");
    } catch (error) {
      Alert.alert("Error", "Failed to delete all products from cart");
    }
    setDeleting(false);
  }
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { marginTop: StatusBar.currentHeight + 20 }]}
      >
        <Entypo
          name="chevron-left"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text style={styles.textHeader}>Cart</Text>

        {/* for delete all product */}
        { !guest && <Entypo name="eraser" size={21} color="black" onPress={() => handleDeleteAll()} />}
      </View>
      <View style={[styles.container,{justifyContent:"center"}]}>
      {guest ? <Empty text="Guest User" subText="Login to see your cart"/> : <CartItems/>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
    
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "92%",
    alignItems: "center",
    marginBottom: 18,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 20,
  },
});