import {
  IonSkeletonText,
  IonContent,
  IonHeader,
  IonSpinner,
  IonLabel,
  IonPage,
  IonItem,
  IonInput,
  IonIcon,
} from '@ionic/react';
import Message from '../../components/message/message';
import Header from '../../components/header/header';
import './chat.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { MainContext } from '../../utils/Context';
import { sendMessage } from '../../utils/firebase-functions';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limitToLast,
  Timestamp,
} from 'firebase/firestore';

import { sendSharp, arrowRedoCircleSharp, alertOutline } from 'ionicons/icons';

const Chat = () => {
  const {
    user,
    database,
    presentToast,
    fetchUserData,
    name,
    label,
    imageURL,
    admin,
  } = useContext(MainContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState('');
  const [stopScroll, setSetopScroll] = useState(false);
  const bottomListRef = useRef();

  const [pinnedMessage, setPinnedMessage] = useState({
    createdAt: '',
    text: '',
    name: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (database) {
      fetchPinnedMessage();
      const q = query(collection(database, 'chat'));
      const unsub = onSnapshot(q, (res) => {
        setMessages(res.docs.map((snap) => snap.data().messages));
      });
      return unsub;
    }
  }, [database]);

  //This useEffect is responsible of scrolling down to the last message only once
  useEffect(() => {
    if (messages.length !== 0 && !stopScroll) {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
      setSetopScroll(true);
    }
  }, [messages]);

  //function to fetch pinned message
  const fetchPinnedMessage = async () => {
    try {
      const q = query(
        collection(database, 'pinned'),
        orderBy('createdAt'),
        limitToLast(1)
      );
      const unsub = onSnapshot(q, (res) => {
        if (!res.empty) {
          const data = res.docs[0].data();
          setPinnedMessage({
            text: data.text,
            createAt: data.createAt,
            name: data.name,
          });
        }
      });
      return unsub;
    } catch (err) {
      setPinnedMessage({
        text: 'Welcome to the Chat!',
        createAt: '',
        name: 'Admin',
      });
    }
  };

  //function to handle input change
  const handleOnChange = (e) => {
    if (e.target.value === '') {
      setnewMessage('');
    }
    setnewMessage(e.target.value);
  };

  //function to send a message to the chat
  const sendMessageInput = async (e) => {
    e.preventDefault();
    if (newMessage === '') {
      return;
    }
    setnewMessage('');
    const messageData = {
      text: newMessage.trim(),
      createdAt: Timestamp.now(),
      uid: user.uid,
      name: name,
      label: label,
      isAdmin: admin,
      imageURL: imageURL,
    };
    const res = await sendMessage(messageData);
    if (res.success) {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <div className="pin-container">
        <IonLabel color="primary">Pinned Message</IonLabel>

        {pinnedMessage.name ? (
          <>
            <div className="pin-container__content">
              <IonIcon icon={arrowRedoCircleSharp} />
              <IonLabel>
                <IonLabel color="primary">{pinnedMessage.name}: </IonLabel>{' '}
                {pinnedMessage.text}
              </IonLabel>
            </div>
          </>
        ) : (
          <IonSkeletonText
            animated={true}
            style={{ height: '20px', width: '40%' }}
          ></IonSkeletonText>
        )}
      </div>
      <IonContent>
        <div className="chatroom_container">
          {messages[0] ? (
            messages[0].map((message, i) => {
              return (
                <div key={i}>
                  <Message
                    key={i}
                    imageURL={message.imageURL}
                    uid={message.uid}
                    displayMessage={message.text}
                    time={message.createdAt}
                    username={message.name}
                    label={message.label}
                    isAdmin={admin}
                    isCurrentUser={user.uid === message.uid}
                    displayStar={message.isAdmin}
                  />
                </div>
              );
            })
          ) : (
            <div className="chatroom_container__spinner">
              <IonSpinner name="crescent"></IonSpinner>
            </div>
          )}
        </div>
        <div className="chatroom_container__bottom" ref={bottomListRef} />
      </IonContent>

      <div className="send-message-container">
        <IonItem>
          <IonInput
            className="send-message-container__input"
            name="message"
            value={newMessage}
            placeholder="Enter a message"
            onIonChange={handleOnChange}
          ></IonInput>
        </IonItem>

        <div onClick={sendMessageInput}>
          <IonIcon
            className={
              newMessage === ''
                ? 'send-message-container__icon--disabled send-message-container__icon'
                : 'send-message-container__icon'
            }
            icon={sendSharp}
          ></IonIcon>
        </div>
      </div>
    </IonPage>
  );
};

export default Chat;
