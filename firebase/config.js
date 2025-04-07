// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiUeOSt7zYlFEeW74Wlep2QlDGF-vweN8",
  authDomain: "tecktune-fcaca.firebaseapp.com",
  projectId: "tecktune-fcaca",
  storageBucket: "tecktune-fcaca.firebasestorage.app",
  messagingSenderId: "604049454935",
  appId: "1:604049454935:web:f5fa40b5accf837d23f012",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };