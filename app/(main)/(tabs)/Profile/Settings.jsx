import { ScrollView, Text, View } from "react-native";
import FirebaseTest from "../../../../Components/FirebaseTest";
import AdminCreator from "../../../../Components/AdminCreator";

export default function Settings() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
          Settings
        </Text>
        
        {/* Admin Creator Section */}
        <View style={{ marginBottom: 30 }}>
          <AdminCreator />
        </View>
        
        {/* Firebase Test Section */}
        <View style={{ marginTop: 20 }}>
          <FirebaseTest />
        </View>
      </View>
    </ScrollView>
  );
}
