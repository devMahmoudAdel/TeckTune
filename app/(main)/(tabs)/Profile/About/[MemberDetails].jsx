import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Linking, ToastAndroid } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams } from 'expo-router';
const openLink = async (url) => {
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    ToastAndroid.show("Cannot open the link", ToastAndroid.SHORT);
  }
};

const MemberDetails = () => {
  const { name, nickName, image, description, socialMediaa, email, phone } = useLocalSearchParams();
  const socialMedia = JSON.parse( socialMediaa);
  return (
    <View style={styles.container}>
      <Image
        source={image}
        defaultSource={require("../../../../../assets/icon.png")}
        style={styles.image}
      />
      <Text style={styles.memberName}>
        {name && name} (
        {nickName && <Text style={styles.memberRole}>{nickName}</Text>})
      </Text>
      {description && (
        <Text numberOfLines={3} style={styles.memberDescription}>
          {description}
        </Text>
      )}
      {email && (
        <Pressable
          style={styles.memberEmailPhone}
          onPress={() => openLink(`mailto:${email}`)}
        >
          <Text style={styles.textContact}>Contact Via Email</Text>
        </Pressable>
      )}
      {phone && (
        <Pressable
          style={styles.memberEmailPhone}
          onPress={() => openLink(`tel:${phone}`)}
        >
          <Text style={styles.textContact}>Contact Via Phone</Text>
        </Pressable>
      )}
      <View style={styles.socialMediaContainer}>
        {socialMedia && socialMedia.facebook && (
          <Pressable onPress={() => openLink(socialMedia.facebook)}>
            <FontAwesome name="facebook-square" size={24} color="black" />
          </Pressable>
        )}
        {socialMedia && socialMedia.whatsapp && (
          <Pressable onPress={() => openLink(socialMedia.whatsapp)}>
            <FontAwesome name="whatsapp" size={24} color="black" />
          </Pressable>
        )}
        {socialMedia && socialMedia.github && (
          <Pressable onPress={() => openLink(socialMedia.github)}>
            <FontAwesome name="github-square" size={24} color="black" />
          </Pressable>
        )}
        {socialMedia && socialMedia.linkedin && (
          <Pressable onPress={() => openLink(socialMedia.linkedin)}>
            <FontAwesome name="linkedin-square" size={24} color="black" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "lightgrey",
    marginVertical: 20,
    marginHorizontal: "auto",
  },
  memberName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  memberRole: {
    fontSize: 16,
    color: "#2f2baa",
  },
  memberDescription: {
    fontSize: 14,
    marginVertical: 10,
    marginHorizontal: 35,
    textAlign: "center",
  },
  memberEmailPhone: {
    backgroundColor: "#2f2baa",
    padding: 10,
    borderRadius: 25,
    marginVertical: 5,
    marginHorizontal: 35,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  textContact:{
    color:"white",
    fontWeight:"bold",
    textAlign:"center",
    fontSize:16
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    gap: 20,
  },
});
export default MemberDetails;
