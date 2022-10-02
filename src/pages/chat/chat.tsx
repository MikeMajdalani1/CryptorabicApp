import { IonContent, IonHeader, IonPage } from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import Header from "../../components/header/header";
import "./chat.css";

const Chat: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <ExploreContainer name="Chat Page" />
      </IonContent>
    </IonPage>
  );
};

export default Chat;
