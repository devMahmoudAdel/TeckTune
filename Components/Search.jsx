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
});
export default Search;
