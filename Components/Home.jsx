import { Button,ScrollView, Text, View, Image, TextInput, StyleSheet,Pressable ,FlatList,RefreshControl} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Product from "./Product";
import ProductList from "./ProductList";
import Search from "./Search";
import products from "./data";
export default function Home({ navigation }) {
  const topProducts = JSON.parse(JSON.stringify(products));
  topProducts.sort((a, b) => b.rating - a.rating);
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userContainer}>
          {/* <Image source={} /> */}
          <Ionicons
            name="person"
            size={40}
            color="black"
            style={styles.imageProfile}
          />
          <View>
            <Text style={styles.helloText}>Hello!</Text>
            <Text style={styles.userNameText}>User Name</Text>
          </View>
        </View>
        <MaterialIcons
          name="notifications-none"
          size={24}
          color="black"
          style={styles.notificationIcon}
        />
      </View>
      {/* // Search */}
      <Search/>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Top Rated</Text>
        <Pressable
          onPress={() => navigation.navigate("ProductList")}
          style={{
            backgroundColor: "#2f2baa",
            padding: 10,
            borderRadius: 20,
            height: 40,
            justifyContent: "center",
            width: 80,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>View All</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1, marginTop: 10, marginBottom: 55 }}>
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
            data={topProducts}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate("ProductDetails", item)}
              >
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eeeeee",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    
  },
  helloText: {
    fontSize: 16,
    color: "gray",
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  notificationIcon: {
    padding: 10,
    backgroundColor: "#e5e5e5",
    borderRadius: 25,
  },
  imageProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  
});
