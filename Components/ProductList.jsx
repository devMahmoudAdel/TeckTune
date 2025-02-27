import { Text, View,FlatList,Pressable,RefreshControl } from "react-native";
import Product from "./Product";
export default function ProductList({ navigation }) {
  const products = [
    {
      title: "Product 1",
      price: 100,
      image: require("../assets/icon.png"),
      rating: 3,
    },
    {
      title: "Product 2",
      price: 200,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Product 3",
      price: 300,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Product 4",
      price: 400,
      image: require("../assets/icon.png"),
      rating: 3,
    },
    {
      title: "Product 5",
      price: 500,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Product 6",
      price: 600,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Product 7",
      price: 700,
      image: require("../assets/icon.png"),
      rating: 3,
    },
    {
      title: "Product 8",
      price: 800,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Product 9",
      price: 900,
      image: require("../assets/icon.png"),
      rating: 5,
    },
    {
      title: "Product 10",
      price: 1000,
      image: require("../assets/icon.png"),
      rating: 3,
    },
    {
      title: "Product 11",
      price: 1100,
      image: require("../assets/icon.png"),
      rating: 4,
    },
    {
      title: "Product 12",
      price: 1200,
      image: require("../assets/icon.png"),
      rating: 5,
    },
  ];

  return (
    <FlatList
      keyExtractor={(item) => item.title}
      refreshControl={<RefreshControl refreshing={false} />}
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
      scrollEnabled={true}
      data={products}
      renderItem={({ item}) => (
        <Pressable onPress={() => navigation.navigate("ProductDetails", item)} >
          <Product
            title={item.title}
            price={item.price}
            image={item.image}
            rating={item.rating}
            navigation={navigation}
          />
        </Pressable>
      )}
    />
  );
}
