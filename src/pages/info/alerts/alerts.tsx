import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../../components/ExploreContainer';
import './alerts.css';

const News: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Alerts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Alerts Page" />
      </IonContent>
    </IonPage>
  );
};

export default News;
