import { StyleSheet, View, Text, Pressable, Dimensions, TouchableOpacity } from "react-native";
import react from "react";
import { ImageBackground, SafeAreaView } from "react-native-web";
const {height} = Dimensions.get("window");

export default function SignIn({ navigation }) {
  return (
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //   <Text style={{ color: "b lack", fontSize: 30 }}>Sign In Screeen</Text>
    //   <Pressable onPress={() => navigation.navigate("Sign Up")}>
    //     <Text>go to sign up </Text>
    //   </Pressable>
    //   <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
    //     <Text>Forgot your password ? </Text>
    //   </Pressable>
    // </View>

    <SafeAreaView>
      <View>
        <ImageBackground 
        style={styles.image}
        resizeMode="contain"
        source = {require("../../assets/discover.png")}
        />
      </View>
      <View style={styles.discoverContainer}>
        <Text style={styles.discoverText1}>Discover top deals{'\n'}and trending products!</Text>
        <Text style={styles.discoverText2}>Find the best offersand latest trends,{'\n'}all in one place!</Text>
      </View>
      <View style={styles.containerBouttons}>
        <TouchableOpacity style={styles.bouttonLogin} onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.textButtonLogin}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouttonRegister} onPress={() => navigation.navigate("Sign Up")}>
          <Text style={styles.textButtonRegister}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image:{
    height: height/2.5,
  },
  discoverContainer:{
    paddingTop: 30 
    
  },
  discoverText1:{
    fontSize: 40,
    color: "#2f2baa",
    textAlign:"center",
    fontWeight: "bold"
    
  },

  discoverText2: {
    fontSize: 18,
    textAlign: "center",
    color: "text",
    marginTop: 30,
    fontWeight: "regular",
    // letterSpacing: 2, 
  },

  containerBouttons:{
    paddingHorizontal: 30,
    paddingVertical:15,
    flexDirection: "row"
  },

  bouttonLogin:{
    backgroundColor: "#2f2baa",
    marginTop:75,
    width: "45%",
    borderRadius: 10,
    shadowColor: "#9d9aff",
    shadowOffset:{width:0, height:8},
    shadowRadius: 10
    
  },
  textButtonLogin:{
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    paddingVertical:12,
    textAlign: "center"
  },

  bouttonRegister:{
    marginTop:75,
    width: "45%",
    borderRadius: 10
    
  },
  textButtonRegister:{
    fontWeight: "regular",
    paddingVertical:12,
    fontSize: 24,
    color: "text",
    textAlign: "center"
  }

});
