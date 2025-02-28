import React from "react";
import { Text, View ,StyleSheet,Image,Pressable,StatusBar} from "react-native";
export default function ProductDetails(props) {
  const { navigation} = props;
  const { title ,price,images,rating,colors} = props.route.params;
  return (

    <View style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
      <Text>{title}wdfsdsf</Text>
      <TopsectionPD
            title={title}
            price={price}
            images={images}
            rating={rating}
            colors={colors}
            navigation={navigation}
            />
      <BottomsectionPD
            title={title}
            price={price}
            images={images}
            rating={rating}
            colors={colors}
            navigation={navigation}
            />
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
