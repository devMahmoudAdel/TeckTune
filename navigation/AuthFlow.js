import React, { useContext, useEffect, useState } from "react";

import AuthStack from "./AuthStack";
import MainAppNavigator from "./MainNav";

import Splash from "../Components/Splash";

import { AuthProvider, AuthContext } from "../context/AuthContext";

const AuthFlow = () => {
  const { user, loading } = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash || loading) {
    return <Splash />;
  }

  return user ? <MainAppNavigator /> : <AuthStack />;
};

export default AuthFlow;
