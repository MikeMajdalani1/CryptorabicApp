import { Redirect, Route } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/authenticate/login/login';
import Tabs from './tabs';

import { useState } from 'react';

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

const IonicApp: React.FC = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <IonApp>
      <IonReactRouter>
        <Route path="/tabs" component={user ? Tabs : Login} exact />
        <Route path="/tabs/academy" component={user ? Tabs : Login} />
        <Route path="/tabs/chat" component={user ? Tabs : Login} />
        <Route path="/tabs/profile" component={user ? Tabs : Login} />
        <Route path="/" component={user ? Tabs : Login} exact />
      </IonReactRouter>
    </IonApp>
  );
};

const App: React.FC = () => {
  return <IonicApp />;
};

export default App;
