import { IonLabel, IonIcon, IonButton, IonSkeletonText } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useState, useContext } from 'react';
import { MainContext } from '../../../utils/Context';
import { formatDate } from '../../../utils/functions';
import SignalModel from './signal-model/signal-model';
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { alertOutline, trash, checkmarkCircleOutline } from 'ionicons/icons';
import { deleteDocument } from '../../../utils/firebase-functions';
import SignalCard from '../../../components/signal-card/signal-card';
import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
function Signals() {
  const [numberOfSlidesSignals, setnumberOfSlidesSignals] = useState(2);
  const [isSignalModalOpen, setSignalModalOpen] = useState(false);
  const onlyWidth = useWindowWidth();
  const { database, admin, presentToast } = useContext(MainContext);
  const [signals, setSignals] = useState([]);
  useEffect(() => {
    if (database) {
      fetchSignals();
    }
  }, [database]);

  const fetchSignals = async () => {
    try {
      const q = query(
        collection(database, 'signals'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsub = onSnapshot(q, (res) => {
        setSignals(res.docs);
      });
      return unsub;
    } catch (err) {
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  const handleDelete = async (collection, id) => {
    const res = await deleteDocument(collection, id);
    if (res.success) {
      presentToast({
        message: 'Successfully Deleted',
        duration: 1500,
        icon: checkmarkCircleOutline,
      });
    } else {
      presentToast({
        message: 'Error Deleting Data',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };
  useEffect(() => {
    if (onlyWidth < 635) {
      setnumberOfSlidesSignals(1);
    } else if (634 < onlyWidth && onlyWidth < 1200) {
      setnumberOfSlidesSignals(2);
      return;
    } else if (onlyWidth > 1200) {
      setnumberOfSlidesSignals(3);
      return;
    }
  }, [onlyWidth]);

  return (
    <>
      <div className="home__section">
        <IonLabel className="home__header">Signals</IonLabel>

        {admin ? (
          <IonButton onClick={() => setSignalModalOpen(true)} color="primary">
            Add
          </IonButton>
        ) : (
          <div></div>
        )}
      </div>

      <div className="seperator"></div>

      <Swiper slidesPerView={numberOfSlidesSignals} spaceBetween={20}>
        {signals.length !== 0 ? (
          signals.map((signal, i) => {
            const data = signal.data();
            const dataID = signal.id;
            return (
              <SwiperSlide className="swiper-component" key={i}>
                {data.createdAt ? (
                  <div className="swiper-component__content">
                    <IonLabel className="swiper-component__content__label">
                      {formatDate(new Date(data.createdAt.seconds * 1000))}
                    </IonLabel>
                    {admin ? (
                      <IonIcon
                        onClick={() => handleDelete('signals', dataID)}
                        icon={trash}
                      />
                    ) : null}
                  </div>
                ) : null}
                <SignalCard
                  imageURL={data.imageURL}
                  market={data.market}
                  tps={data.tps}
                  stoploss={data.stoploss}
                  entry={data.entry}
                  risk={data.risk}
                  position={data.position}
                />
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
      <SignalModel
        isSignalModalOpen={isSignalModalOpen}
        setSignalModalOpen={setSignalModalOpen}
      />
    </>
  );
}
export default Signals;
