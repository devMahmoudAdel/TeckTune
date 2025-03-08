// a separate file which handles the Authentication navigation.

import { createStackNavigator, Header } from "@react-navigation/stack";
import SignInScreen from "../screens/Auth/SignInScreen";
import Step1 from "../screens/Auth/signUp/Step1";
import Step2 from "../screens/Auth/signUp/Step2";
import Step3 from "../screens/Auth/signUp/Step3";
import Login from "../screens/Auth/login";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Sign In">
      <Stack.Screen name="Sign In" component={SignInScreen} />

      {/* sign up screens  */}
      <Stack.Screen name="Sign Up" component={Step1} />
      <Stack.Screen
        name="Step2"
        component={Step2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Step3"
        component={Step3}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
