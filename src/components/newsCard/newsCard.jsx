import {
  IonContent,
  IonPage,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/react';

import './newsCard.css';

import { useEffect, useState } from 'react';

const NewsCard = () => {
  const [articles, setArticles] = useState();

  useEffect(() => {
    fetch(
      'https://newsapi.org/v2/everything?q=Cryptocurrency&sortBy=latest&apiKey=014261da83644780b3727be794fb6777'
    )
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
      });
    console.log(articles);
  }, []);

  return articles === undefined ? (
    <IonSpinner name="crescent"></IonSpinner>
  ) : (
    // <Puff
    //   height="50"
    //   width="50"
    //   radisu={1}
    //   color="#fff"
    //   ariaLabel="puff-loading"
    //   wrapperStyle={{
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //   }}
    //   wrapperClass=""
    //   visible={true}
    // />
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
  );
};

export default NewsCard;
