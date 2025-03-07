import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView, TextInput } from "react-native-web";

export default function ForgotPassword({ navigation }) {
  return (
    <SafeAreaView>
      <View style={{padding: 80}}>
        <Text style={styles.textTitle}>Login Now</Text>
        <Text style={styles.textsubTitle}>Welcome back you've been missed!</Text>
      </View>
      {/* <View>
        <Text>Email</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={"darkText"}
          style={styles.input}
        >
          
        </TextInput> */}
      {/* </View> */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={
            styles.input
          }
          placeholder="Enter your Email"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={
            styles.input
          }
          placeholder="Enter your Password"
        />
      </View>
      <TouchableOpacity style={{paddingHorizontal: 20}}>
          <Text style={styles.textForgot}>
            Forgot your password?
          </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSingin}>
        <Text style={styles.textButtonSingin}>
          Sigin in
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{padding: 20}} onPress={() => navigation.navigate("Sign Up")}>
        <Text style={styles.textButtonSingup}>
          Create new account
        </Text>
      </TouchableOpacity>

      <View style={{marginVertical: 20}}>
        <Text style={{color: "#2f2baa", fontSize:17, textAlign: "center"}}>
          Or continue with
        </Text>
      </View>

      <View style={styles.containerIconSignin}>
        <TouchableOpacity style={styles.iconSignin}>
          <Ionicons name="logo-google" color="text" size={20}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconSignin}>
          <Ionicons name="logo-apple" color="text" size={20}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconSignin}>
          <Ionicons name="logo-facebook" color="text" size={20}/>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textTitle:{
    fontSize:40,
    fontWeight: "bold",
    color: "#2f2baa",
    textAlign: "center"
  },
  textsubTitle:{
    fontSize:20,
    marginTop: 13,
    fontWeight: "regular",
    color: "text",
    textAlign: "center", 
    // maxWidth: "35%"
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
    marginBottom: 15,
    paddingHorizontal: 20
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textForgot:{
    fontWeight: "bold",
    fontSize: 15,
    color: "#2f2baa",
    alignSelf: "flex-end"
  },
  buttonSingin:{
    // paddi: 20,
    padding: 20,
    marginVertical: 30,
    backgroundColor: "#2f2baa",
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: "#9d9aff",
    shadowOffset:{width:0, height:8},
    shadowRadius: 10
    
  },
  textButtonSingin: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"

  },
  textButtonSingup: {
    color: "text",
    fontWeight: "regular",
    fontSize: 20,
    textAlign: "center"

  },
  containerIconSignin: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconSignin: {
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginHorizontal: 10,
    padding: 10
  }

});