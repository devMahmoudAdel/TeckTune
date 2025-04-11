import { Text, View, FlatList, Pressable, RefreshControl, Platform, StatusBar, StyleSheet } from "react-native";
import Product from "../../../../Components/Product";
import Entypo from "@expo/vector-icons/Entypo";
// import products from "../../../../Components/data";
import { useEffect ,useState  } from "react";
import { useRouter, Link } from "expo-router";
import Search from "../../../../Components/Search";

import { getAllProducts } from "../../../../firebase/Product";

// const fetchProducts = async () => {
//   try {
//     const productsData = await getAllProducts();
//     setProducts(productsData);
//     console.log("Products:", productsData);
//   } catch (err) {
//     setError("Failed to load products. Please try again.");
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };

export default function ProductList() {
  const navigation = useRouter();
  // const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        const validatedProducts = productsData.map((product) => ({
          id: product.id || Math.random().toString(36).substring(7),
          title: product.title || "Untitled Product",
          price: product.price || 0,
          images: product.images || [],
          rating: product.rating || 0,
          colors: product.colors || [],
          description: product.description || "",
          reviews: product.reviews || [],
          stock: product.stock || 0,
          category: product.category || "Uncategorized",
          createdAt: product.createdAt || new Date(),
          updatedAt: product.updatedAt || new Date(),
          productPics: product.productPics || [],
        }));
        setAllProducts(validatedProducts);
        console.log("Products:", productsData);
        console.log("All Products:", allProducts);
        console.log("Filtered Products:", filteredProducts);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [searchQuery, allProducts]);
  const containerStyle = Platform.OS === 'web' 
  ? { height: '100vh', overflowY: 'auto' } 
  : {}; 
  // ---------------------------------------
  if (loading) {
    return (

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Loading...</Text>
      </View>
    );
  }
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
        keyExtractor={(item) => item.id}
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
              description={item.description}
              id ={item.id}

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
