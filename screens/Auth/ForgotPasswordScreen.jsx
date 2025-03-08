import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, TextInput } from "react-native";
const { height } = Dimensions.get("window");
export default function ForgotPassword({ navigation }) {
  return (
    <SafeAreaView>
      <View style={{ paddingTop: height / 2.8 }}>
        <Text style={styles.textTitle}>Reset Your Password</Text>
        <Text style={styles.textsubTitle}>
          Enter your email to receivereset instructions.
        </Text>
      </View>
      <View style={styles.inputGroup}>
        <TextInput style={styles.input} placeholder="Enter your Email" />
      </View>
      <TouchableOpacity style={styles.buttonSend}>
        <Text style={styles.textButtonSend}>Send</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2f2baa",
    textAlign: "center",
  },
  textsubTitle: {
    fontSize: 18,
    marginTop: 12,
    fontWeight: "regular",
    color: "text",
    textAlign: "center",
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  inputGroup: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  buttonSend: {
    // paddi: 20,
    padding: 20,
    marginVertical: 30,
    backgroundColor: "#2f2baa",
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#9d9aff",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
  },
  textButtonSend: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
