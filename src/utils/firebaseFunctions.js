import { addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const addData = async (db, inputs) => {
  try {
    const res = await addDoc(db, inputs);
    console.log(res);
  } catch (error) {
    alert(error.message);
  }
};

export const getData = async (db) => {
  const data = await getDocs(db);
  console.log(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
};

export const updateData = async (database, id, inputs) => {
  let dataToUpdate = doc(database, 'users', id);
  try {
    const res = await updateDoc(dataToUpdate, {
      email: inputs.email,
      phone: inputs.phone,
      name: inputs.name,
    });
    console.log(res);
  } catch (error) {
    alert(error.message);
  }
};

export const deleteData = async (database, id) => {
  let dataToDelete = doc(database, 'users', id);
  try {
    const res = await deleteDoc(dataToDelete);
    console.log(res);
  } catch (error) {
    alert(error.message);
  }
};

// export const logout = () => {
//   signOut(auth);
// };

//   const sendPasswordReset = async (email) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       alert('Password reset link sent!');
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   };

// const reAuthenticate = async (password) => {
//   const credential = EmailAuthProvider.credential(
//     auth.currentUser.email,
//     password
//   );
//   try {
//     const res = await reauthenticateWithCredential(
//       auth.currentUser,
//       credential
//     );
//     console.log(res);
//     setResolved(true);
//   } catch (error) {
//     console.log('ReAuth error' + error.message);
//     setResolved(false);
//     presentToast({
//       message: 'Wrong Password',
//       duration: 1500,
//       icon: alertOutline,
//       cssClass: 'redToast',
//     });
//   }
// };
