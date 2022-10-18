import {
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { useState, useRef } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import './login.css';
import { useHistory } from 'react-router-dom';

import { database } from '../../../utils/firebaseConfig';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { closeOutline } from 'ionicons/icons';
const Login = () => {
  const auth = getAuth();
  const db = collection(database, 'users');
  const history = useHistory();
  const [user, loading, error] = useAuthState(auth);
  const [loginErrors, setloginErrors] = useState({
    email: '',
    password: '',
    allchecked: 'null',
  });
  const [autherror, setAutherror] = useState('');
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
    // debugger;
    // if (e.target.name == 'email') loginErrors.email = '';
    // if (e.target.password == 'password') loginErrors.password = '';
    setLoginInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    validateLogin(LoginInputs);
    console.log(loginErrors.allchecked);

    try {
      await signInWithEmailAndPassword(
        auth,
        LoginInputs.email,
        LoginInputs.password
      );
      history.replace('/tabs/academy');
    } catch (error) {
      console.log(error.message);
      setAutherror('Wrong Email or Password');
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

      console.log('User Created');
      modal.current?.dismiss();
      history.replace('/tabs/academy');
    } catch (error) {
      alert(error.message);
    }
    const user = res.user;
    try {
      await setDoc(doc(db, user.uid), {
        username: RegisterInputs.username,
        phone: RegisterInputs.phone,
        label: 'New User',
        isAdmin: false,
      });
      console.log('Document Created');
    } catch (error) {
      history.replace('/');
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
  const validateLogin = (values) => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!values.email && !values.password) {
      setloginErrors({
        email: 'Please enter your email address',
        password: 'Please enter your password',
      });
    } else if (!values.email) {
      setloginErrors({
        email: 'Please enter your email address',
        password: '',
      });
    } else if (!values.password) {
      setloginErrors({
        email: '',
        password: 'Please enter your password',
      });
    } else {
      setloginErrors({
        email: '',
        password: '',
        allchecked: 'checked',
      });
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
    <div className="paddingLeftRight">
      <div className="loginContainer">
        <div className="FormLogoAndText">
          <img alt="logo" width={120} height={120} src="assets/logofalet.png" />
          <h3>Be part of our beloved crypto community by signing in</h3>
        </div>
        <form className="formContainer">
          {autherror && <IonLabel className="autherror">{autherror}</IonLabel>}
          <div className="withError">
            <IonItem className="border">
              <IonInput
                name="email"
                type="email"
                placeholder="Email"
                onIonInput={handleLoginChange}
              ></IonInput>
            </IonItem>
            {loginErrors.email && (
              <IonLabel className="errorMessage">{loginErrors.email}</IonLabel>
            )}
          </div>
          <div className="withError">
            <IonItem className="border">
              <IonInput
                name="password"
                type="password"
                placeholder="Password"
                onIonInput={handleLoginChange}
              ></IonInput>
            </IonItem>
            {loginErrors.password && (
              <IonLabel className="errorMessage">
                {loginErrors.password}
              </IonLabel>
            )}
          </div>

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
        content="container"
        onWillDismiss={(ev) => onWillDismiss(ev)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="paddingLeftRight">
            <div className="RegisterContainer">
              <div className="FormLogoAndText">
                <img
                  alt="logo"
                  width={120}
                  height={120}
                  src="assets/logofalet.png"
                />
                <h3>
                  Be part of our beloved crypto community by registering an
                  account
                </h3>
              </div>
              <IonItem>
                <div className="formContainer">
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
                      type="number"
                      value={RegisterInputs.phone}
                      placeholder="Phone Number"
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
                  <IonButton
                    size="large"
                    onClick={handleRegister}
                    expand="block"
                  >
                    Sign up
                  </IonButton>
                </div>
              </IonItem>
              <IonLabel class="disclaimer">
                By creating an account you agree and accept our privacy policy
              </IonLabel>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};
export default Login;
