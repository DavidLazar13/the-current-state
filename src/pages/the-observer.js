import React, { useEffect, useState, useRef } from "react";
import MarqueeComponent from "@/components/MarqueeComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";
import styled from "styled-components";

// Styled container for the marquee display
const MarqueeContainer = styled.div`
    text-transform: uppercase;
    font-weight: bold;
`;

// Styled button for audio control with conditional styling based on visibility
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
  const audioRef = useRef(null);  // Reference for controlling the audio element
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlHidden, setIsControlHidden] = useState(false);

  // Fetch articles based on search criteria
  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?search=${initialSearch}`)
      .then(response => response.json())
      .then(data => {
        setArticles(data.results);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch articles");
        setLoading(false);
        console.error(err);
      });
  }, [initialSearch, initialTag]);

  // Function to split articles into chunks of three for marquee display
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const articleChunks = chunkArray(articles, 3);

  // Toggle audio playback
  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      const shouldPlay = !isPlaying;
      shouldPlay ? audioRef.current.play() : audioRef.current.pause();
      setIsPlaying(shouldPlay);
      setIsControlHidden(shouldPlay);  // Toggle visibility of the control
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FullscreenOnFKeyPress />

      {/* Display chunks of articles in MarqueeComponent with alternating colors */}
      {articleChunks.map((chunk, index) => (
        <MarqueeContainer key={index}>
          <MarqueeComponent
            text={chunk.map(article => article.webTitle).join(" | ")}
            speed={Math.floor(Math.random() * (50 - 40 + 1)) + 40}
            backgroundColor={index % 2 === 0 ? "black" : "white"}
            textColor={index % 2 === 0 ? "white" : "black"}
          />
        </MarqueeContainer>
      ))}

      <audio ref={audioRef} src="/sound/status_of_now_sound.mp3" loop />

      <AudioControl onClick={toggleAudioPlayback} hidden={isControlHidden}>
        {isPlaying ? "Pause Music" : "Play Music"}
      </AudioControl>
    </div>
  );
}

export default Articles;
