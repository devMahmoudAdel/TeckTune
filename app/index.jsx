import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/useAuth";
import Splash from "../Components/Splash";
export default function Index() {
  const { user, loading, guest } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

 
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
  if (user || guest) {
    
    return <Redirect href="./(main)/(tabs)/Home" />;
  } else {
    
    return <Redirect href="./(auth)/Discover" />;
  }
}
