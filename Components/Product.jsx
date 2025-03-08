import React from 'react';
import { View, Text, Image,StyleSheet,Pressable } from 'react-native';
import ProductDetails from './ProductDetails/ProductDetails';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Stars from './Stars';
const Product = ({ title, images, rating, price, navigation }) => {
  return (

    <View style={styles.container}>
      <Image
        source={images[0]}
        style={styles.image}
        resizeMode="cover"
        defaultSource={require("../assets/icon.png")}
      />
      <Text numberOfLines={1} style={styles.productTitle}>
        {title}
      </Text>
      <View style={styles.secContainer}>
        <View style={styles.stars}>
          <Stars number={rating} />
        </View>
        <Text>({rating})</Text>
      </View>
      <Text style={styles.productPrice}>${Number(price).toFixed(2)}</Text>
      <MaterialIcons
        name="favorite-border"
        size={25}
        color={"#6055D8"}
        style={styles.favProduct}
      />
    </View>

  );
};
const styles = StyleSheet.create({
  container: {
    width: "160",
    height: "230",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    margin: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 7,
  },
  productPrice: {
    fontSize: 14,
    color: "#2f2baa",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
  },
  stars: {
    flexDirection: "row",
  },
  secContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favProduct: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default Product;
