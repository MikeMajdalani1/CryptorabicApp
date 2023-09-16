import './message.css';
import { IonLabel, IonAvatar, IonIcon } from '@ionic/react';
import { star, pin, trash } from 'ionicons/icons';
import { useIonToast } from '@ionic/react';
import { alertOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { formatDate } from '../../utils/functions';
import { pinMessage, deleteMessage } from '../../utils/firebase-functions';

function Message({
  uid,
  imageURL,
  displayMessage,
  username,
  time,
  label,
  isCurrentUser,
  isAdmin,
  displayStar,
}) {
  const [presentToast] = useIonToast();

  const pinIt = async () => {
    const res = await pinMessage(displayMessage, username);
    if (res.success) {
      presentToast({
        message: 'Message Pinned',
        duration: 2000,
        icon: alertOutline,
      });
    } else {
      presentToast({
        message: 'An error has occured',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  const HandleDelete = async () => {
    let constructedObj = {
      text: displayMessage,
      createdAt: time,
      uid: uid,
      name: username,
      label: label,
      isAdmin: displayStar,
      imageURL: imageURL,
    };
    const res = await deleteMessage(constructedObj);
    if (res.success) {
      presentToast({
        message: 'Successfully Deleted',
        duration: 1500,
        icon: checkmarkCircleOutline,
      });
    } else {
      presentToast({
        message: 'Error Updating Data',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  return (
    <div className={`row message-container ${isCurrentUser && 'reversed-row'}`}>
      <div className="message-container__profile">
        {isAdmin ? (
          <div className="message-container__profile__tools">
            <div onClick={pinIt}>
              <IonIcon
                className="message-container__profile__tools__icon"
                icon={pin}
              ></IonIcon>
            </div>
            <div onClick={HandleDelete}>
              {' '}
              <IonIcon
                className="message-container__profile__tools__icon"
                icon={trash}
              ></IonIcon>{' '}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <IonAvatar className="avatar-sizes">
          <img src={imageURL} />
        </IonAvatar>
      </div>

      <div
        className={`message-container__content ${
          isCurrentUser && 'message-container__content--reversed'
        }`}
      >
        <div className={`row ${isCurrentUser && 'reversed-row'}`}>
          <IonLabel className="message-container__content__username">
            {username}{' '}
          </IonLabel>{' '}
          {displayStar ? (
            <IonIcon
              className="message-container__content__icon"
              icon={star}
            ></IonIcon>
          ) : null}
          <IonLabel className="message-container__content__label">
            {' '}
            ({label})
          </IonLabel>
        </div>
        {displayMessage ? (
          <IonLabel className="message-container__content__message">
            {' '}
            {displayMessage}
          </IonLabel>
        ) : null}
        {time?.seconds ? (
          <IonLabel className="message-container__content__label">
            {' '}
            {formatDate(new Date(time?.seconds * 1000))}
          </IonLabel>
        ) : null}
      </div>
    </div>
  );
}
export default Message;
