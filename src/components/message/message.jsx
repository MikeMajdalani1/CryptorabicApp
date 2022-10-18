import './message.css';
import { formatRelative } from 'date-fns';
import { IonLabel, IonAvatar, IonIcon } from '@ionic/react';
import { star, pin } from 'ionicons/icons';
import { database } from '../../utils/firebaseConfig';
import { useIonToast } from '@ionic/react';
import { alertOutline } from 'ionicons/icons';
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';

function Message({
  profilePic,
  displayMessage,
  username,
  time,
  label,
  isCurrentUser,
  isAdmin,
}) {
  const [presentToast] = useIonToast();
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

  const pinIt = async () => {
    try {
      await setDoc(doc(collection(database, 'pinned')), {
        text: displayMessage,
        createdAt: serverTimestamp(),
        name: username,
      });
      console.log('Document Created');
      presentToast({
        message: 'Message Pinned',
        duration: 2000,
        icon: alertOutline,
      });
    } catch (error) {
      console.log(error.message);
      presentToast({
        message: 'An error has occured',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  return (
    <div className={`mainContainer ${isCurrentUser && 'reverseRow'}`}>
      <div className="pinandavatar">
        {isAdmin ? (
          <div onClick={pinIt}>
            <IonIcon className="pinIcon" icon={pin}></IonIcon>
          </div>
        ) : (
          <div></div>
        )}

        <IonAvatar className="avatarSizes">
          <img alt="Silhouette of a person's head" src="assets/joenassar.png" />
        </IonAvatar>
      </div>

      <div className={`messageContainer ${isCurrentUser && 'justifyEnd'}`}>
        <div className={`flexRow ${isCurrentUser && 'reverseRow'}`}>
          <IonLabel className="usernameStyles">{username} </IonLabel>{' '}
          {isAdmin ? (
            <IonIcon className="starIcon" icon={star}></IonIcon>
          ) : null}
          <IonLabel className="labelStyles"> ({label})</IonLabel>
        </div>
        {displayMessage ? (
          <IonLabel className="displayMessage"> {displayMessage}</IonLabel>
        ) : null}
        {time?.seconds ? (
          <IonLabel className="labelStyles">
            {' '}
            {formatDate(new Date(time?.seconds * 1000))}
          </IonLabel>
        ) : null}
      </div>
    </div>
  );
}
export default Message;
