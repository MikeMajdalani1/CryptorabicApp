import './message.css';
import { formatRelative } from 'date-fns';
import { IonLabel, IonAvatar } from '@ionic/react';
function Message({ profilePic, displayMessage, username, time, label }) {
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
    <>
      <div className="mainContainer">
        <IonAvatar className="avatarSizes">
          <img alt="Silhouette of a person's head" src="assets/joenassar.png" />
        </IonAvatar>
        <div className="messageContainer">
          <IonLabel className="usernameStyles">{username}</IonLabel>
          <IonLabel className="labelStyles"> {label}</IonLabel>
          <IonLabel className="displayMessage">
            {' '}
            {displayMessage}
            {/*  {formatDate(new Date(time.seconds * 1000))} */}
          </IonLabel>
        </div>
      </div>
    </>
  );
}
export default Message;
