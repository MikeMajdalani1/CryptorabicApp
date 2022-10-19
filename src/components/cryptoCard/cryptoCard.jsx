import { IonAvatar, IonLabel } from '@ionic/react';
import './cryptoCard.css';

function CryptoCard({ coinImage, coinName, coinAbrev, price, marketChange }) {
  return (
    <>
      <div className="cryptoCardContainer">
        <div className="cryptoCardLogoAndImage">
          <IonAvatar className="avatarSizes ">
            {' '}
            <img alt="coin" src={coinImage} />
          </IonAvatar>
          <div className="cryptoCardCoinID">
            <IonLabel className="cryptoCardAbbrev">{coinAbrev}</IonLabel>
            <IonLabel className="cryptoCardName">{coinName}</IonLabel>
          </div>
        </div>
        <div></div>
        <div className="cryptoCardInfoRow">
          <IonLabel style={{ opacity: 0.7 }} className="FontSizeMod">
            Price:
          </IonLabel>
          <IonLabel className="FontSizeMod">${price}</IonLabel>
        </div>
        <div className="cryptoCardInfoRow">
          {' '}
          <IonLabel style={{ opacity: 0.7 }} className="FontSizeMod">
            24h:
          </IonLabel>
          <IonLabel
            color={marketChange < 0 ? 'danger' : 'success'}
            className="FontSizeMod"
          >
            {marketChange}%
          </IonLabel>
        </div>
      </div>
    </>
  );
}

export default CryptoCard;
