import {
  Button,
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProductList from "./ProductList";
import Search from "../../../../Components/Search";
import { useState, useEffect, useMemo, useCallback } from "react";
import notifications from "../../../../Components/notifictionsdata";
import { useAuth } from "../../../../context/useAuth";
import products from "../../../../Components/data";
import { Link, useFocusEffect, useRouter } from "expo-router";
import Product from "../../../../Components/Product";
import { getAllProducts } from "../../../../firebase/Product";
import Loading from "../../../../Components/Loading";
import Notifications from "../../../../Components/Notifications";
import Swiper from "../../../../Components/Swiper";

const { width, height } = Dimensions.get("window");
const ITEM_MARGIN = 8; // Smaller margin for mobile
// Force 2 columns on mobile
const NUM_COLUMNS = width >= 768 ? (width >= 1200 ? 4 : 3) : 2;
// Simplified width calculation
const ITEM_WIDTH = (width - (ITEM_MARGIN * 3)) / 2; // Always 2 columns on mobile

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const router = useRouter();

  // Split products into regular and refreshed
  const regularProducts = useMemo(() => {
    return allProducts.filter(product => !product.refreshed);
  }, [allProducts]);

  const refreshedProducts = useMemo(() => {
    return allProducts.filter(product => product.refreshed);
  }, [allProducts]);

  const topRegularProducts = useMemo(() => {
    // Get top-rated regular products
    const maxProducts = NUM_COLUMNS * 2; // Show 2 rows of products based on number of columns
    return [...regularProducts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, maxProducts);
  }, [regularProducts, NUM_COLUMNS]);

  const getKeywords = (query) => {
    if (Array.isArray(query)) {
      return query
        .flatMap((pred) => pred.toLowerCase().split(/\s+/))
        .filter(Boolean);
    }
    return query.toLowerCase().split(/\s+/).filter(Boolean);
  };

  const filteredProducts = useMemo(() => {
    const keywords = getKeywords(searchQuery);
    if (!keywords.length) return regularProducts;

    return regularProducts.filter((product) => {
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
  }, [searchQuery, regularProducts]);

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
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2f2baa"]}
          tintColor="#2f2baa"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userContainer}>
          {user && user.profilePic ? (
            <Image
              source={{ uri: user.profilePic }}
              style={styles.profilePic}
            />
          ) : (
            <Ionicons
              name="person"
              size={width * 0.085}
              color="#555"
              style={styles.imageProfile}
            />
          )}
          <View>
            <Text style={styles.helloText}>Welcome back,</Text>
            <Text
              style={styles.userNameText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {user && user.firstName ? user.firstName : "Guest"}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.notificationIconContainer}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="#333"
            />
          </View>
        </TouchableOpacity>
      </View>

      <Notifications
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <Search setFilter={setSearchQuery} />
      <Swiper />

      {/* SECTION 1: Regular Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Products</Text>
          <Pressable
            onPress={() => router.push({
              pathname: "/(main)/(tabs)/Home/ProductList",
              params: { filter: "regular" }
            })}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All {regularProducts.length}</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#2f2baa" />
          </Pressable>
        </View>

        {regularProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {topRegularProducts.map((item, index) => (
              <View key={item.id} style={styles.productItem}>
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
                  <View style={styles.productCard}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.images[0] }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.productContent}>
                      <Text style={styles.productTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <View style={styles.productDetails}>
                        <Text style={styles.productPrice}>
                          ${item.price.toFixed(2)}
                        </Text>
                        <View style={styles.ratingContainer}>
                          <MaterialIcons
                            name="star"
                            size={14}
                            color="#FFD700"
                          />
                          <Text style={styles.ratingText}>
                            {item.rating > 0 ? item.rating.toFixed(1) : "0"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Link>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No regular products found</Text>
          </View>
        )}
      </View>

      {/* SECTION 2: Refreshed Products */}
      {refreshedProducts.length > 0 && (
        <View style={styles.refreshedSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.refreshedLabelContainer}>
              <MaterialIcons name="autorenew" size={20} color="#fff" style={styles.refreshIcon} />
              <Text style={styles.refreshedSectionTitle}>Refreshed Products</Text>
            </View>
            <Pressable
              onPress={() => router.push({
                pathname: "/(main)/(tabs)/Home/ProductList",
                params: { filter: "refreshed" }
              })}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All {refreshedProducts.length}</Text>
              <MaterialIcons name="arrow-forward-ios" size={14} color="#2f2baa" />
            </Pressable>
          </View>

          <View style={styles.refreshedList}>
            {refreshedProducts.slice(0, 3).map((item, index) => (
              <View
                key={`refreshed-${item.id}`}
                style={styles.refreshedItem}
              >
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
                  <View style={styles.refreshedCard}>
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.refreshedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.refreshedContent}>
                      <Text style={styles.refreshedProductTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.refreshedProductPrice}>
                        ${item.price.toFixed(2)}
                      </Text>
                      <View style={styles.refreshedProductRating}>
                        <MaterialIcons
                          name="star"
                          size={16}
                          color={item.rating > 0 ? "#FFD700" : "#D3D3D3"}
                        />
                        <Text style={styles.ratingText}>
                          {item.rating > 0 ? item.rating.toFixed(1) : "No rating"}
                        </Text>
                      </View>
                      <View style={styles.refreshBadge}>
                        <Text style={styles.refreshBadgeText}>Refreshed</Text>
                      </View>
                    </View>
                  </View>
                </Link>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: (StatusBar.currentHeight || 20) + 5,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  imageProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  helloText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    width: width * 0.4,
  },
  notificationIconContainer: {
    backgroundColor: "#f0f0f0",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  refreshedSection: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingBottom: 30,
    marginHorizontal: 16,
    marginBottom: 30,
    backgroundColor: "#f5f7ff",
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  refreshedLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshIcon: {
    backgroundColor: "#2f2baa",
    padding: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  refreshedSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    color: "#2f2baa",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 5,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  productItem: {
    width: "48%",
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    height: 230,
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#f9f9f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productContent: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    height: 36,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    //one
    //two 
    alignItems: "center",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2f2baa",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 3,
    fontWeight: "500",
  },
  refreshedList: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  refreshedItem: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  refreshedCard: {
    flexDirection: "row",
    width: "100%",
    height: 130,
  },
  refreshedImage: {
    width: 130,
    height: "100%",
  },
  refreshedContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  refreshedProductTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  refreshedProductPrice: {
    fontSize: 17,
    color: "#2f2baa",
    fontWeight: "bold",
    marginBottom: 6,
  },
  refreshedProductRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  refreshBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#2f2baa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  refreshBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
