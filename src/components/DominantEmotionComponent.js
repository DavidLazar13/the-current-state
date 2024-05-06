import { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

// Styled Components
const FullScreenContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const H1 = styled.h1`
    font-size: 30px;
    font-weight: bold;
    color: #ff5733;
    z-index: 10;
`;

const Button = styled.button`
    z-index: 10;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #ff5733;
    border: none;
    cursor: pointer;
`;

const HiddenImagesContainer = styled.div`
  display: none;
`;

const generateImagePaths = () => {
  const paths = [];
  for (let i = 1; i <= 84; i++) {
    const numString = String(i).padStart(2, "0");
    paths.push(`/images/IMAGE_${numString}.jpg`);
  }
  return paths;
};

const allImages = generateImagePaths();

const EmotionImageChanger = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [imageSrc, setImageSrc] = useState(allImages[0]);
  const [facesDetected, setFacesDetected] = useState(false);

  // Function to select a random image that is different from the current one
  const getRandomImage = (lastImage) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * allImages.length);
    } while (allImages[randomIndex] === lastImage);
    return allImages[randomIndex];
  };

  // Function to request camera access
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera access granted', stream);
      // Process the stream or attach to a video element if needed
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        alert('Permission to access the camera has been denied.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera devices found.');
      } else {
        alert(`Camera error: ${error.message}`);
      }
      console.error('Error accessing the camera:', error);
    }
  };

  // Event handling logic
  useEffect(() => {
    const findDominantEmotion = (emotions) => {
      return Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
      );
    };

    const handleEmotionEvent = (evt) => {
      const { affects98 } = evt.detail.output;
      const dominant = findDominantEmotion(affects98);
      if (dominant !== dominantEmotion) {
        setDominantEmotion(dominant);
        setImageSrc(getRandomImage(imageSrc));
      }
    };

    const handleFacesEvent = (evt) => {
      if (evt.detail?.faces?.length) {
        setFacesDetected(true);
      } else {
        setFacesDetected(false);
      }
    };

    window.addEventListener(
      "CY_FACE_AROUSAL_VALENCE_RESULT",
      handleEmotionEvent
    );
    window.addEventListener("CY_FACE_DETECTOR_RESULT", handleFacesEvent);

    return () => {
      window.removeEventListener(
        "CY_FACE_AROUSAL_VALENCE_RESULT",
        handleEmotionEvent
      );
      window.removeEventListener("CY_FACE_DETECTOR_RESULT", handleFacesEvent);
    };
  }, [dominantEmotion, imageSrc]);

  return (
    <FullScreenContainer>
      <H1>{facesDetected ? dominantEmotion : ""}</H1>
      <Button onClick={requestCameraAccess}>Start Camera</Button>
      <Image
        src={imageSrc}
        alt={dominantEmotion || "random"}
        fill
        style={{ objectFit: "cover" }}
      />
      <HiddenImagesContainer>
        {allImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`preload-${index}`}
            width={854}
            height={480}
          />
        ))}
      </HiddenImagesContainer>
    </FullScreenContainer>
  );
};

export default EmotionImageChanger;
