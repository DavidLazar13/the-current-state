import React, { useEffect, useState } from 'react';

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
      <ul>
        {articles.map(article => (
          <li key={article.id}>{article.webTitle}</li>
        ))}
      </ul>
    </div>
  );
}

export default Articles;
