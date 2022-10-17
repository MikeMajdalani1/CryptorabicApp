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
  onSnapshot,
} from 'firebase/firestore';
import { sendSharp } from 'ionicons/icons';
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState('');
  const dbCollection = collection(database, 'messages');
  const bottomListRef = useRef();
  useEffect(() => {
    if (database) {
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
      <IonContent>
        <div className="chatroom">
          {messages.map((message, i) => {
            return (
              <div key={i}>
                <Message
                  key={i}
                  displayMessage={message.text}
                  time={message.createdAt}
                  username="Mike"
                  label="Hero"
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
