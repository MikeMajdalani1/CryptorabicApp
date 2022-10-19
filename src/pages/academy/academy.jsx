import { IonContent, IonHeader, IonLabel, IonPage } from '@ionic/react';
import CryptoCard from '../../components/cryptoCard/cryptoCard';

import Header from '../../components/header/header';
import './academy.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import NewsCard from '../../components/newsCard/newsCard';
import SignalCard from '../../components/signalCard/signalCard';

const Academy = () => {
  const onlyWidth = useWindowWidth();
  const [numberOfSlides, setnumberOfSlides] = useState(2);
  const URL =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20';

  const [coins, setCoins] = useState({});

  const fetcher = async (url) => {
    const res = await fetch(url);
    const json = await res.json();

    setCoins(json);
    console.log(coins);
    return json;
  };
  useEffect(() => {
    fetcher(URL);
  }, []);

  useEffect(() => {
    if (onlyWidth < 384) {
      setnumberOfSlides(1);
      return;
    } else if (384 < onlyWidth && onlyWidth < 592) {
      setnumberOfSlides(2);
      return;
    } else if (592 < onlyWidth && onlyWidth < 832) {
      setnumberOfSlides(3);
      return;
    } else if (onlyWidth > 1200) {
      setnumberOfSlides(6);
    } else {
      setnumberOfSlides(4);
      return;
    }
  }, [onlyWidth]);
  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <div className="newsContainer">
          <IonLabel className="header1">Popular Coins</IonLabel>
          <div className="seperatorDiv"></div>

          <Swiper slidesPerView={numberOfSlides} spaceBetween={20}>
            {coins &&
              Object.values(coins).map((coin, i) => {
                return (
                  <SwiperSlide key={i}>
                    {' '}
                    <CryptoCard
                      coinImage={coin.image}
                      coinName={coin.id}
                      coinAbrev={coin.symbol}
                      price={coin.current_price}
                      marketChange={coin.price_change_percentage_24h}
                    ></CryptoCard>
                  </SwiperSlide>
                );
              })}
          </Swiper>
          <div className="seperatorDiv"></div>
          <div className="seperatorDiv"></div>
          <IonLabel className="header1">Signals</IonLabel>
          <div className="seperatorDiv"></div>
          <SignalCard></SignalCard>
          <div className="seperatorDiv"></div>
          <div className="seperatorDiv"></div>
          <IonLabel className="header1"> Updates </IonLabel>
          <div className="seperatorDiv"></div>
          <NewsCard title="hello" description="hello oe " linkURL="sas" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Academy;
