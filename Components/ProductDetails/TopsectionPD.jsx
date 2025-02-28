import React from "react";
import { Text, View ,StyleSheet,Image,Pressable,StatusBar} from "react-native";
export default function TopsectionPD(props) {
  return (
        <View style={styles.container}>
          <Text>topsection</Text>
        </View>
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
