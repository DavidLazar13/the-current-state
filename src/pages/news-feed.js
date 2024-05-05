import React, { useEffect, useState } from 'react';
import MarqueeComponent from "@/components/MarqueeComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";

function Articles({ initialSearch = 'war', initialTag = '' }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?search=${initialSearch}`)
      .then(response => response.json())
      .then(data => {
        setArticles(data.results);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch articles');
        setLoading(false);
        console.error(err);
      });
  }, [initialSearch, initialTag]);



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FullscreenOnFKeyPress/>
      <ul>
        {articles.map((article, index) => {
          const backgroundColor = index % 2 === 0 ? 'black' : 'white';
          const textColor = backgroundColor === 'black' ? 'white' : 'black';
          return (
            <div>
              <MarqueeComponent
                key={article.id}
                text={article.webTitle}
                speed={Math.floor(Math.random() * (50 - 40 + 1)) + 40}
                backgroundColor={backgroundColor}
                textColor={textColor}
              />
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default Articles;
