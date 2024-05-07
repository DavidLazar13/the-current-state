import { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

// Styled component for the fullscreen container
const FullScreenContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Styled component for the header displaying emotion
const StyledHeader = styled.h1`
    font-size: 80px;
    font-weight: bold;
    z-index: 10;
    color: #33ff18;
    font-family: 'VT323', sans-serif;
`;

// Hidden container to preload images
const HiddenImagesContainer = styled.div`
    display: none;
`;

// Function to generate image paths
const generateImagePaths = () => Array.from({ length: 84 }, (_, i) =>
  `/images/IMAGE_${String(i + 1).padStart(2, "0")}.jpg`
);

const allImages = generateImagePaths();

// Main component for changing images based on detected emotions
const DominantEmotionComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [imageSrc, setImageSrc] = useState(allImages[0]);
  const [facesDetected, setFacesDetected] = useState(false);

  // Function to get a random image that differs from the current one
  const getRandomImage = (lastImage) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * allImages.length);
    } while (allImages[randomIndex] === lastImage);
    return allImages[randomIndex];
  };

  // Function to find the dominant emotion from the event data
  const findDominantEmotion = (emotions) =>
    Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

  useEffect(() => {
    const handleEmotionEvent = ({ detail: { output } }) => {
      const dominant = findDominantEmotion(output.affects98);
      if (dominant !== dominantEmotion) {
        setDominantEmotion(dominant);
        setImageSrc(getRandomImage(imageSrc));
      }
    };

    const handleFacesEvent = ({ detail }) => {
      setFacesDetected(detail?.faces?.length > 0);
    };

    // Register event listeners
    window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", handleEmotionEvent);
    window.addEventListener("CY_FACE_DETECTOR_RESULT", handleFacesEvent);

    // Clean-up function to remove event listeners
    return () => {
      window.removeEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", handleEmotionEvent);
      window.removeEventListener("CY_FACE_DETECTOR_RESULT", handleFacesEvent);
    };
  }, [dominantEmotion, imageSrc]);

  return (
    <FullScreenContainer>
      <StyledHeader>{facesDetected ? dominantEmotion : ''}</StyledHeader>
      <Image
        src={imageSrc}
        alt={dominantEmotion || "random"}
        fill
        priority
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <HiddenImagesContainer>
        {allImages.map((src, index) => (
          <Image key={index} src={src} priority alt={`preload-${index}`} width={854} height={480} />
        ))}
      </HiddenImagesContainer>
    </FullScreenContainer>
  );
};

export default DominantEmotionComponent;
