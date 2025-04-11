import { Text, View, FlatList, Pressable, RefreshControl, Platform, StatusBar, StyleSheet } from "react-native";
import Product from "../../../../Components/Product";
import Entypo from "@expo/vector-icons/Entypo";
import products from "../../../../Components/data";
import { useEffect ,useState  } from "react";
import { useRouter, Link } from "expo-router";
import Search from "../../../../Components/Search";
export default function ProductList({ filterSearch }) {
const navigation = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const router = useRouter();
  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery]);
  const containerStyle = Platform.OS === 'web' 
  ? { height: '100vh', overflowY: 'auto' } 
  : {}; 
  // ---------------------------------------
  
  return (
    <View
      style={[
        containerStyle,
        {
          paddingTop: StatusBar.currentHeight+20,
          flex: 1,
          paddingBottom: 55,
        },
      ]}
    >
      <View
        style={styles.header}
      >
        <Entypo
          name="chevron-left"
          size={30}
          color="black"
          onPress={() => router.back()}
        />
        <Text style={styles.textHeader}>All Products</Text>
      </View>

      <Search setFilter={setSearchQuery} />
      <FlatList
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} />}
        numColumns={2}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        scrollEnabled={true}
        data={filteredProducts}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: `/${item.id}`,
              params: {
                title: item.title,
                price: item.price,
                imagess: JSON.stringify(item.images),
                rating: item.rating,
                colorss: JSON.stringify(item.colors),
                description: item.description,
                reviews: item.reviews,
                id: item.id,
              },
            }}
          >
            <Product
              title={item.title}
              price={item.price}
              images={item.images}
              rating={item.rating}
              colors={item.colors}
              navigation={navigation}
            />
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "92%",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 15,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 22,
  },
});
