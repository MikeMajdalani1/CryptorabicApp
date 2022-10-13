import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubbleEllipses, person, newspaper, school } from 'ionicons/icons';
import Info from './pages/info/info';
import Academy from './pages/academy/academy';
import Chat from './pages/chat/chat';
import Profile from './pages/profile/profile';

import Login from './pages/authenticate/login/login';
import Tabs from './tabs';
import { createContext } from 'react';
import { useState, useContext } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

setupIonicReact();

interface IUserManager {
  setIsLoggedIn: Function;
}

const user: IUserManager = {
  setIsLoggedIn: () => {},
};

export const UserContext = createContext<IUserManager>(user);

const IonicApp: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loggedUser = useContext(UserContext);
  loggedUser.setIsLoggedIn = setIsLoggedIn;

  return (
    <IonApp>
      <IonReactRouter>
        <Route path="/login" component={user ? Tabs : Login} exact={true} />
        <Route path="/info/news" component={Tabs} exact={true} />

        <Redirect from="/" to={'/login'} />
      </IonReactRouter>
    </IonApp>
  );
};

const App: React.FC = () => {
  return (
    <UserContext.Provider value={user}>
      <IonicApp />
    </UserContext.Provider>
  );
};

export default App;
