import { IonAvatar, IonIcon, IonLabel } from '@ionic/react';
import './signal-card.css';
import { trendingDown, trendingUp, happy, sad, skull } from 'ionicons/icons';
const SignalCard = ({
  market,
  tps = ['20345', '20345', '20345', '20345'],
  stoploss,
  risk = 'medium',
  position = 'short',
  entry,
  imageURL,
}) => {
  return (
    <div className="signal-card">
      <div className="signal-card__user">
        <IonAvatar className="avatar-sizes">
          {' '}
          <img src={imageURL} />
        </IonAvatar>

        <div
          className={`signal-card__position ${
            position === 'long' ? 'greenish' : 'redish'
          }`}
        >
          <IonIcon
            icon={position === 'long' ? trendingUp : trendingDown}
          ></IonIcon>
          <IonLabel>{position === 'long' ? 'Long' : 'Short'}</IonLabel>
        </div>
        <div
          className={`signal-card__position ${risk === 'low' && 'greenish'} ${
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
      <div className="signal-card__info">
        <IonLabel>{market}</IonLabel>
        <IonLabel className="signal-card__info__label">
          {' '}
          <IonLabel style={{ opacity: 0.8 }}>Entry:</IonLabel> {entry}
        </IonLabel>
        <IonLabel className="signal-card__info__label">
          {' '}
          <IonLabel style={{ opacity: 0.8 }}>Stop Loss:</IonLabel> {stoploss}
        </IonLabel>
      </div>

      <div className="signal-card__tps">
        <IonLabel>TPs:</IonLabel>
        {tps.map((tp, i) => {
          return (
            <IonLabel className="signal-card__tps__label" key={i}>
              {tp}
            </IonLabel>
          );
        })}
      </div>
    </div>
  );
};
export default SignalCard;
