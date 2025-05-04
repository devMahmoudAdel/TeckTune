// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuzHbnOeWZZZLX9ihVn1JqPB2BqOQV4jw",
  authDomain: "software-3b26b.firebaseapp.com",
  projectId: "software-3b26b",
  storageBucket: "software-3b26b.firebasestorage.app",
  messagingSenderId: "781918532588",
  appId: "1:781918532588:web:911f648f05ed84c06f06c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };