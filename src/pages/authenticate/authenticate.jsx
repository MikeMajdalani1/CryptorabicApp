import { IonItem, IonInput, IonButton, IonLabel } from '@ionic/react';
import { useState, useContext } from 'react';

import { MainContext } from '../../utils/Context';
import './authenticate.css';
import { useHistory } from 'react-router-dom';
import { alertOutline } from 'ionicons/icons';
import {
  getFrontendErrorMessage,
  signIn,
} from '../../utils/firebase-functions';
import { emailRegex } from '../../utils/regexes';
import ResetPasswordModal from './reset-password/reset-password';
import RegisterModal from './register/register';
const Authenticate = () => {
  const { presentToast } = useContext(MainContext);
  const history = useHistory();

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  const [LoginInputs, setLoginInputs] = useState({
    email: '',
    password: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginInputs((previousState) => ({
      ...previousState,
      [name]: value,
    }));
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
      if (!emailRegex.test(LoginInputs.email)) {
        presentToast({
          message: 'Please provide a valid email',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else {
        const res = await signIn(LoginInputs.email, LoginInputs.password);
        if (res.success) {
          history.replace('/tabs/home');
        } else {
          presentToast({
            message: getFrontendErrorMessage(res.error),
            duration: 3000,
            icon: alertOutline,
            cssClass: 'redToast',
          });
        }
      }
    }
  };

  return (
    <div className="center-page">
      <div className="login-container">
        <div className="login-container__header">
          <img alt="logo" width={120} height={120} src="assets/logofalet.png" />
          <h3>Be part of our beloved crypto community by signing in</h3>
        </div>
        <form className="login-container__form">
          <IonItem className="blue-border">
            <IonInput
              name="email"
              type="email"
              placeholder="Email"
              onIonChange={handleLoginChange}
            ></IonInput>
          </IonItem>

          <IonItem className="blue-border">
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
          <IonLabel
            onClick={() => setResetModalOpen(true)}
            className="login-container__form__forgot-password"
          >
            Forgot password?
          </IonLabel>
        </form>

        <div className="login-container__sign-up">
          <h4> New to Cryptorabic?</h4>{' '}
          <IonButton onClick={() => setRegisterModalOpen(true)}>
            Sign Up
          </IonButton>
        </div>
      </div>
      <RegisterModal
        isRegisterModalOpen={isRegisterModalOpen}
        setRegisterModalOpen={setRegisterModalOpen}
      />
      <ResetPasswordModal
        isResetModalOpen={isResetModalOpen}
        setResetModalOpen={setResetModalOpen}
      />
    </div>
  );
};
export default Authenticate;
