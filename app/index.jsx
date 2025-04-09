import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/useAuth";
import Splash from "../Components/Splash";
export default function Index() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  /* -- note 
  The useEffect hook has an empty dependency array ([]), meaning it runs once
  */
  useEffect(() => {
    // Show splash screen for 2 seconds then check auth state
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // While loading or showing splash, display the splash screen
  if (showSplash || loading) {
    return <Splash />;
  }

  // After splash screen and loading, redirect based on authentication state
  if (user) {
    // User is authenticated, redirect to main app
    return <Redirect href="./(main)/(tabs)/Home" />;
  } else {
    // User is not authenticated, redirect to sign in
    return <Redirect href="./(auth)/SignIn" />;
  }
}
