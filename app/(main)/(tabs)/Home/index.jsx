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
import { StatusBar } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const router = useRouter();

  const topProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [allProducts]);

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
    if (!keywords.length) return topProducts;

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
  }, [searchQuery, allProducts, topProducts]);

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
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={filteredProducts}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2f2baa"]}
            tintColor="#2f2baa"
          />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.userContainer}>
                {user.profilePic ? (
                  <Image
                    source={{ uri: user.profilePic }}
                    style={styles.profilePic}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={40}
                    color="black"
                    style={styles.imageProfile}
                  />
                )}
                <View>
                  <Text style={styles.helloText}>Hello!</Text>
                  <Text style={styles.userNameText}>
                    {user.firstName ? user.firstName + "!" : "Guest!"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color="black"
                  style={styles.notificationIcon}
                />
              </TouchableOpacity>
            </View>

            <Notifications
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />

            <Search setFilter={setSearchQuery} />
            <Swiper />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 15,
                marginVertical: 10,
                width: "95%",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color:"#121212" }}>
                Top Rated
              </Text>
              <Pressable
                onPress={() => router.push("/(main)/(tabs)/Home/ProductList")}
                style={{
                  backgroundColor: "#2f2baa",
                  // padding: 10,
                  borderRadius: 20,
                  height: 40,
                  justifyContent: "center",
                  width: 80,
                  margin:-5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  View All
                </Text>
              </Pressable>
            </View>
          </>
        }
        contentContainerStyle={{
          paddingBottom: 50,
          paddingHorizontal: 10,
          alignItems: "center",
        }}
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
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: StatusBar.currentHeight + 30 || 0,
  },
  header: {
    width: "100%",

    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#eeeeee",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
  },
  notificationIcon: {
    padding: 10,
    // backgroundColor: "#e5e5e5",
    borderRadius: 25,
  },
  imageProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  inputSearch: {
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  notificationCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#555",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2f2baa",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },

});
