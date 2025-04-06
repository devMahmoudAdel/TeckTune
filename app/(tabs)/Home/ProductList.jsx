import { Text, View, FlatList, Pressable, RefreshControl, Platform, StatusBar } from "react-native";
import Product from "../../../Components/Product";
import products from "../../../Components/data";
import { useEffect ,useState  } from "react";
import { useRouter, Link } from "expo-router";
export default function ProductList({ filterSearch }) {
  const [filteredProducts , setFilteredProducts] = useState([])
const navigation = useRouter();
  useEffect(() => {
    if(filterSearch.trim()){
      setFilteredProducts(products.filter((e) => e.title.toLowerCase().includes(filterSearch.toLowerCase())))
    }
    else {
      setFilteredProducts(products);
    }
  },[filterSearch])
  const containerStyle = Platform.OS === 'web' 
  ? { height: '100vh', overflowY: 'auto' } 
  : {}; 
  // ---------------------------------------
  
  return (
    <View
      style={[
        containerStyle,
        {
          paddingTop: StatusBar.currentHeight + 10,
          flex: 1,
          paddingBottom: 55,
        },
      ]}
    >
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
