import { db } from './config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const getUser = async (userId) => {
  try {
    const userDocRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User does not exist');
    }
  } catch (error) {
    throw error;
  }
};

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
    throw error;
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

export { getUser, createUser, isUnique };