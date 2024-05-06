import React, { useEffect, useState, useRef } from "react";
import MarqueeComponent from "@/components/MarqueeComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";
import styled from "styled-components";

const MarqueeContainer = styled.div`
    text-transform: uppercase;
    font-weight: bold;
`;

const AudioControl = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  opacity: ${({ hidden }) => (hidden ? 0 : 1)};
  visibility: ${({ hidden }) => (hidden ? "hidden" : "visible")};
  transition: visibility 0.2s, opacity 0.2s;
`;

function Articles({ initialSearch = "global warming OR war OR economic crisis OR artificial intelligence", initialTag = "" }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null); // Reference for controlling the audio element
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlHidden, setIsControlHidden] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?search=${initialSearch}`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch articles");
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

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsControlHidden(false); // Show control if paused
      } else {
        audioRef.current.play();
        setIsControlHidden(true); // Hide control when playing
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FullscreenOnFKeyPress />

      {articleChunks.map((chunk, index) => {
        // Create a concatenated string for the articles' headlines
        const concatenatedText = chunk.map((article) => article.webTitle).join(" | ");

        // Alternate between two background colors for each MarqueeComponent
        const backgroundColor = index % 2 === 0 ? "black" : "white";
        const textColor = backgroundColor === "black" ? "white" : "black";

        return (
          <MarqueeContainer key={index}>
            <MarqueeComponent
              text={concatenatedText}
              speed={Math.floor(Math.random() * (50 - 40 + 1)) + 40}
              backgroundColor={backgroundColor}
              textColor={textColor}
              textStyle={{ textTransform: "uppercase" }}
            />
          </MarqueeContainer>
        );
      })}

      {/* Audio Element for Background Music */}
      <audio ref={audioRef} src="/sound/the-status-of-now.mp3" loop />

      {/* Audio Control Button */}
      <AudioControl onClick={toggleAudioPlayback} hidden={isControlHidden}>
        {isPlaying ? "Pause Music" : "Play Music"}
      </AudioControl>
    </div>
  );
}

export default Articles;
