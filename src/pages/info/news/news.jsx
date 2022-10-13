import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonLabel,
} from '@ionic/react';
import ExploreContainer from '../../../components/ExploreContainer';
import './news.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { fetchArticles } from '../../../utils/fetchArticles';
import { Puff } from 'react-loader-spinner';

const News = () => {
  const [articles, setArticles] = useState();

  useEffect(() => {
    fetch(
      'https://newsapi.org/v2/everything?q=Cryptocurrency&sortBy=latest&apiKey=014261da83644780b3727be794fb6777'
    )
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
      });
  }, []);

  return (
    <IonPage>
      <IonContent>
        {articles === undefined ? (
          <Puff
            height="50"
            width="50"
            radisu={1}
            color="#fff"
            ariaLabel="puff-loading"
            wrapperStyle={{
              justifyContent: 'center',
              alignContent: 'center',
            }}
            wrapperClass=""
            visible={true}
          />
        ) : (
          articles.map((article, i) => {
            if (i < 20 && article.urlToImage != null)
              return (
                <div key={i}>
                  <IonCard>
                    <img src={article.urlToImage} />
                    <IonCardHeader>
                      <IonCardTitle>{article.title}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {article.description}
                      <br />
                      <br />
                      <div className="checknews">Read News:</div>{' '}
                      <a href={article.url}>{article.url}</a>{' '}
                    </IonCardContent>
                  </IonCard>
                </div>
              );
          })
        )}
      </IonContent>
    </IonPage>
  );
};

export default News;
