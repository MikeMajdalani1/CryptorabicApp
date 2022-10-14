import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubbleEllipses, person, newspaper, school } from 'ionicons/icons';
import Info from './pages/info/info';
import Academy from './pages/academy/academy';
import Chat from './pages/chat/chat';
import Profile from './pages/profile/profile';

const Tabs: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* <Route path="/tabs/info" component={Info} exact={true} /> */}
          <Route path="/tabs/academy" component={Academy} exact={true} />
          <Route path="/tabs/chat" component={Chat} exact={true} />
          <Route path="/tabs/profile" component={Profile} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {/* <IonTabButton tab="Info" href="/tabs/info">
            <IonIcon icon={newspaper} />
          </IonTabButton> */}
          <IonTabButton tab="Academy" href="/tabs/academy">
            <IonIcon icon={school} />
          </IonTabButton>
          <IonTabButton tab="Chat" href="/tabs/chat">
            <IonIcon icon={chatbubbleEllipses} />
          </IonTabButton>
          <IonTabButton tab="Profile" href="/tabs/profile">
            <IonIcon icon={person} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Tabs;
