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
import ProductList from "./ProductList";
import Search from "../../../../Components/Search";
import { useState, useEffect, useMemo } from "react";
import notifications from "../../../../Components/notifictionsdata";
import { useAuth } from "../../../../context/useAuth";
// import products from "../../../../Components/data";
import { Link, useRouter } from "expo-router";
import Product from "../../../../Components/Product";
import { getAllProducts } from "../../../../firebase/Product";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const router = useRouter();

  const topProducts = useMemo(() => {
    return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return topProducts;
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allProducts, topProducts]);

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
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Loading...</Text>
      </View>
    );
  }
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
            <Text style={styles.userNameText}>
              {useAuth().user.firstName
                ? useAuth().user.firstName + "!"
                : "Guest!"}
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

      {/* Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={notifications
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .slice(0, 5)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.notificationCard}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationDescription}>
                    {item.description}
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Search */}
      <Search setFilter={setSearchQuery} />
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
          onPress={() => router.push("/(main)/(tabs)/Home/ProductList")}
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
      {/* Top 10 Products */}
      <View style={{ flex: 1 }}>
        {/* <ProductList filterSearch={filterSearch} /> */}
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
                id={item.id}
                title={item.title}
                price={item.price}
                images={item.images}
                rating={item.rating}
                colors={item.colors}
              />
            </Link>
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
});
