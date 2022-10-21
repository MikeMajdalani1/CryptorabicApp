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

import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  setDoc,
  limit,
  doc,
  getDocs,
  where,
  onSnapshot,
  limitToLast,
} from 'firebase/firestore';

import { sendSharp, arrowRedoCircleSharp, alertOutline } from 'ionicons/icons';

const Chat = () => {
  const { user, database, presentToast, fetchUserData, name, label, admin } =
    useContext(MainContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState('');

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
      const q = query(collection(database, 'messages'), orderBy('createdAt'));

      const unsub = onSnapshot(q, (res) => {
        setMessages(res.docs.map((snap) => snap.data()));
      });

      return unsub;
    }
  }, [database]);

  useEffect(() => {
    setTimeout(() => {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }, []);

  const fetchPinnedMessage = async () => {
    try {
      const q = query(
        collection(database, 'pinned'),
        orderBy('createdAt'),
        limitToLast(1)
      );

      const unsub = onSnapshot(q, (res) => {
        console.log();
        setPinnedMessage({
          text: res.docs[0].data().text,
          createAt: res.docs[0].data().createAt,
          name: res.docs[0].data().name,
        });
      });

      return unsub;
    } catch (err) {
      console.error(err.message);
      setPinnedMessage({
        text: 'Welcome to the Chat!',
        createAt: '',
        name: 'Admin',
      });
    }
  };
  const handleOnChange = (e) => {
    if (e.target.value === '') {
      setnewMessage('');
    }

    setnewMessage(e.target.value);
  };
  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage === '') {
      return;
    }

    try {
      await setDoc(doc(collection(database, 'messages')), {
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        uid: user.uid,
        name: name,
        label: label,
        isAdmin: admin,
      });
      setnewMessage('');
      console.log('Document Created');

      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.log(error.message);
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
      <div className="pinContainer">
        <IonLabel color="primary">Pinned Message</IonLabel>

        {pinnedMessage.name ? (
          <>
            <div className="subPin">
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
        <div className="chatroom">
          {messages[0] ? (
            messages.map((message, i) => {
              return (
                <div key={i}>
                  <Message
                    key={i}
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
            <div className="loaderSpinner">
              <IonSpinner name="crescent"></IonSpinner>
            </div>
          )}
        </div>
        <div className="bottomList" ref={bottomListRef} />
      </IonContent>

      <div className="messageInputContainer">
        <IonItem>
          <IonInput
            className="messageInput"
            name="message"
            value={newMessage}
            placeholder="Enter a message"
            onIonChange={handleOnChange}
          ></IonInput>
        </IonItem>

        <div onClick={sendMessage}>
          <IonIcon
            className={
              newMessage === '' ? 'iconDisbaled sharpIcon' : 'sharpIcon'
            }
            icon={sendSharp}
          ></IonIcon>
        </div>
      </div>
    </IonPage>
  );
};

export default Chat;
