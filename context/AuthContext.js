import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This code runs when your app first mounts the AuthProvider,
  // checking AsyncStorage for a stored user.
  //  The loading state stays true until this process completes.

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error retrieving auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signup = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error, colud not remove user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};



// remmeber that :- 
   
  // useEffect is executed once at the beginning.
  // =>> so it will auto check and load from the storage to see 
  // is or not there a pre-signed user ,,,, 
  
  /*   Thus, we can deduce that i only need to 
    1- use that  pre-defined context 

    >> shorthand use the designed Hook -> useAuth
    
    2- Destructure that context aka get the reqired useStates:-
          load : the useState, if yes it still looking in its storage
          user : if === user --> pre-signed user
          
          // used to handle : putting and removing data from storage
          login
          logout
          singin 
  */