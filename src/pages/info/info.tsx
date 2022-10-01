import {IonTabs, IonTabBar, IonTabButton, IonRouterOutlet, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './info.css';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Alerts from './alerts/alerts'
import News from './news/news'

const Info: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonTitle class='ion-text-center padding'>
         
           <img alt='logo' width={80} height={80} src='assets/logofalet.png'/>
       
         </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
            <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/news">
                  <News />
                </Route>
                <Route path="/alerts">
                  <Alerts />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="top">
                <IonTabButton tab="News" href="/news">
                <IonTitle> News </IonTitle>
                </IonTabButton>
                
                <IonTabButton tab="Alerts" href="/alerts">
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
