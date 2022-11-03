import './message.css';
import { formatRelative } from 'date-fns';
import { IonLabel, IonAvatar, IonIcon } from '@ionic/react';
import { star, pin, trash } from 'ionicons/icons';
import { database } from '../../utils/firebaseConfig';
import { useIonToast } from '@ionic/react';
import { alertOutline, checkmarkCircleOutline } from 'ionicons/icons';
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';

function Message({
  uid,
  profilePic,
  displayMessage,
  username,
  time,
  label,
  isCurrentUser,
  isAdmin,
  displayStar,
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

  const HandleDelete = async () => {
    let dataToDelete = doc(database, 'chat', 'data1');
    let constructedObj = {
      text: displayMessage,
      createdAt: time,
      uid: uid,
      name: username,
      label: label,
      isAdmin: displayStar,
    };
    console.log(constructedObj);
    try {
      await updateDoc(dataToDelete, {
        messages: arrayRemove(constructedObj),
      });

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
    <div className={`mainContainer ${isCurrentUser && 'reverseRow'}`}>
      <div className="pinandavatar">
        {isAdmin ? (
          <div className="messageTools">
            <div onClick={pinIt}>
              <IonIcon className="pinIcon" icon={pin}></IonIcon>
            </div>
            <div onClick={HandleDelete}>
              {' '}
              <IonIcon className="pinIcon" icon={trash}></IonIcon>{' '}
            </div>
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
          {displayStar ? (
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
