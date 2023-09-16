import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/react';
import { formatDate } from '../../utils/functions';
import './news-card.css';

const NewsCard = ({ imageURL, title, description, linkURL, createdAt }) => {
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
            <div className="news-card__link">Link:</div>
            <a href={linkURL}>{linkURL}</a>
          </div>
        )}
        <br />

        {createdAt ? formatDate(new Date(createdAt?.seconds * 1000)) : null}
      </IonCardContent>
    </IonCard>
  );
};

export default NewsCard;
