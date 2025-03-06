import { Text, View, FlatList, Pressable, RefreshControl, Platform } from "react-native";
import Product from "./Product";

export default function ProductList({ navigation }) {
  const products = [
    {
      title: "Product 1",
      price: 100,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 3,
      description:
        "This is a product description for product 1 with a rating of 3 stars. It is a high-quality product that meets all your needs and expectations. You will love using this product every day.",
      colors: ["red", "blue", "green"],
    },
    {
      title: "Product 2",
      price: 200,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 4,
      description:
        "This is a product description for product 2 with a rating of 4 stars. It offers great value for money and is designed to provide excellent performance. A must-have for everyone.",
      colors: ["yellow", "purple", "orange"],
    },
    {
      title: "Product 3",
      price: 300,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 5,
      description:
        "This is a product description for product 3 with a rating of 5 stars. It is the best in its category, offering unmatched quality and reliability. You won't be disappointed with this purchase.",
      colors: ["pink", "brown", "black"],
    },
    {
      title: "Product 4",
      price: 400,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 3,
      description:
        "This is a product description for product 4 with a rating of 3 stars. It is a solid choice for those looking for a balance between quality and affordability. A reliable product for everyday use.",
      colors: ["white", "gray", "cyan"],
    },
    {
      title: "Product 5",
      price: 500,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 4,
      description:
        "This is a product description for product 5 with a rating of 4 stars. It combines excellent features with a reasonable price, making it a popular choice among customers. Highly recommended.",
      colors: ["magenta", "lime", "teal"],
    },
    {
      title: "Product 6",
      price: 600,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 5,
      description:
        "This is a product description for product 6 with a rating of 5 stars. It stands out for its superior quality and performance. You will be impressed by its durability and functionality.",
      colors: ["navy", "olive", "maroon"],
    },
    {
      title: "Product 7",
      price: 700,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 3,
      description:
        "This is a product description for product 7 with a rating of 3 stars. It offers good value for money and is suitable for a wide range of applications. A dependable product you can trust.",
      colors: ["gold", "silver", "bronze"],
    },
    {
      title: "Product 8",
      price: 800,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 4,
      description:
        "This is a product description for product 8 with a rating of 4 stars. It is known for its excellent performance and reliability. A great choice for those who want quality without breaking the bank.",
      colors: ["coral", "salmon", "khaki"],
    },
    {
      title: "Product 9",
      price: 900,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 5,
      description:
        "This is a product description for product 9 with a rating of 5 stars. It is the top choice for discerning customers who demand the best. You will be delighted with its exceptional features.",
      colors: ["plum", "orchid", "lavender"],
    },
    {
      title: "Product 10",
      price: 1000,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 3,
      description:
        "This is a product description for product 10 with a rating of 3 stars. It is a reliable and affordable option that meets your basic needs. A practical product that delivers consistent performance.",
      colors: ["beige", "ivory", "mint"],
    },
    {
      title: "Product 11",
      price: 1100,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 4,
      description:
        "This is a product description for product 11 with a rating of 4 stars. It offers a great balance of quality and price, making it a popular choice among customers. You will appreciate its value.",
      colors: ["peach", "apricot", "honeydew"],
    },
    {
      title: "Product 12",
      price: 1200,
      images: [
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
        require("../assets/icon.png"),
      ],
      rating: 5,
      description:
        "This is a product description for product 12 with a rating of 5 stars. It is the ultimate choice for those who want the best. You will be amazed by its outstanding performance and quality.",
      colors: ["azure", "indigo", "violet"],
    },
  ];

  // specific platform :-
  // used to handle the scroll in the web bundler
  // ---> as i get no scrolling without it,
  // not important to you to understand. 
  const containerStyle = Platform.OS === 'web' 
  ? { height: '100vh', overflowY: 'auto' } 
  : {}; 
  // ---------------------------------------
  
  return (
    <View style = {containerStyle}> 
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
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate("ProductDetails", item)}>
          <Product
            title={item.title}
            price={item.price}
            images={item.images}
            rating={item.rating}
            colors={item.colors}
            navigation={navigation}
          />
        </Pressable>
      )}
    />
    </View>
  );
}
