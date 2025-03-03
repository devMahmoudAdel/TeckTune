import About from "../Components/About";
import MemberDetails from "../Components/MemberDetails";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function AboutStack() {
  return (
    <Stack.Navigator initialRouteName="AboutSc">
      <Stack.Screen
        name="AboutSc"
        component={About}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberDetails"
        component={MemberDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
