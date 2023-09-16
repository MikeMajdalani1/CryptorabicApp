import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Header from '../../components/header/header';
import './home.css';
import { useEffect, useContext } from 'react';
import { MainContext } from '../../utils/Context';
import CryptoCoins from './crypto-coins/crypto-coins';
import SocialsButton from './socials-button/socials-button';
import Signals from './signals/signals';
import News from './news/news';

const Home = () => {
  const { fetchUserData } = useContext(MainContext);

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <SocialsButton />
        <div className="home__container">
          <CryptoCoins />
          <div className="seperator"></div>
          <div className="seperator"></div>
          <Signals />
          <div className="seperator"></div>
          <div className="seperator"></div>
          <News />
          <div className="seperator"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
