import { IonAvatar, IonLabel } from '@ionic/react';
import './crypto-card.css';

function CryptoCard({ coinImage, coinName, coinAbrev, price, marketChange }) {
  return (
    <>
      <div className="crypto-card">
        <div className="crypto-card__header">
          <IonAvatar className="avatar-sizes">
            {' '}
            <img alt="coin" src={coinImage} />
          </IonAvatar>
          <div className="crypto-card__header__content">
            <IonLabel className="crypto-card__header__content__abbrevation">
              {coinAbrev}
            </IonLabel>
            <IonLabel className="crypto-card__header__content__name">
              {coinName}
            </IonLabel>
          </div>
        </div>
        <div></div>
        <div className="crypto-card__info">
          <IonLabel
            style={{ opacity: 0.7 }}
            className="crypto-card__info__label"
          >
            Price:
          </IonLabel>
          <IonLabel className="crypto-card__info__label">${price}</IonLabel>
        </div>
        <div className="crypto-card__info">
          {' '}
          <IonLabel
            style={{ opacity: 0.7 }}
            className="crypto-card__info__label"
          >
            24h:
          </IonLabel>
          <IonLabel
            color={marketChange < 0 ? 'danger' : 'success'}
            className="crypto-card__info__label"
          >
            {marketChange}%
          </IonLabel>
        </div>
      </div>
    </>
  );
}

export default CryptoCard;
