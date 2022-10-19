import {
  IonContent,
  IonPage,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/react';

import './newsCard.css';

const NewsCard = ({ imageURL, title, description, linkURL }) => {
  return (
    <IonCard>
      {imageURL && <img src={imageURL} />}
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {description}
        <br />
        <br />
        {linkURL && (
          <div>
            <div className="checknews">Link:</div>
            <a href={linkURL}>{linkURL}</a>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default NewsCard;
