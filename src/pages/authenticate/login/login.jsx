import {
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonLabel,
} from '@ionic/react';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../../App';
import { useAuthState } from 'react-firebase-hooks/auth';
import './login.css';
import { useHistory } from 'react-router-dom';

import { IonReactRouter } from '@ionic/react-router';

import { app, database } from '../../../utils/firebaseConfig';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const Login = () => {
  const auth = getAuth();
  const db = collection(database, 'users');
  const history = useHistory();
  const [user, loading, error] = useAuthState(auth);
  const [isRegistered, setIsRegistered] = useState(false);

  // useEffect(() => {
  //   if (loading) {
  //     setIsRegistered(true);
  //     return;
  //   }
  //   if (user) history.replace('/tabs/academy');
  // }, [user, loading]);

  const [RegisterInputs, setRegisterInputs] = useState({
    username: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phone: '',
  });

  const [LoginInputs, setLoginInputs] = useState({
    email: '',
    password: '',
  });
  const handleRegisterChange = (e) => {
    setRegisterInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleLoginChange = (e) => {
    setLoginInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        LoginInputs.email,
        LoginInputs.password
      );
      history.replace('/tabs/academy');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    let res;
    try {
      res = await createUserWithEmailAndPassword(
        auth,
        RegisterInputs.email,
        RegisterInputs.password
      );
      modal.current?.dismiss();
      history.replace('/tabs/academy');
      console.log('User Created');
    } catch (error) {
      alert(error.message);
    }
    const user = res.user;
    try {
      await setDoc(doc(db, user.uid), {
        username: RegisterInputs.username,
        email: RegisterInputs.email,
        phone: RegisterInputs.phone,
        dateOfBirth: RegisterInputs.dateOfBirth,
      });
      console.log('Document Created');
    } catch (error) {
      history.push('/login');
      alert(error.message);
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const modal = useRef();
  const input = useRef();

  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onWillDismiss(ev) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }

  return (
    <div className="container">
      <div className="info">
        <div className="logoandtext">
          <img alt="logo" width={120} height={120} src="assets/logofalet.png" />
          <h3>Be part of our beloved crypto community by signing in</h3>
        </div>
        <form className="form">
          <IonItem className="border">
            <IonInput
              name="email"
              type="email"
              placeholder="Email"
              onIonInput={handleLoginChange}
            ></IonInput>
          </IonItem>
          <IonItem className="border">
            <IonInput
              name="password"
              type="password"
              placeholder="Password"
              onIonInput={handleLoginChange}
            ></IonInput>
          </IonItem>

          <IonButton size="large" onClick={handleLogin} expand="block">
            Sign In
          </IonButton>
          <span className="forgot">Forgot password?</span>
        </form>

        <div className="signup">
          <h4> New to Cryptorabic?</h4>{' '}
          <IonButton id="open-modal">Sign Up</IonButton>
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger="open-modal"
        onWillDismiss={(ev) => onWillDismiss(ev)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>
                Cancel
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <div className="form">
              <IonItem className="border">
                <IonInput
                  name="username"
                  type="username"
                  value={RegisterInputs.username}
                  placeholder="Username"
                  required
                  onIonInput={handleRegisterChange}
                ></IonInput>
              </IonItem>
              <IonItem className="border">
                <IonInput
                  value={RegisterInputs.email}
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  onIonInput={handleRegisterChange}
                ></IonInput>
              </IonItem>
              <IonItem className="border">
                <IonInput
                  name="phone"
                  type="phone"
                  value={RegisterInputs.phone}
                  placeholder="Phone Number"
                  required
                  onIonInput={handleRegisterChange}
                ></IonInput>
              </IonItem>

              <IonItem className="border">
                <IonInput
                  name="dateOfBirth"
                  type="date"
                  value={RegisterInputs.dateOfBirth}
                  placeholder="Date of Birth"
                  required
                  onIonInput={handleRegisterChange}
                ></IonInput>
              </IonItem>

              <IonItem className="border">
                <IonInput
                  value={RegisterInputs.password}
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  onIonInput={handleRegisterChange}
                ></IonInput>
              </IonItem>
              <IonItem className="border">
                <IonInput
                  name="password"
                  type="password"
                  placeholder="Repeat Password"
                  required
                ></IonInput>
              </IonItem>
              <IonButton size="large" onClick={handleRegister} expand="block">
                Sign up
              </IonButton>
            </div>
          </IonItem>
          <IonLabel class="disclaimer">
            By creating an account you agree and accept our privacy policy
          </IonLabel>
        </IonContent>
      </IonModal>
    </div>
  );
};
export default Login;
