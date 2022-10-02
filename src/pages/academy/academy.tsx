import { IonContent, IonHeader, IonPage } from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import Header from "../../components/header/header";
import "./academy.css";

const Academy: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <ExploreContainer name="Academy Page" />
      </IonContent>
    </IonPage>
  );
};

export default Academy;
