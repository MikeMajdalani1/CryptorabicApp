import {
  IonContent,
  IonHeader,
  IonLabel,
  IonFab,
  IonPage,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonButton,
  IonModal,
  IonToolbar,
  IonButtons,
  IonItem,
  IonInput,
  IonRadioGroup,
  IonList,
  IonRadio,
  IonSpinner,
} from '@ionic/react';
import CryptoCard from '../../components/cryptoCard/cryptoCard';
import { formatRelative } from 'date-fns';
import Header from '../../components/header/header';
import './academy.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useState } from 'react';
import NewsCard from '../../components/newsCard/newsCard';
import SignalCard from '../../components/signalCard/signalCard';
import {
  logoTiktok,
  logoInstagram,
  caretUp,
  alertOutline,
  closeOutline,
  trendingUp,
  trash,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { useIonToast } from '@ionic/react';
import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  setDoc,
  limit,
  doc,
  getDocs,
  where,
  onSnapshot,
  limitToLast,
  deleteDoc,
} from 'firebase/firestore';
import { database } from '../../utils/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const Academy = () => {
  const onlyWidth = useWindowWidth();
  const [numberOfSlides, setnumberOfSlides] = useState(2);
  const URL =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20';
  const [admin, setAdmin] = useState('');
  const [coins, setCoins] = useState({});
  const [presentToast] = useIonToast();
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [isSignalModalOpen, setSignalModalOpen] = useState(false);

  const [signals, setSignals] = useState([]);

  const [SignalInputs, setSignalInputs] = useState({
    market: '',
    stoploss: '',
    risk: 'low',
    position: 'long',
    entry: '',
    tps: ['', '', '', ''],
  });

  useEffect(() => {
    if (database) {
      fetchSignals();
    }
  }, [database]);

  useEffect(() => {
    fetchUserData();
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

  const formatDate = (date) => {
    let formattedDate = '';
    if (date) {
      // Convert the date in words relative to the current date
      formattedDate = formatRelative(date, new Date());
      // Uppercase the first letter
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  };

  const handlePositionChange = (e) => {
    setSignalInputs((previousState) => ({
      ...previousState,
      position: e.target.value,
    }));
  };
  const handleRiskChange = (e) => {
    setSignalInputs((previousState) => ({
      ...previousState,
      risk: e.target.value,
    }));
  };

  const handleSignalChange = (e) => {
    setSignalInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleTPChange = (e, index) => {
    setSignalInputs((previousState) => ({
      ...previousState,
      tps: SignalInputs.tps.map((tp, i) => {
        if (i === index) return e.target.value;
        return tp;
      }),
    }));
  };
  const fetcher = async (url) => {
    const res = await fetch(url);
    const json = await res.json();

    setCoins(json);

    return json;
  };

  const fetchUserData = async () => {
    try {
      const q = query(
        collection(database, 'users'),
        where('__name__', '==', user?.uid)
      );
      const doc = await getDocs(q);

      const data = doc.docs[0].data();

      setAdmin(data.isAdmin);
    } catch (err) {
      console.error(err.message);
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

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
      console.error(err.message);
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  const handleSignalRegister = async (e) => {
    e.preventDefault();
    if (SignalInputs.market === '') {
      presentToast({
        message: 'The market input is required!',
        duration: 4000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      try {
        await setDoc(doc(collection(database, 'signals')), {
          market: SignalInputs.market,
          createdAt: serverTimestamp(),
          stoploss:
            SignalInputs.stoploss === ''
              ? 'Not Specified'
              : SignalInputs.stoploss,
          entry:
            SignalInputs.entry === '' ? 'Not Specified' : SignalInputs.entry,
          tps:
            SignalInputs.tps[0] === ''
              ? ['Not Specifed', '', '', '']
              : SignalInputs.tps,
          risk: SignalInputs.risk,
          position: SignalInputs.position,
        });
        setSignalModalOpen(false);

        console.log('Document Created');
      } catch (error) {
        console.log(error.message);
        presentToast({
          message: 'An Error has occured, restart the app',
          duration: 2000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    }
  };

  const HandleSignalDelete = async (id) => {
    let dataToDelete = doc(database, 'signals', id);

    try {
      const res = await deleteDoc(dataToDelete);

      console.log(res);
      presentToast({
        message: 'Signal Successfully Updated',
        duration: 1500,
        icon: checkmarkCircleOutline,
      });
    } catch (error) {
      console.log('Deleting signal error' + error.message);
      presentToast({
        message: 'Error Updating Data',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
          <IonFabButton color="dark">
            <IonIcon icon={caretUp}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton color="light">
              <IonIcon icon={logoTiktok}></IonIcon>
            </IonFabButton>
            <IonFabButton color="light">
              <IonIcon icon={logoInstagram}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <div className="newsContainer">
          <IonLabel className="header1">Popular Coins</IonLabel>
          <div className="seperatorDiv"></div>

          <Swiper slidesPerView={numberOfSlides} spaceBetween={20}>
            {coins &&
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
              })}
          </Swiper>
          <div className="seperatorDiv"></div>
          <div className="seperatorDiv"></div>

          <div className="AddSection">
            <IonLabel className="header1">Signals</IonLabel>

            {admin ? (
              <IonButton
                onClick={() => setSignalModalOpen(true)}
                color="primary"
              >
                Add
              </IonButton>
            ) : (
              <div></div>
            )}
          </div>

          <div className="seperatorDiv"></div>
          <Swiper slidesPerView={1} spaceBetween={20}>
            {signals
              ? signals.map((signal, i) => {
                  const data = signal.data();
                  const dataID = signal.id;
                  return (
                    <>
                      <SwiperSlide className="swiperSignal" key={i}>
                        {data.createdAt ? (
                          <div className="signalDateAndTrash">
                            <IonLabel className="signalDate">
                              {formatDate(
                                new Date(data.createdAt.seconds * 1000)
                              )}
                            </IonLabel>
                            <IonIcon
                              onClick={() => HandleSignalDelete(dataID)}
                              icon={trash}
                            />
                          </div>
                        ) : null}
                        <SignalCard
                          key={i}
                          market={data.market}
                          tps={data.tps}
                          stoploss={data.stoploss}
                          entry={data.entry}
                          risk={data.risk}
                          position={data.position}
                        />
                      </SwiperSlide>
                    </>
                  );
                })
              : null}
          </Swiper>

          <div className="seperatorDiv"></div>
          <div className="seperatorDiv"></div>
          <div className="AddSection">
            <IonLabel className="header1">News</IonLabel>
            {admin ? <IonButton color="primary">Add</IonButton> : <div></div>}
          </div>
          <div className="seperatorDiv"></div>
          <NewsCard title="hello" description="hello oe " linkURL="sas" />
        </div>
      </IonContent>

      <IonModal
        isOpen={isSignalModalOpen}
        content="container"
        onWillDismiss={() =>
          setSignalInputs({
            market: '',
            stoploss: '',
            risk: 'low',
            position: 'long',
            entry: '',
            tps: ['', '', '', ''],
          })
        }
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setSignalModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="signalModalContainer">
            <div className="RegisterContainer">
              <div className="FormLogoAndText">
                <IonIcon
                  style={{ fontSize: '60px' }}
                  icon={trendingUp}
                ></IonIcon>
                <h3>Add a signal</h3>
              </div>
              <IonItem>
                <div className="formContainer">
                  <IonItem className="border">
                    <IonInput
                      name="market"
                      value={SignalInputs.market}
                      placeholder="* Market"
                      required
                      onIonInput={handleSignalChange}
                    ></IonInput>
                  </IonItem>
                  <IonList>
                    <IonRadioGroup
                      allowEmptySelection={false}
                      onIonChange={handlePositionChange}
                      value={SignalInputs.position}
                    >
                      <IonItem>
                        <IonLabel style={{ lineHeight: '25px' }}>
                          Long Position
                        </IonLabel>
                        <IonRadio slot="end" value="long"></IonRadio>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Short Position</IonLabel>
                        <IonRadio slot="end" value="short"></IonRadio>
                      </IonItem>
                    </IonRadioGroup>
                  </IonList>
                  <IonItem className="border">
                    <IonInput
                      value={SignalInputs.entry}
                      name="entry"
                      placeholder="Entry Price"
                      required
                      type="number"
                      onIonInput={handleSignalChange}
                    ></IonInput>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      value={SignalInputs.stoploss}
                      name="stoploss"
                      type="number"
                      placeholder="Stop Loss"
                      required
                      onIonInput={handleSignalChange}
                    ></IonInput>
                  </IonItem>

                  <IonList>
                    <IonRadioGroup
                      allowEmptySelection={false}
                      value={SignalInputs.risk}
                      onIonChange={handleRiskChange}
                    >
                      <IonItem>
                        <IonLabel>Low Risk</IonLabel>
                        <IonRadio slot="end" value="low"></IonRadio>
                      </IonItem>

                      <IonItem>
                        <IonLabel>Medium Risk</IonLabel>
                        <IonRadio slot="end" value="medium"></IonRadio>
                      </IonItem>

                      <IonItem>
                        <IonLabel style={{ lineHeight: '25px' }}>
                          High Risk
                        </IonLabel>
                        <IonRadio slot="end" value="high"></IonRadio>
                      </IonItem>
                    </IonRadioGroup>
                  </IonList>
                  <div className="listofTps">
                    <IonItem className="border">
                      <IonInput
                        value={SignalInputs.tps[0]}
                        type="number"
                        placeholder="TP1"
                        required
                        onIonInput={(e) => handleTPChange(e, 0)}
                      ></IonInput>
                    </IonItem>
                    <IonItem className="border">
                      <IonInput
                        value={SignalInputs.tps[1]}
                        type="number"
                        placeholder="TP2"
                        onIonInput={(e) => handleTPChange(e, 1)}
                      ></IonInput>
                    </IonItem>
                    <IonItem className="border">
                      <IonInput
                        value={SignalInputs.tps[2]}
                        type="number"
                        placeholder="TP3"
                        onIonInput={(e) => handleTPChange(e, 2)}
                      ></IonInput>
                    </IonItem>
                    <IonItem className="border">
                      <IonInput
                        value={SignalInputs.tps[3]}
                        type="number"
                        placeholder="TP4"
                        onIonInput={(e) => handleTPChange(e, 3)}
                      ></IonInput>
                    </IonItem>
                  </div>

                  <IonButton size="large" onClick={handleSignalRegister}>
                    Add Signal
                  </IonButton>
                </div>
              </IonItem>
              <IonLabel class="disclaimer">
                Please not that in this version of the app, you can't update a
                signal after it is published
              </IonLabel>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Academy;