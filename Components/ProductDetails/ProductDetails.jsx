import React from "react";
import { Text, View ,StyleSheet,Image,Pressable,StatusBar} from "react-native";
import TopsectionPD from "./TopsectionPD";
import BottomsectionPD from "./BottomsectionPD";
export default function ProductDetails(props) {
  const { navigation} = props;
  const { title ,price,images,rating,colors,description} = props.route.params;
  return (
    <View style={[styles.container, { marginTop: StatusBar.currentHeight }]}>

      {/* <TopsectionPD title={title} images={images} rating={rating} price={price} colors={colors} description={description} style={styles.topsection} /> */}

      <TopsectionPD images={images}  style={styles.topsection} />

      <BottomsectionPD title={title} images={images} rating={rating} price={price} colors={colors} description={description} style={styles.bottomsection}/>
    </View>
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  topsection: {
    flex: 1,
    backgroundColor: "blue",
  },
  bottomsection: {
    flex: 1,
    backgroundColor: "red",
  },
});