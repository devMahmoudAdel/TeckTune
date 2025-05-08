import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const Search = ({setFilter}) => {

  
  return (
    <View style={styles.searchContainer}>
      <MaterialIcons name="search" size={24} color="grey" />
      <TextInput placeholder="Search"
       style={styles.inputSearch}
       onChangeText={(value) => setFilter(value)} />
    </View>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    width: "85%",
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 35,
    shadowColor: "#2e2a9d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  inputSearch: {
    fontSize: 16,
    marginLeft: 10,
    width: "90%",
    color: "#212121",
    fontFamily: "Poppins",
    fontWeight: "500",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
export default Search;
