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
import { useState, useEffect, useRef } from 'react';

import { app, database } from '../../utils/firebaseConfig';

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
import { useIonToast } from '@ionic/react';
import { sendSharp, arrowRedoCircleSharp, alertOutline } from 'ionicons/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState('');
  const dbCollection = collection(database, 'messages');
  const bottomListRef = useRef();
  const auth = getAuth();
  const [presentToast] = useIonToast();

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [admin, setAdmin] = useState('');
  const [pinnedMessage, setPinnedMessage] = useState({
    createdAt: '',
    text: '',
    name: '',
  });
  useEffect(() => {
    if (database) {
      fetchUserData();
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

  const fetchUserData = async () => {
    try {
      const q = query(
        collection(database, 'users'),
        where('__name__', '==', user?.uid)
      );
      const doc = await getDocs(q);

      const data = doc.docs[0].data();

      setName(data.username);
      setLabel(data.label);
      setAdmin(data.isAdmin);
    } catch (err) {
      console.error(err.message);
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

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
      await setDoc(doc(dbCollection), {
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
