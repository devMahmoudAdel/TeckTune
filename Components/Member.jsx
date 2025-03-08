import React from 'react';
import { View, Text, StyleSheet, Image ,Pressable} from 'react-native';

const Member = ({
  navigation,
  image,
  name,
  nickName,
  socialMedia,
  email,
  phone,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.memberName}>{name}</Text>
      <Text style={styles.memberRole}>{nickName}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2f2baa",
    borderRadius: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  memberRole: {
    fontSize: 16,
    color: "#d5d5d5",
  },
});
export default Member;
