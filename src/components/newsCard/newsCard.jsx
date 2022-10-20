import {
  IonContent,
  IonPage,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/react';
import { formatRelative } from 'date-fns';
import './newsCard.css';

const NewsCard = ({ imageURL, title, description, linkURL, createdAt }) => {
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
        <br />

        {createdAt ? formatDate(new Date(createdAt?.seconds * 1000)) : null}
      </IonCardContent>
    </IonCard>
  );
};

export default NewsCard;
