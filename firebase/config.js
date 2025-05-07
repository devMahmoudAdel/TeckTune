// Import the functions you need from the SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - using the working configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuzHbnOeWZZZLX9ihVn1JqPB2BqOQV4jw",
  authDomain: "software-3b26b.firebaseapp.com",
  projectId: "software-3b26b",
  storageBucket: "software-3b26b.appspot.com",
  messagingSenderId: "781918532588",
  appId: "1:781918532588:web:911f648f05ed84c06f06c9",
};

// Initialize Firebase only if it hasn't been initialized already
// Or get the existing instance if already initialized
let app;
try {
  if (!getApps().length) {
    console.log("Initializing new Firebase app");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Using existing Firebase app");
    app = getApp();
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase initialized successfully with project:", firebaseConfig.projectId);

export { auth, db };