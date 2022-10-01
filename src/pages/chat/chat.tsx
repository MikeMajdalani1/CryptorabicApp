import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './chat.css';

const Chat: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Chat Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Chat Page" />
      </IonContent>
    </IonPage>
  );
};

export default Chat;
