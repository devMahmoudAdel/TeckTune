import { StyleSheet, View, Text, Pressable } from "react-native";

export default function SignIn({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "black", fontSize: 30 }}>Sign In Screeen</Text>
      <Pressable onPress={() => navigation.navigate("SignUp")}>
        <Text>go to sign up </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
        <Text>Forgot your password ? </Text>
      </Pressable>
    </View>
  );
}
