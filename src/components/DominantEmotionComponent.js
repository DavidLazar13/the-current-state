import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

const FullScreenContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HiddenImagesContainer = styled.div`
    display: none;
`;

const GenderComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");

  const emotionImages = {
    angry: { src: "/emotions/ANGRY/ANGRY_01.JPG", width: 1920, height: 1080 },
    disgust: { src: "/emotions/DISGUST/DISGUST_01.JPG", width: 1920, height: 1080 },
    fear: { src: "/emotions/FEAR/FEAR_01.JPG", width: 1920, height: 1080 },
    happy: { src: "/emotions/HAPPY/HAPPY_02.JPG", width: 1920, height: 1080 },
    neutral: { src: "/emotions/NEUTRAL/NEUTRAL_01.JPG", width: 1920, height: 1080 },
    sad: { src: "/emotions/SAD/SAD_02.JPG", width: 1920, height: 1080 },
    surprise: { src: "/emotions/SURPRISE/SURPRISE_01.JPG", width: 1920, height: 1080 },
  };

  useEffect(() => {
    function handleEmotionEvent(evt) {
      const emotion = evt.detail.output.dominantEmotion || "neutral";
      console.log("Dominant emotion detected:", emotion);
      setDominantEmotion(emotion.toLowerCase());
    }

    window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);

    return () => {
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, []);

  return (
    <FullScreenContainer>
      {dominantEmotion && (
        <Image
          src={emotionImages[dominantEmotion].src}
          alt={dominantEmotion}
          priority
          fill={true}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }} // Changed from 'fill' to 'cover'
        />
      )}
       Preload Images
      <HiddenImagesContainer>
        {Object.values(emotionImages).map((img, index) => (
          <Image key={index} src={img.src} alt={`preload-${index}`} priority width={img.width} height={img.height} />
        ))}
      </HiddenImagesContainer>
    </FullScreenContainer>
  );
};

export default GenderComponent;
