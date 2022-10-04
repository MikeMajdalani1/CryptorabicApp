import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { chatbubbleEllipses, person, newspaper, school } from "ionicons/icons";
import Info from "./pages/info/info";
import Academy from "./pages/academy/academy";
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";

const Tabs: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/info/">
            <Info />
          </Route>
          <Route path="/academy">
            <Academy />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route exact path="/">
            <Redirect to="/info/news" />
          </Route>
          <Route exact path="/login">
            <Redirect to="/info/news" />
          </Route>
          <Route exact path="/register">
            <Redirect to="/info/news" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="Info" href="/info/news">
            <IonIcon icon={newspaper} />
          </IonTabButton>
          <IonTabButton tab="Academy" href="/academy">
            <IonIcon icon={school} />
          </IonTabButton>
          <IonTabButton tab="Chat" href="/chat">
            <IonIcon icon={chatbubbleEllipses} />
          </IonTabButton>
          <IonTabButton tab="Profile" href="/profile">
            <IonIcon icon={person} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Tabs;
