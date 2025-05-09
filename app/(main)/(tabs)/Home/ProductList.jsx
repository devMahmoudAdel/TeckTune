import { Text, View, FlatList, RefreshControl, Platform, StatusBar, StyleSheet } from "react-native";
import Product from "../../../../Components/Product";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useMemo, useState } from "react";
import { useRouter, Link } from "expo-router";
import Search from "../../../../Components/Search";
import Loading from "../../../../Components/Loading";
import { getAllProducts } from "../../../../firebase/Product";


export default function ProductList() {
  const navigation = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const router = useRouter();
  
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
      setRefreshing(false);
    }
  };

  useEffect(() => {    
    setLoading(true);
    fetchProducts();
  }, []);

  const getKeywords = (query) => {
    if (Array.isArray(query)) {
      return query
        .flatMap(pred => pred.toLowerCase().split(/\s+/))
        .filter(Boolean);
    }
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  };

  const filteredProducts = useMemo(() => {
    const keywords = getKeywords(searchQuery);
    if (!keywords.length) return allProducts;
  
    return allProducts.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
  
      return keywords.some(
        (keyword) =>
          title.includes(keyword) ||
          description.includes(keyword) ||
          category.includes(keyword)
      );
    });
  }, [searchQuery, allProducts]);

  const onRefresh = () => {
    console.log(allProducts[0].id)
    setRefreshing(true);
    fetchProducts();
  };
  const containerStyle = Platform.OS === 'web'
    ? { height: '100vh', overflowY: 'auto' }
    : {};
  // ---------------------------------------
  if (loading) {
    return (<Loading/>)
  }
  return (
    <View
      style={[
        containerStyle,
        {
          paddingTop: StatusBar.currentHeight + 20,
          flex: 1,
          paddingBottom: 55,
        },
      ]}
    >
      <View style={styles.header}>
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
        numColumns={2}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2f2baa"]}
            tintColor="#2f2baa"
          />
        }
        data={filteredProducts}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: `/${item.id}`,
              params: {
                id: item.id,
                title: item.title,
                price: item.price,
                imagess: JSON.stringify(item.images),
                rating: item.rating,
                colorss: JSON.stringify(item.colors),
                description: item.description,
                reviews: item.reviews,
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
              id={item.id}
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
