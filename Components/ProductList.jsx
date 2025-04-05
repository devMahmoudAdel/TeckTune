import { Text, View, FlatList, Pressable, RefreshControl, Platform, StatusBar } from "react-native";
import Product from "./Product";
import products from "./data";
import Search from "./Search";
import { useEffect ,useState  } from "react";
export default function ProductList({ navigation , filterSearch }) {
  const [filteredProducts , setFilteredProducts] = useState([])

  useEffect(() => {
    if(filterSearch.trim()){
      setFilteredProducts(products.filter((e) => e.title.toLowerCase().includes(filterSearch.toLowerCase())))
    }
    else {
      setFilteredProducts(products);
    }
  },[filterSearch])
  // specific platform :-
  // used to handle the scroll in the web bundler
  // ---> as i get no scrolling without it,
  // not important to you to understand. 
  const containerStyle = Platform.OS === 'web' 
  ? { height: '100vh', overflowY: 'auto' } 
  : {}; 
  // ---------------------------------------
  
  return (
    <View style = {[containerStyle, {paddingTop: StatusBar.currentHeight+10,flex: 1,paddingBottom: 55}]}> 
    <FlatList
      keyExtractor={(item) => item.title}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={false} />}
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
      scrollEnabled={true}
      data={filteredProducts}
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
