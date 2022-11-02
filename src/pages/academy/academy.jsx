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
  IonTextarea,
  IonSkeletonText,
} from '@ionic/react';
import CryptoCard from '../../components/cryptoCard/cryptoCard';

import Header from '../../components/header/header';
import './academy.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import '@ionic/react/css/ionic-swiper.css';
import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useState, useContext } from 'react';
import NewsCard from '../../components/newsCard/newsCard';
import SignalCard from '../../components/signalCard/signalCard';
import { MainContext } from '../../utils/Context';
import {
  logoTiktok,
  logoInstagram,
  caretUp,
  alertOutline,
  closeOutline,
  trendingUp,
  trash,
  newspaper,
  checkmarkCircleOutline,
} from 'ionicons/icons';

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
import { fetchCoins, formatDate } from '../../utils/functions';

const Academy = () => {
  const { database, presentToast, fetchUserData, admin } =
    useContext(MainContext);

  const onlyWidth = useWindowWidth();

  const [coins, setCoins] = useState({});
  const [news, setNews] = useState([]);
  const [signals, setSignals] = useState([]);

  const [numberOfSlidesCoins, setnumberOfSlidesCoins] = useState(2);
  const [numberOfSlidesSignals, setnumberOfSlidesSignals] = useState(2);

  const [isSignalModalOpen, setSignalModalOpen] = useState(false);
  const [isNewslModalOpen, setNewslModalOpen] = useState(false);

  const [SignalInputs, setSignalInputs] = useState({
    market: '',
    stoploss: '',
    risk: 'low',
    position: 'long',
    entry: '',
    tps: ['', '', '', ''],
  });

  const [NewsInputs, setNewsInputs] = useState({
    title: '',
    content: '',
    link: '',
  });

  useEffect(() => {
    if (database) {
      fetchSignals();
    }
  }, [database]);

  useEffect(() => {
    if (database) {
      fetchNews();
    }
  }, [database]);

  useEffect(() => {
    fetchUserData();
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
    } else {
      setnumberOfSlidesCoins(4);
      return;
    }
  }, [onlyWidth]);

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

  const handleNewsChange = (e) => {
    setNewsInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
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

  const fetchNews = async () => {
    try {
      const q = query(
        collection(database, 'news'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      const unsub = onSnapshot(q, (res) => {
        setNews(res.docs);
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
      console.log(signals);

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

  const handleNewsRegiser = async (e) => {
    e.preventDefault();

    if (NewsInputs.title === '' || NewsInputs.content === '') {
      presentToast({
        message: 'Please provide the required inputs',
        duration: 4000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      try {
        await setDoc(doc(collection(database, 'news')), {
          title: NewsInputs.title,
          content: NewsInputs.content,
          link: NewsInputs.link,
          createdAt: serverTimestamp(),
        });
        setNewslModalOpen(false);
        console.log('document created');
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

  const HandleDelete = async (collection, id) => {
    let dataToDelete = doc(database, collection, id);

    try {
      const res = await deleteDoc(dataToDelete);

      presentToast({
        message: 'Successfully Deleted',
        duration: 1500,
        icon: checkmarkCircleOutline,
      });
    } catch (error) {
      console.log('Deleting error' + error.message);
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

          <Swiper slidesPerView={numberOfSlidesSignals} spaceBetween={20}>
            {signals.length !== 0 ? (
              signals.map((signal, i) => {
                const data = signal.data();
                const dataID = signal.id;
                return (
                  <SwiperSlide className="swiperSignal" key={i}>
                    {data.createdAt ? (
                      <div className="signalDateAndTrash">
                        <IonLabel className="signalDate">
                          {formatDate(new Date(data.createdAt.seconds * 1000))}
                        </IonLabel>
                        {admin ? (
                          <IonIcon
                            onClick={() => HandleDelete('signals', dataID)}
                            icon={trash}
                          />
                        ) : null}
                      </div>
                    ) : null}
                    <SignalCard
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

          <div className="seperatorDiv"></div>
          <div className="seperatorDiv"></div>
          <div className="AddSection">
            <IonLabel className="header1">News</IonLabel>
            {admin ? (
              <IonButton
                onClick={() => setNewslModalOpen(true)}
                color="primary"
              >
                Add
              </IonButton>
            ) : (
              <div></div>
            )}
          </div>
          <div className="seperatorDiv"></div>

          {news.length !== 0 ? (
            news.map((newsChild, i) => {
              const data = newsChild.data();
              const dataID = newsChild.id;
              return (
                <div key={i}>
                  {admin && (
                    <div className="newsTrash">
                      <div></div>
                      <IonIcon
                        onClick={() => HandleDelete('news', dataID)}
                        icon={trash}
                      />
                    </div>
                  )}
                  <NewsCard
                    title={data.title}
                    description={data.content}
                    linkURL={data.link}
                    createdAt={data.createdAt}
                  />
                  <div className="seperatorDiv"></div>
                </div>
              );
            })
          ) : (
            <IonSkeletonText
              animated={true}
              style={{ height: '170px', width: '100%' }}
            ></IonSkeletonText>
          )}
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
                * Required Field
                <br />
                <br />
                Please not that in this version of the app, you can't update a
                signal after it is published
              </IonLabel>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={isNewslModalOpen}
        content="container"
        onWillDismiss={() => {
          setNewsInputs({
            title: '',
            content: '',
            link: '',
          });
        }}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setNewslModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="newsModalContainer">
            <div className="RegisterContainer">
              <div className="FormLogoAndText">
                <IonIcon
                  style={{ fontSize: '60px' }}
                  icon={newspaper}
                ></IonIcon>
                <h3>Add News</h3>
              </div>
              <IonItem>
                <div className="formContainer">
                  <IonItem className="border">
                    <IonInput
                      name="title"
                      value={NewsInputs.title}
                      placeholder="* Title"
                      required
                      onIonInput={handleNewsChange}
                    ></IonInput>
                  </IonItem>

                  <IonItem className="border">
                    <IonTextarea
                      value={NewsInputs.content}
                      name="content"
                      placeholder="* Content"
                      autoGrow
                      onIonChange={handleNewsChange}
                    ></IonTextarea>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      value={NewsInputs.link}
                      name="link"
                      placeholder="Link"
                      onIonInput={handleNewsChange}
                    ></IonInput>
                  </IonItem>

                  <IonButton size="large" onClick={handleNewsRegiser}>
                    Add News
                  </IonButton>
                </div>
              </IonItem>

              <IonLabel class="disclaimer">
                * Required Field
                <br />
                <br />
                Please not that in this version of the app, you can't update
                your news after it is published
              </IonLabel>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Academy;
