import {
  IonRow,
  IonCol,
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
import { useContext, useState, useRef } from 'react';
import { UserContext } from '../../../App';
import Signup from '../signup/signup';
import './login.css';
import { Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { OverlayEventDetail } from '@ionic/core/components';

const Login = () => {
  const user = useContext(UserContext);
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    console.log(e);
  };
  const handleLogin = () => {
    console.log('login');
  };
  const handleRegister = () => {
    console.log(inputs);
    // user.setIsLoggedIn(true);
    modal.current?.dismiss();
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
              name="emailLogin"
              type="email"
              placeholder="Email"
            ></IonInput>
          </IonItem>
          <IonItem className="border">
            <IonInput
              name="passwordLogin"
              type="password"
              placeholder="Password"
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
                  value={inputs.username}
                  placeholder="Username"
                  required
                  ionChange={handleChange}
                ></IonInput>
              </IonItem>
              <IonItem className="border">
                <IonInput
                  value={inputs.email}
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  ionChange={handleChange}
                ></IonInput>
              </IonItem>
              <IonItem className="border">
                <IonInput
                  name="phone"
                  type="phone"
                  value={inputs.phone}
                  placeholder="Phone Number"
                  required
                  ionChange={handleChange}
                ></IonInput>
              </IonItem>
              <IonItem className="border">
                <IonInput
                  value={inputs.password}
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  ionChange={handleChange}
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
