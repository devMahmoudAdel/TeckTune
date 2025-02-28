import React from "react";
import { Text, View ,StyleSheet,Image,Pressable,StatusBar} from "react-native";
import TopsectionPD from "./topsectionPD";
import BottomsectionPD from "./bottomsectionPD";
export default function ProductDetails(props) {
  const { navigation} = props;
  const { title ,price,images,rating,colors} = props.route.params;
  return (

    <View style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
      <TopsectionPD title={title} images={images} rating={rating} price={price} colors={colors}
        style={styles.topsection} />
      <BottomsectionPD title={title} images={images} rating={rating} price={price} colors={colors}
        style={styles.bottomsection} />
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
  topsection: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomsection: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});