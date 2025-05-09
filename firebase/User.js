import CheckAlert from "../Components/CheckAlert";
import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { query, where } from "firebase/firestore";

const getUser = async (userId) => {
  try {
    const userDocRef = doc(collection(db, "users"), userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      <CheckAlert state="error" title="user does not exist" />;
    }
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

const createUser = async (userId, userData) => {
  try {
    const userDocRef = doc(collection(db, "users"), userId);
    await setDoc(
      userDocRef,
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        createdAt: new Date(),
        profilePic: userData.profilePic,
        status: userData.status || "active",
        role: userData.role || "user",
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    <CheckAlert state="error" title={error.message} />;
  }
};

const isUsernameExists = async (userName) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", userName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};

const isEmailExists = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

const isPasswordExists = async (password) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("password", "==", password));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking password:", error);
    return false;
  }
};

const isUserExists = async (email, password) => {
  try {
    const usersRef = collection(db, "users");

    const userQuery = query(
      usersRef,
      where("email", "==", email),
      where("password", "==", password)
    );

    const querySnapshot = await getDocs(userQuery);

    return !querySnapshot.empty;

  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};

export {
  getUser,
  createUser,
  isEmailExists,
  isUserExists,
  isPasswordExists,
  isUsernameExists,
  getAllUsers,
};
