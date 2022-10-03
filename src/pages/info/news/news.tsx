import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../../../components/ExploreContainer";
import "./news.css";
import axios from "axios";
import { useEffect } from "react";
const News: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <ExploreContainer name="News Page" />
      </IonContent>
    </IonPage>
  );
};

export default News;
