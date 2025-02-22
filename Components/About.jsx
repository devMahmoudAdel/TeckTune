import { Text, View,StyleSheet, ScrollView, Pressable } from "react-native";
import Member from "./Member";

const members = [
  {
    name: "Mahmoud Adel",
    nickName: "Dolsika",
    image: require("../assets/icon.png"),
    description: "lorem ipsum",
    socialMedia: {
      facebook: "https://www.facebook.com",
      github: "https://www.github.com/devMahmoudAdel",
      linkedin: "https://www.linkedin.com",
      whatsapp: "https://wa.me/+201033612081",
    },
    email: "karim3del04@gmail.com",
    phone: "01033612081",
  },
  {
    name: "hazem",
    nickName: " نقاش",
    image: require("../assets/icon.png"),
    description: "دمي خفيف ",
    email: "hazemhussein392@gmail.com",
    phone: "01558277796 ",
    socialMedial: {
      facebook: " ",
      whatsapp: " ",
      linkedin: " ",
      github: " ",
    },
  },
  {
    name: "Ahmed Hassan",
    nickName: "Capa",
    image: require("../assets/icon.png"),
    description: "",
    email: "elbana795@gmail.com",
    phone: "01002467068",
    socialMedia: {
      facebook: "https://www.facebook.com/profile.php?id=100003673874770",
      whatsapp: "https://wa.me/+201002467068",
      linkedin: "https://www.linkedin.com/in/capa-undefined-0b443b271/",
      github: "https://github.com/Capa11 ",
    },
  },
  {
    name: "Member 4",
    nickName: "Role 4",
    image: require("../assets/icon.png"),
    description: "Description 1",
    socialMedia: {
      facebook: "https://www.facebook.com",
      github: "https://www.github.com",
      linkedin: "https://www.linkedin.com",
      whatsapp: "https://www.whatsapp.com",
    },
    email: "email@domain",
    phone: "1234567890",
  },
  {
    name: "Member 5",
    nickName: "Role 5",
    image: require("../assets/icon.png"),
    description: "Description 1",
    socialMedia: {
      facebook: "https://www.facebook.com",
      github: "https://www.github.com",
      linkedin: "https://www.linkedin.com",
      whatsapp: "https://www.whatsapp.com",
    },
    email: "email@domain",
    phone: "1234567890",
  },
  {
    name: "Member 6",
    nickName: "Role 6",
    image: require("../assets/icon.png"),
    description: "Description 1",
    socialMedia: {
      facebook: "https://www.facebook.com",
      github: "https://www.github.com",
      linkedin: "https://www.linkedin.com",
      whatsapp: "https://www.whatsapp.com",
    },
    email: "email@domain",
    phone: "1234567890",
  },
];
export default function About({ navigation }) {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, { marginTop: 30 }]}>About Us</Text>
        <Text style={styles.description}>
          Welcome to our app! We are dedicated to providing you with the best
          experience.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={[styles.title, { marginTop: 20 }]}>Team Members</Text>
        <View style={styles.members}>
          {members.map((member, index) => (
            <Pressable key={index} onPress={() => navigation.navigate("MemberDetails", member)}>
              <Member key={index} {...member} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2f2baa",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  version: {
    fontSize: 14,
    color: "gray",
  },
  members: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 40, 
  }
  
});
