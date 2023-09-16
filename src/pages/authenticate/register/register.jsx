import { useState, useContext } from 'react';
import { checkFullNumber } from '../../../utils/functions';
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
import { MainContext } from '../../../utils/Context';
import {
  signUp,
  getFrontendErrorMessage,
} from '../../../utils/firebase-functions';
import { emailRegex } from '../../../utils/regexes';
import { useHistory } from 'react-router-dom';
import { closeOutline, alertOutline } from 'ionicons/icons';

function RegisterModal({ isRegisterModalOpen, setRegisterModalOpen }) {
  const [RegisterInputs, setRegisterInputs] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const history = useHistory();
  const { presentToast } = useContext(MainContext);
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterInputs((previousState) => ({
      ...previousState,
      [name]: value,
    }));
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
      return;
    } else {
      if (RegisterInputs.username.length > 25) {
        presentToast({
          message: 'Username can not be more than 25 characters',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
        return;
      } else if (RegisterInputs.password.length < 7) {
        presentToast({
          message: 'Password should be more than 6 characters',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
        return;
      } else if (!emailRegex.test(RegisterInputs.email)) {
        presentToast({
          message: 'Incorrect Email Format',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
        return;
      } else if (checkFullNumber(RegisterInputs.phone)) {
        presentToast({
          message: 'Incorrect Phone Number Format',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
        return;
      } else {
        setRegisterModalOpen(false);

        const res = await signUp(
          RegisterInputs.email,
          RegisterInputs.password,
          RegisterInputs.username,
          RegisterInputs.phone
        );
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
        <div className="container">
          <div className="modal-container">
            <div className="modal-container__header">
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
              <div className="modal-container__form">
                <IonItem className="blue-border">
                  <IonInput
                    name="username"
                    type="username"
                    value={RegisterInputs.username}
                    placeholder="Username"
                    required
                    onIonChange={handleRegisterChange}
                  ></IonInput>
                </IonItem>
                <IonItem className="blue-border">
                  <IonInput
                    value={RegisterInputs.email}
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    onIonChange={handleRegisterChange}
                  ></IonInput>
                </IonItem>
                <IonItem className="blue-border">
                  <IonInput
                    name="phone"
                    type="tel"
                    value={RegisterInputs.phone}
                    placeholder="Phone Number"
                    required
                    onIonChange={handleRegisterChange}
                  ></IonInput>
                </IonItem>

                <IonItem className="blue-border">
                  <IonInput
                    value={RegisterInputs.password}
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    onIonChange={handleRegisterChange}
                  ></IonInput>
                </IonItem>
                <IonButton size="large" onClick={handleRegister} expand="block">
                  Sign up
                </IonButton>
              </div>
            </IonItem>
            <IonLabel class="modal-container__disclaimer">
              By creating an account you agree and accept our{' '}
              <a href="https://cryptorabic.com/privacy_policy.pdf">
                privacy policy
              </a>
            </IonLabel>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
export default RegisterModal;
