import { Text, View, FlatList, RefreshControl, Platform, StatusBar, StyleSheet, Dimensions } from "react-native";
import Product from "../../../../Components/Product";
import Entypo from "@expo/vector-icons/Entypo";
import { useEffect, useMemo, useState } from "react";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import Search from "../../../../Components/Search";
import Loading from "../../../../Components/Loading";
import { getAllProducts } from "../../../../firebase/Product";

const { width, height } = Dimensions.get("window");

export default function ProductList() {
  const navigation = useRouter();
  const params = useLocalSearchParams();
  const filterType = params.filter || "all"; // Get filter type from params (refreshed or all)
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
        refreshed: product.refreshed || false,
        createdAt: product.createdAt || new Date(),
        updatedAt: product.updatedAt || new Date(),
        productPics: product.productPics || [],
      }));
      setAllProducts(validatedProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
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
      return query.flatMap((pred) => pred.toLowerCase().split(/\s+/)).filter(Boolean);
    }
    return query.toLowerCase().split(/\s+/).filter(Boolean);
  };

  // Filter products based on refreshed flag and search query
  const filteredProducts = useMemo(() => {
    // First filter by refreshed status based on filter type
    let productsToFilter = allProducts;
    if (filterType === "refreshed") {
      productsToFilter = allProducts.filter(product => product.refreshed);
    } else if (filterType === "regular") {
      productsToFilter = allProducts.filter(product => !product.refreshed);
    }

    // Then apply search filter
    const keywords = getKeywords(searchQuery);
    if (!keywords.length) return productsToFilter;

    return productsToFilter.filter((product) => {
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
  }, [searchQuery, allProducts, filterType]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const containerStyle = Platform.OS === "web" ? { height: "100vh", overflowY: "auto" } : {};

  if (loading) {
    return <Loading />;
  }

  return (
    <View
      style={[
        containerStyle,
        {
          paddingTop: StatusBar.currentHeight + 20,
          flex: 1,
          paddingBottom: height * 0.1,
          paddingHorizontal: width * 0.009
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
        <Text style={styles.textHeader}>
          {filterType === "refreshed" ? "Refreshed Products" : "All Products"}
        </Text>
      </View>

      <Search setFilter={setSearchQuery} />
      <FlatList
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={width > 400 ? 2 : 1}
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ margin: 5 }}>
            <Link
              href={{
                pathname: `/app/(main)/${item.id}`,
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
                id={item.id}
                title={item.title}
                price={item.price}
                images={item.images}
                rating={item.rating}
                colors={item.colors}
              />
            </Link>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    //justifyContent: "space-between",
    flexDirection: "row",
    width: "92%",
    alignItems: "center",
    marginBottom: height * 0.0018,
    paddingHorizontal: width * 0.04,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: width > 400 ? 22 : 18,
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
