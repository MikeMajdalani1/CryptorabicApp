import {
  IonContent,
  IonAvatar,
  IonHeader,
  IonPage,
  IonList,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
} from '@ionic/react';
import { getAuth, signOut } from 'firebase/auth';
import Header from '../../components/header/header';
import './profile.css';
import { useHistory } from 'react-router-dom';
const Profile: React.FC = () => {
  const auth = getAuth();
  const history = useHistory();
  const singOut = () => {
    signOut(auth);
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <div className="profilecontainer">
          <div className="center">
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="assets/joenassar.png"
              />
            </IonAvatar>
            <IonLabel>Joe Nassar, 24</IonLabel>
          </div>
          <div className="detailscontainer">
            <div className="detailslist">
              <IonList>
                <IonItem>
                  <IonInput
                    value="t"
                    placeholder="Enter Input"
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    value="t"
                    placeholder="Enter Input"
                    clearInput
                  ></IonInput>
                </IonItem>
              </IonList>
            </div>
          </div>
          <IonButton size="large" onClick={singOut} expand="block">
            Sign Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
