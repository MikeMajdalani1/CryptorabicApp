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
  market,
  tps = ['20345', '20345', '20345', '20345'],
  stoploss,
  risk = 'medium',
  position = 'short',
  entry,
  adminAvatar,
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
            className={`singalCardposition ${
              position === 'long' ? 'greenish' : 'redish'
            }`}
          >
            <IonIcon
              icon={position === 'long' ? trendingUp : trendingDown}
            ></IonIcon>
            <IonLabel>{position === 'long' ? 'Long' : 'Short'}</IonLabel>
          </div>
          <div
            className={`singalCardposition ${risk === 'low' && 'greenish'} ${
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
          <IonLabel>{market}</IonLabel>
          <IonLabel className="fixLineHeight">
            {' '}
            <IonLabel style={{ opacity: 0.8 }}>Entry:</IonLabel> {entry}
          </IonLabel>
          <IonLabel className="fixLineHeight">
            {' '}
            <IonLabel style={{ opacity: 0.8 }}>Stop Loss:</IonLabel> {stoploss}
          </IonLabel>
        </div>

        <div className="singalCardTPs">
          <IonLabel>TPs:</IonLabel>
          {tps.map((tp, i) => {
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
