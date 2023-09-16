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
import { emailRegex } from '../../../utils/regexes';
import { MainContext } from '../../../utils/Context';
import {
  resetPassword,
  getFrontendErrorMessage,
} from '../../../utils/firebase-functions';
import { closeOutline, alertOutline } from 'ionicons/icons';

function ResetPasswordModal({ isResetModalOpen, setResetModalOpen }) {
  const { presentToast } = useContext(MainContext);

  const [ResetInput, setResetInput] = useState('');

  const handleInputChange = (e) => {
    setResetInput(e.target.value);
  };

  const handleResetPassword = async () => {
    if (ResetInput === '' || !emailRegex.test(ResetInput)) {
      presentToast({
        message: 'Please provide a valid email',
        duration: 3000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      const res = await resetPassword(ResetInput);
      if (res.success) {
        presentToast({
          message: 'Reset password email sent!',
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      } else {
        presentToast({
          message: getFrontendErrorMessage(res.error),
          duration: 3000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    }
  };
  return (
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
                Please provide the email you registered with so we can send you
                a rest password email
              </h3>
            </div>
            <IonItem>
              <div className="modal-container__form">
                <IonItem className="blue-border">
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
            <IonLabel class="modal-container__disclaimer">
              Friendly tip: Always save your password somewhere safe so you
              won't lose or forget them.
            </IonLabel>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
export default ResetPasswordModal;
