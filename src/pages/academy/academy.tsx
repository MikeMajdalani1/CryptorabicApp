import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './academy.css';

const Academy: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Academy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Academy Page" />
      </IonContent>
    </IonPage>
  );
};

export default Academy;
