export const fetchArticles = async () => {
  //newsapi.org/v2/everything?q=Cryptocurrency&sortBy=popularity&apiKey=014261da83644780b3727be794fb6777
  //newsapi.org/v2/top-headlines?q=Cryptocurrency&sortBy=popularity&apiKey=014261da83644780b3727be794fb6777

  const fetcher = async (url) => {
    const res = await fetch(url);
    const json = await res.json();

    return json.articles;
  };

  const articles = await fetcher(
    "https://newsapi.org/v2/everything?q=Cryptocurrency&sortBy=latest&apiKey=014261da83644780b3727be794fb6777"
  );

  return articles;
};
