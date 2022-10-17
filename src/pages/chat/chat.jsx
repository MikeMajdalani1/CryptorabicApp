import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonLabel,
  IonPage,
} from '@ionic/react';
import Message from '../../components/message/message';
import Header from '../../components/header/header';
import './chat.css';
import { useState, useEffect } from 'react';
import { formatRelative } from 'date-fns';
import { database } from '../../utils/firebaseConfig';
import {
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
const Chat = () => {
  const collectionDb = collection(database, 'messages');
  const [messages, setMessages] = useState([]);
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

  const fetchData = async () => {
    try {
      const q = query(
        collection(database, 'messages'),
        orderBy('createdAt'),
        limit(200)
      );
      const doc = await getDocs(q);
      console.log(doc);
      const data = doc.docs[0].data();
      console.log(data);
      setMessages(data);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };
  useEffect(() => {
    if (database) {
      const q = query(collection(database, 'messages'), orderBy('createdAt'));

      const unsub = onSnapshot(q, (res) => {
        setMessages(res.docs.map((snap) => snap.data().text));
      });
      console.log(messages);
      return unsub;
    }
  }, [database]);

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <div className="chatroom">
          {messages.map((message, i) => {
            console.log(i);
            return (
              <div key={i}>
                <Message
                  key={i}
                  displayMessage={message}
                  username="Mike"
                  label="Hero"
                />
              </div>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Chat;
