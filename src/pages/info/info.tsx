import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import Header from "../../components/header/header";
import "./info.css";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Alerts from "./alerts/alerts";
import News from "./news/news";

const Info: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/info/news">
                <News />
              </Route>
              <Route path="/info/alerts">
                <Alerts />
              </Route>
            </IonRouterOutlet>
            <IonTabBar selectedTab="Alerts" slot="top">
              <IonTabButton tab="News" href="/info/news">
                <IonTitle> News </IonTitle>
              </IonTabButton>

              <IonTabButton tab="Alerts" href="/info/alerts">
                <IonTitle> Alerts </IonTitle>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonContent>
    </IonPage>
  );
};

export default Info;
