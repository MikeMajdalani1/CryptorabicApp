import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  arrayRemove,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';
import { database } from './firebaseConfig';

const auth = getAuth();

export function getFrontendErrorMessage(errorCode) {
  switch (errorCode) {
    case 'Firebase: Error (auth/user-not-found).':
      return 'This email is not registered, please make sure you enter a registered email.';
    case 'Firebase: Error (auth/wrong-password).':
      return 'The password entered is wrong. Please make sure you enter the correct password.';
    case 'Firebase: Error (auth/email-already-in-use).':
      return 'The email address is already in use. Please use a different email.';
    case 'Firebase: Error (auth/invalid-email).':
      return 'Invalid email address. Please enter a valid email.';
    case 'Firebase: Error (auth/weak-password).':
      return 'Weak password. Please choose a stronger password.';
    case 'Firebase: Error (auth/user-not-found).':
      return 'User not found. Please check your email or sign up for a new account.';
    case 'Firebase: Error (auth/wrong-password).':
      return 'Incorrect password. Please enter the correct password.';
    case 'Firebase: Error (auth/operation-not-allowed).':
      return 'This operation is currently not allowed. Please try again later.';
    case 'Firebase: Error (auth/too-many-requests).':
      return 'Too many requests, please try again in some minutes';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}

export const signUp = async (email, password, username, phone) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(database, 'users', user.uid), {
      username: username,
      phone: phone,
      isAdmin: false,
      label: 'New User',
      imageURL:
        'https://firebasestorage.googleapis.com/v0/b/cryptorabic-app.appspot.com/o/files%2Fuser.png?alt=media&token=21cbeb9e-eecb-40f3-bbde-0888cf8ef90a',
    });

    // Return any relevant data or success status
    return { success: true };
  } catch (error) {
    // Return any relevant error message or failure status
    return { error: error.message, success: false };
  }
};

export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;

    await sendEmailVerification(user);
    return { success: true }; // Indicate success
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const signIn = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);

    return { success: true, result: res }; // Indicate success
  } catch (error) {
    return { error: error.message, success: false }; // Indicate failure
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);

    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const changePasswordFn = async (newPassword) => {
  try {
    await updatePassword(auth.currentUser, newPassword);
    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const reauthenticateWithCredentials = async (oldPassword) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );
    if (user) {
      await reauthenticateWithCredential(user, credential);
      return { success: true };
    } else {
      return null;
    }
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const pinMessage = async (displayMessage, username) => {
  try {
    await setDoc(doc(collection(database, 'pinned')), {
      text: displayMessage,
      createdAt: serverTimestamp(),
      name: username,
    });
    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const deleteMessage = async (messageToDelete) => {
  try {
    const dataToDelete = doc(database, 'chat', 'data1');
    await updateDoc(dataToDelete, {
      messages: arrayRemove(messageToDelete),
    });

    return { success: true };
  } catch (error) {
    console.error('Deleting error: ' + error.message);
    return { error: error.message, success: false };
  }
};

export const sendMessage = async (messageData) => {
  try {
    const dataToUpdate = doc(database, 'chat', 'data1');

    await updateDoc(dataToUpdate, {
      messages: arrayUnion(messageData),
    });

    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};
export const deleteDocument = async (collection, id) => {
  const dataToDelete = doc(database, collection, id);

  try {
    await deleteDoc(dataToDelete);
    return { success: true };
  } catch (error) {
    console.error('Deleting error: ' + error.message);
    return { error: error.message, success: false };
  }
};

export const addDocument = async (collectionName, data) => {
  try {
    await setDoc(doc(collection(database, collectionName)), {
      ...data,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const changeEmail = async (newEmail) => {
  try {
    await updateEmail(auth.currentUser, newEmail);
    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const updateDocument = async (
  collectionName,
  documentId,
  dataToUpdate
) => {
  try {
    const documentRef = doc(database, collectionName, documentId);
    await updateDoc(documentRef, dataToUpdate);

    return { success: true };
  } catch (error) {
    return { error: error.message, success: false };
  }
};

export const deleteUserFn = async () => {
  const dataToDelete = doc(database, 'users', auth.currentUser?.uid);
  try {
    await deleteDoc(dataToDelete);
    try {
      await auth.currentUser?.delete();
      return { success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  } catch (error) {
    return { error: error.message, success: false };
  }
};
