import CheckAlert from '../Components/CheckAlert';
import { db } from './config';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

const getUser = async (userId) => {
  try {
    const userDocRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      <CheckAlert state="error" title="user does not exist"/>
    }
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
};
const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    throw error;
  }
}

const createUser = async (userId, userData) => {
  try {
    const userDocRef = doc(collection(db, 'users'), userId);
    await setDoc(userDocRef, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      createdAt: new Date(),
      profilePic: userData.profilePic,
      status: userData.status || 'active',
      role: userData.role || 'user',
    }, { merge: true });
    return true;
  } catch (error) {
    <CheckAlert state="error" title={error.message}/>
  }
}


const isUnique = async(userName)=>{
    const userNameQuery = doc(collection(db, 'users'), userName);
    const existingUserName = await getDoc(userNameQuery);

    if (!existingUserName.exists()) {
      // throw new Error('Username is already taken');
      return userName;
    }else{
      throw new Error('Username is already taken');
    }
  };
  const getAllUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map((doc) => doc.data());
      return users;
    } catch (error) {
      <CheckAlert state="error" title={error.message}/>
    }
  };

export { getUser, createUser, isUnique, getAllUsers };