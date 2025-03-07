import { StyleSheet, View, Text, Pressable } from "react-native";

export default function ForgotPassword({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "black", fontSize: 30 }}>
        Forgot Password Screen
      </Text>
      <Pressable onPress={() => navigation.goBack()}>
        <Text>Go to Sign In</Text>
      </Pressable>
    </View>
  );
}
