import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/useAuth";
import Splash from "../Components/Splash";
import * as Network from "expo-network";

export default function Index() {
  const { user, loading, guest } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isConnected, setIsConnected] = useState(null);

  const checkInternetConnection = async () => {
    const networkState = await Network.getNetworkStateAsync();
    setIsConnected(networkState.isConnected);
  };

  useEffect(() => {
    checkInternetConnection();
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || loading || isConnected === null) {
    return <Splash />;
  }

  if (user || guest) {
    return <Redirect href="./(main)/(tabs)/Home" />;
  } else {
    return isConnected ? <Redirect href="./(auth)/Discover" /> : <Redirect href="./NoInternet" />;
  }
}
