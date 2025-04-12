import { Text, View,StyleSheet, ScrollView, Pressable } from "react-native";
import Member from "../../../../../Components/Member";
import { useRouter, Link } from "expo-router";
const members = [
  {
    name: "Mahmoud Adel",
    nickName: "2227100",
    image: require("../../../../../assets/icon.png"),
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
    name: "youssef ahmed",
    nickName: "2227471",
    image: require("../../../../../assets/icon.png"),
    description: "description not needed",
    socialMedia: {
      facebook: "https://www.facebook.com",
      github: "https://github.com/YousseefAh",
      linkedin: "https://www.linkedin.com/in/yousseefah/",
      whatsapp: "https://www.whatsapp.com",
    },
    email: "yousseef.ah@gmail.com",
    phone: "1234567890",
  },
  {
   name: " hazem hussien",
    nickName: "2227175",
    image: require("../../../../../assets/icon.png"),
    description: "description not needed",
    socialMedia: {
      facebook: "https://www.facebook.com",
      github: "https://github.com/YousseefAh",
      linkedin: "https://www.linkedin.com/in/yousseefah/",
      whatsapp: "https://www.whatsapp.com",
    },
    email: "yousseef.ah@gmail.com",
    phone: "1234567890",
  },
  {
    name: "Ahmed Hassan",
    nickName: "2227066",
    image: require("../../../../../assets/icon.png"),
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
    name: "Badr Ahmed",
    nickName: "2227137",
    image: require("../../../../../assets/icon.png"),
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
    name: "Abdelrahman Medhat",
    nickName: "2227040",
    image: require("../../../../../assets/icon.png"),
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
    name: "Omar Hassan",
    nickName: "2227385",
    image: require("../../../../../assets/icon.png"),
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
  // {
  //   name: "Member 8",
  //   nickName: "Role 8",
  //   image: require("../../../../../assets/icon.png"),
  //   description: "Description 1",
  //   socialMedia: {
  //     facebook: "https://www.facebook.com",
  //     github: "https://www.github.com",
  //     linkedin: "https://www.linkedin.com",
  //     whatsapp: "https://www.whatsapp.com",
  //   },
  //   email: "email@domain",
  //   phone: "1234567890",
  // },
];
export default function About() {
  const router = useRouter();
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
            <Link
              key={index}
              href={{
                pathname: `/(tabs)/Profile/About/${index}`,
                params: {name: member.name,nickName: member.nickName,image: member.image,description: member.description,socialMediaa: JSON.stringify(member.socialMedia),email: member.email,phone: member.phone},
              }}
            >
              {/* <Link href={`/Profile/About/MemberDetails/${index}`}> */}
              {/* <Pressable onPress={() => router.push(`/Profile/About/MemberDetails/${index}`)}> */}
              <Member key={index} {...member} />
            </Link>
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
