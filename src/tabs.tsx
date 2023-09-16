import { Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubbleEllipses, person, newspaper } from 'ionicons/icons';

import Home from './pages/home/home';
import Chat from './pages/chat/chat';
import Profile from './pages/profile/profile';

const Tabs: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* <Route path="/tabs/info" component={Info} exact={true} /> */}
          <Route path="/tabs/home" component={Home} exact={true} />
          <Route path="/tabs/chat" component={Chat} exact={true} />
          <Route path="/tabs/profile" component={Profile} exact={true} />
          <Route path="/" component={Home} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="Home" href="/tabs/home">
            <IonIcon icon={newspaper} />
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
