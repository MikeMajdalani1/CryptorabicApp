import { IonAvatar, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import './singalCard.css';
import {
  trendingDown,
  trendingUp,
  arrowForward,
  happy,
  sad,
  skull,
} from 'ionicons/icons';
const SignalCard = ({
  marketName,
  tpArray = ['20345', '20345', '20345', '20345'],
  StopLoss,
  risk = 'medium',
  direction = 'short',
  Entry,
  AdminName,
  AdminAvatar,
}) => {
  return (
    <>
      <div className="signalCardContainer">
        <div className="singalCardUser">
          <IonAvatar className="avatarSizes ">
            {' '}
            <img alt="coin" src="assets/joenassar.png" />
          </IonAvatar>

          <div
            className={`singalCardDirection ${
              direction === 'long' ? 'greenish' : 'redish'
            }`}
          >
            <IonIcon
              icon={direction === 'long' ? trendingUp : trendingDown}
            ></IonIcon>
            <IonLabel>{direction === 'long' ? 'Long' : 'Short'}</IonLabel>
          </div>
          <div
            className={`singalCardDirection ${risk === 'low' && 'greenish'} ${
              risk === 'medium' && 'yellowish'
            } ${risk === 'high' && 'redish'}`}
          >
            {risk === 'low' && <IonIcon icon={happy} />}
            {risk === 'medium' && <IonIcon icon={sad} />}
            {risk === 'high' && <IonIcon icon={skull} />}

            <IonLabel>
              {risk === 'low' && 'Low '}
              {risk === 'medium' && 'Medium '}
              {risk === 'high' && 'High '}
            </IonLabel>
          </div>
        </div>
        <div className="singalCardInfo">
          <IonLabel>BTC/USDT</IonLabel>
          <IonLabel className="fixLineHeight">
            {' '}
            <IonLabel style={{ opacity: 0.8 }}>Entry:</IonLabel> 20
          </IonLabel>
          <IonLabel className="fixLineHeight">
            {' '}
            <IonLabel style={{ opacity: 0.8 }}>Stop Loss:</IonLabel> 21
          </IonLabel>
        </div>

        <div className="singalCardTPs">
          <IonLabel>TPs:</IonLabel>
          {tpArray.map((tp, i) => {
            return (
              <>
                <IonLabel className="singalCardTP" key={i}>
                  {tp}
                </IonLabel>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default SignalCard;
