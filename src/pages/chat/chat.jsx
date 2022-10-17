import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
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
import { formatRelative } from 'date-fns';
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
} from 'firebase/firestore';
import { sendSharp, arrowRedoCircleSharp } from 'ionicons/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState('');
  const dbCollection = collection(database, 'messages');
  const bottomListRef = useRef();
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (database) {
      fetchData();

      const q = query(collection(database, 'messages'), orderBy('createdAt'));

      const unsub = onSnapshot(q, (res) => {
        setMessages(res.docs.map((snap) => snap.data()));
      });
      console.log(messages);
      return unsub;
    }
  }, [database]);

  useEffect(() => {
    setTimeout(() => {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }, []);

  const fetchData = async () => {
    try {
      const q = query(
        collection(database, 'users'),
        where('__name__', '==', user?.uid)
      );
      const doc = await getDocs(q);

      const data = doc.docs[0].data();

      setName(data.username);
      setLabel(data.label);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
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
    const date = serverTimestamp();
    console.log(date);
    try {
      await setDoc(doc(dbCollection), {
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        uid: user.uid,
        name: name,
        label: label,
      });
      setnewMessage('');
      console.log('Document Created');

      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <div className="pinContainer">
        <IonLabel color="primary">Pinned Message</IonLabel>
        <div className="subPin">
          <IonIcon icon={arrowRedoCircleSharp} />
          <IonLabel>
            <IonLabel color="primary">User: </IonLabel> message we we we w e
          </IonLabel>
        </div>
      </div>
      <IonContent>
        <div className="chatroom">
          {messages.map((message, i) => {
            return (
              <div key={i}>
                <Message
                  key={i}
                  displayMessage={message.text}
                  time={message.createdAt}
                  username={message.name}
                  label={message.label}
                  isCurrentUser={user.uid === message.uid}
                />
              </div>
            );
          })}
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
