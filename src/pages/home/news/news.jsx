import { useEffect, useState, useContext } from 'react';
import { IonIcon, IonLabel, IonButton, IonSkeletonText } from '@ionic/react';
import { MainContext } from '../../../utils/Context';
import NewsModal from './news-modal/news-modal';
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { deleteDocument } from '../../../utils/firebase-functions';
import { alertOutline, trash, checkmarkCircleOutline } from 'ionicons/icons';
import NewsCard from '../../../components/news-card/news-card';
function News() {
  const [news, setNews] = useState([]);
  const [isNewslModalOpen, setNewslModalOpen] = useState(false);
  const { database, admin, presentToast } = useContext(MainContext);

  useEffect(() => {
    if (database) {
      fetchNews();
    }
  }, [database]);

  const handleDelete = async (collection, id) => {
    const res = await deleteDocument(collection, id);
    if (res.success) {
      presentToast({
        message: 'Successfully Deleted',
        duration: 1500,
        icon: checkmarkCircleOutline,
      });
    } else {
      presentToast({
        message: 'Error Deleting Data',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  const fetchNews = async () => {
    try {
      const q = query(
        collection(database, 'news'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      const unsub = onSnapshot(q, (res) => {
        setNews(res.docs);
      });

      return unsub;
    } catch (err) {
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 2000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };
  return (
    <>
      <div className="home__section">
        <IonLabel className="home__header">News</IonLabel>
        {admin ? (
          <IonButton onClick={() => setNewslModalOpen(true)} color="primary">
            Add
          </IonButton>
        ) : (
          <div></div>
        )}
      </div>
      <div className="seperator"></div>
      {news.length !== 0 ? (
        news.map((newsChild, i) => {
          const data = newsChild.data();
          const dataID = newsChild.id;
          return (
            <div key={i}>
              {admin && (
                <div className="home__section__trash">
                  <div></div>
                  <IonIcon
                    onClick={() => handleDelete('news', dataID)}
                    icon={trash}
                  />
                </div>
              )}
              <NewsCard
                imageURL={data.imageURL}
                title={data.title}
                description={data.content}
                linkURL={data.link}
                createdAt={data.createdAt}
              />
              <div className="seperator"></div>
            </div>
          );
        })
      ) : (
        <IonSkeletonText
          animated={true}
          style={{ height: '170px', width: '100%' }}
        ></IonSkeletonText>
      )}
      <NewsModal
        isNewslModalOpen={isNewslModalOpen}
        setNewslModalOpen={setNewslModalOpen}
      />
    </>
  );
}
export default News;
