import React from "react";
import { Text, View ,StyleSheet,Image,Pressable,StatusBar} from "react-native";
export default function ProductDetails(props) {
  const { navigation} = props;
  const { title } = props.route.params;
  return (
    <View style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
      <Text>{title}</Text>
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
