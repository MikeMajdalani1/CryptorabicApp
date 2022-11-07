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
import { useState, useContext } from 'react';
import { checkFullNumber } from '../../../utils/functions';
import { MainContext } from '../../../utils/Context';
import './login.css';
import { useHistory } from 'react-router-dom';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { closeOutline, alertOutline } from 'ionicons/icons';

const Login = () => {
  const {
    presentToast,
    database,

    auth,
  } = useContext(MainContext);
  const db = collection(database, 'users');
  const history = useHistory();

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);

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
  const [ResetInput, setResetInput] = useState('');

  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleInputChange = (e) => {
    setResetInput(e.target.value);
  };
  const handleRegisterChange = (e) => {
    if (e.target.value === '' && e.target.name === 'phone') {
      setRegisterInputs((previousState) => ({
        ...previousState,
        phone: '',
      }));
    }
    if (e.target.value === '' && e.target.name === 'username') {
      setRegisterInputs((previousState) => ({
        ...previousState,
        username: '',
      }));
    }
    if (e.target.value === '' && e.target.name === 'email') {
      setRegisterInputs((previousState) => ({
        ...previousState,
        email: '',
      }));
    }

    if (e.target.value === '' && e.target.name === 'password') {
      setRegisterInputs((previousState) => ({
        ...previousState,
        password: '',
      }));
    }

    setRegisterInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleLoginChange = (e) => {
    if (e.target.value === '' && e.target.name === 'password') {
      setLoginInputs((previousState) => ({
        ...previousState,
        password: '',
      }));
    }
    if (e.target.value === '' && e.target.name === 'email') {
      setLoginInputs((previousState) => ({
        ...previousState,
        email: '',
      }));
    }
    setLoginInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetPassword = async () => {
    if (ResetInput === '' || !regex.test(ResetInput)) {
      presentToast({
        message: 'Please provide a valid email',
        duration: 3000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      try {
        await sendPasswordResetEmail(auth, ResetInput);
      } catch (error) {
        console.log(error.message);
        presentToast({
          message: 'Error has occured',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (LoginInputs.email === '' || LoginInputs.password == '') {
      presentToast({
        message: 'Please enter your email and password',
        duration: 3000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      if (!regex.test(LoginInputs.email)) {
        presentToast({
          message: 'Please provide a valid email',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else {
        try {
          await signInWithEmailAndPassword(
            auth,
            LoginInputs.email,
            LoginInputs.password
          );
          history.replace('/tabs/academy');
        } catch (error) {
          console.log(error.message);
          presentToast({
            message: 'Wrong Email or Password',
            duration: 3000,
            icon: alertOutline,
            cssClass: 'redToast',
          });
        }
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      RegisterInputs.username === '' ||
      RegisterInputs.email === '' ||
      RegisterInputs.phone === '' ||
      RegisterInputs.password === ''
    ) {
      presentToast({
        message: 'Oops, you left some input fields empty',
        duration: 3000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      if (RegisterInputs.username.length > 25) {
        presentToast({
          message: 'Username can not be more than 25 characters',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else if (RegisterInputs.password.length < 7) {
        presentToast({
          message: 'Password should be more than 6 characters',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else if (!regex.test(RegisterInputs.email)) {
        presentToast({
          message: 'Incorrect Email Format',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else if (checkFullNumber(RegisterInputs.phone)) {
        presentToast({
          message: 'Incorrect Phone Number Format',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else {
        setRegisterModalOpen(false);
        let res;
        try {
          res = await createUserWithEmailAndPassword(
            auth,
            RegisterInputs.email,
            RegisterInputs.password
          );

          console.log('User Created');

          history.replace('/tabs/academy');
        } catch (error) {
          presentToast({
            message: 'Email Already Registered',
            duration: 3000,
            icon: alertOutline,
            cssClass: 'redToast',
          });
        }
        const user = res.user;
        try {
          await setDoc(doc(db, user.uid), {
            username: RegisterInputs.username,
            phone: RegisterInputs.phone,
            label: 'New User',
            isAdmin: false,
            imageURL:
              'https://firebasestorage.googleapis.com/v0/b/cryptorabic-app.appspot.com/o/files%2Fuser.png?alt=media&token=21cbeb9e-eecb-40f3-bbde-0888cf8ef90a',
          });
          console.log('Document Created');
        } catch (error) {
          history.replace('/');
          presentToast({
            message: 'An error has occured',
            duration: 3000,
            icon: alertOutline,
            cssClass: 'redToast',
          });
        }
      }
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

  return (
    <div className="centerPage">
      <div className="loginContainer">
        <div className="FormLogoAndText">
          <img alt="logo" width={120} height={120} src="assets/logofalet.png" />
          <h3>Be part of our beloved crypto community by signing in</h3>
        </div>
        <form className="formContainer">
          <IonItem className="border">
            <IonInput
              name="email"
              type="email"
              placeholder="Email"
              onIonChange={handleLoginChange}
            ></IonInput>
          </IonItem>

          <IonItem className="border">
            <IonInput
              name="password"
              type="password"
              placeholder="Password"
              onIonChange={handleLoginChange}
            ></IonInput>
          </IonItem>

          <IonButton size="large" onClick={handleLogin} expand="block">
            Sign In
          </IonButton>
          <IonLabel onClick={() => setResetModalOpen(true)} className="forgot">
            Forgot password?
          </IonLabel>
        </form>

        <div className="signup">
          <h4> New to Cryptorabic?</h4>{' '}
          <IonButton onClick={() => setRegisterModalOpen(true)}>
            Sign Up
          </IonButton>
        </div>
      </div>
      <IonModal isOpen={isRegisterModalOpen} content="container">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setRegisterModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="normalPage">
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
                      onIonChange={handleRegisterChange}
                    ></IonInput>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      value={RegisterInputs.email}
                      name="email"
                      type="email"
                      placeholder="Email"
                      required
                      onIonChange={handleRegisterChange}
                    ></IonInput>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      name="phone"
                      type="tel"
                      value={RegisterInputs.phone}
                      placeholder="Phone Number"
                      required
                      onIonChange={handleRegisterChange}
                    ></IonInput>
                  </IonItem>

                  <IonItem className="border">
                    <IonInput
                      value={RegisterInputs.password}
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      onIonChange={handleRegisterChange}
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
                By creating an account you agree and accept our{' '}
                <a href="https://cryptorabic.com/privacy_policy.pdf">
                  privacy policy
                </a>
              </IonLabel>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <IonModal isOpen={isResetModalOpen} content="container">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setResetModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="normalPage">
            <div className="RegisterContainer">
              <div className="FormLogoAndText">
                <img
                  alt="logo"
                  width={120}
                  height={120}
                  src="assets/logofalet.png"
                />
                <h3>
                  Please provide the email you registered with so we can send
                  you a rest password email
                </h3>
              </div>
              <IonItem>
                <div className="formContainer">
                  <IonItem className="border">
                    <IonInput
                      name="email"
                      type="email"
                      value={ResetInput}
                      placeholder="Email Address"
                      required
                      onIonChange={handleInputChange}
                    ></IonInput>
                  </IonItem>

                  <IonButton
                    size="large"
                    onClick={handleResetPassword}
                    expand="block"
                  >
                    Recover
                  </IonButton>
                </div>
              </IonItem>
              <IonLabel class="disclaimer">
                Friendly tip: Always save your password somewhere safe so you
                won't lose or forget them.
              </IonLabel>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};
export default Login;
