import React, { useEffect, useState } from 'react';
import MarqueeComponent from "@/components/MarqueeComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";
import styled from 'styled-components';

const MarqueeContainer = styled.div`
  /* Your existing styles here */
  text-transform: uppercase;
    font-weight: bold;
`;

function Articles({ initialSearch = 'global warming OR war OR economic crisis', initialTag = '' }) {
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

  // Function to chunk an array into smaller subarrays of a specified size
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  // Chunk articles into groups of 3
  const articleChunks = chunkArray(articles, 3);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FullscreenOnFKeyPress />
      {articleChunks.map((chunk, index) => {
        // Create a concatenated string for the articles' headlines
        const concatenatedText = chunk.map(article => article.webTitle).join(' | ');

        // Alternate between two background colors for each MarqueeComponent
        const backgroundColor = index % 2 === 0 ? 'black' : 'white';
        const textColor = backgroundColor === 'black' ? 'white' : 'black';

        return (
          <MarqueeContainer key={index}>
            <MarqueeComponent
              key={index}
              text={concatenatedText}
              speed={Math.floor(Math.random() * (50 - 40 + 1)) + 40}
              backgroundColor={backgroundColor}
              textColor={textColor}
              textStyle={{ textTransform: 'uppercase' }}
            />
          </MarqueeContainer>
        );
      })}
    </div>
  );
}

export default Articles;
