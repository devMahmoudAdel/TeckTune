import React from 'react';
import { View, Text,Pressable, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const ProfileTags = ({name,image}) => {
  return (
    <View style={styles.container}>
      <View style={styles.secContainer}>
        <Ionicons name={image} size={24} color="white" style={{ marginLeft: 10 }} />
        <Text style={styles.text}>{name}</Text>
      </View>
      <MaterialIcons
        name="navigate-next"
        size={24}
        color="white"
        style={{ marginRight: 10 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    height: 55,
    backgroundColor: "#6055D8",
    margin: 5,
    borderRadius: 25,
    width: 300,
  },
  secContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
});
export default ProfileTags;
