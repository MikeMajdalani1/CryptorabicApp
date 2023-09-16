import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Header from '../../components/header/header';
import './profile.css';
import ProfileImage from './profile-image/profile-image';
import ProfileForm from './profile-form/profile-form';

const Profile = () => {
  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <div className="profile__container">
          <div className="profile__container__image">
            <ProfileImage />
          </div>
          <ProfileForm />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
