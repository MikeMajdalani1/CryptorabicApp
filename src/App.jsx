import { Route } from 'react-router-dom';
import {
  IonApp,
  setupIonicReact,
  useIonToast,
  useIonAlert,
  IonSpinner,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Login from './pages/authenticate/login/login';
import Tabs from './tabs';
import { MainContext } from './utils/Context';
import { useEffect, useState } from 'react';

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

/* Global imports */
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { database } from './utils/firebaseConfig';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { alertOutline } from 'ionicons/icons';

setupIonicReact();

const App = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [admin, setAdmin] = useState('');
  const [presentToast] = useIonToast();
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [reAuth] = useIonAlert();

  const fetchUserData = async () => {
    try {
      const q = query(
        collection(database, 'users'),
        where('__name__', '==', user?.uid)
      );
      const doc = await getDocs(q);

      const data = doc.docs[0].data();

      setName(data.username);
      setLabel(data.label);
      setPhone(data.phone);
      setEmail(auth.currentUser.email);
      setAdmin(data.isAdmin);
      setImageURL(data.imageURL);
    } catch (err) {
      console.error(err.message);
      presentToast({
        message: 'An Fetching Eroor has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     SplashScreen.hide();
  //   }, 1000);
  // }, []);
  const loadingScreen = () => {
    return (
      <div className="centerPage">
        <IonSpinner
          className="spinnerStyles"
          color="light"
          name="crescent"
        ></IonSpinner>
      </div>
    );
  };

  return (
    <MainContext.Provider
      value={{
        database,
        user,
        auth,
        fetchUserData,
        admin,
        presentToast,
        name,
        label,
        phone,
        email,
        reAuth,
        imageURL,
      }}
    >
      <IonApp>
        <IonReactRouter>
          <Route path="/tabs" component={user ? Tabs : Login} exact />
          <Route path="/tabs/academy" component={user ? Tabs : Login} />
          <Route path="/tabs/chat" component={user ? Tabs : Login} />
          <Route path="/tabs/profile" component={user ? Tabs : Login} />
          <Route
            path="/"
            component={loading ? loadingScreen : user ? Tabs : Login}
            exact
          />
        </IonReactRouter>
      </IonApp>
    </MainContext.Provider>
  );
};

export default App;
