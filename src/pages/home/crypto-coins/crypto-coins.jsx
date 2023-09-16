import { useEffect, useState } from 'react';
import { fetchCoins } from '../../../utils/functions';
import CryptoCard from '../../../components/crypto-card/crypto-card';
import { IonLabel, IonSkeletonText } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useWindowWidth } from '@react-hook/window-size';
import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
function CryptoCoins() {
  const [numberOfSlidesCoins, setnumberOfSlidesCoins] = useState(2);
  const [coins, setCoins] = useState({});

  const onlyWidth = useWindowWidth();

  useEffect(() => {
    async function _fetchCoins() {
      setCoins(await fetchCoins());
    }
    _fetchCoins();
  }, []);

  useEffect(() => {
    if (onlyWidth < 384) {
      setnumberOfSlidesCoins(1);
      return;
    } else if (384 < onlyWidth && onlyWidth < 592) {
      setnumberOfSlidesCoins(2);
      return;
    } else if (592 < onlyWidth && onlyWidth < 832) {
      setnumberOfSlidesCoins(3);

      return;
    } else if (onlyWidth > 1200) {
      setnumberOfSlidesCoins(6);
    }
  }, [onlyWidth]);
  return (
    <>
      <IonLabel className="home__header">Popular Coins</IonLabel>
      <div className="seperator"></div>

      <Swiper slidesPerView={numberOfSlidesCoins} spaceBetween={20}>
        {Object.keys(coins).length !== 0 ? (
          Object.values(coins).map((coin, i) => {
            return (
              <SwiperSlide key={i}>
                <CryptoCard
                  coinImage={coin.image}
                  coinName={coin.id}
                  coinAbrev={coin.symbol}
                  price={coin.current_price}
                  marketChange={coin.price_change_percentage_24h}
                ></CryptoCard>
              </SwiperSlide>
            );
          })
        ) : (
          <IonSkeletonText
            animated={true}
            style={{ height: '170px', width: '100%' }}
          ></IonSkeletonText>
        )}
      </Swiper>
    </>
  );
}
export default CryptoCoins;
