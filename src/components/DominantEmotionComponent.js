import { useEffect, useState } from "react";
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

const H1 = styled.h1`
    font-size: 30px;
    font-weight: bold;
    color: #FF5733;
    z-index: 10;
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
      }
      if (!evt.detail?.faces?.length) {
        setFacesDetected(false);
      }
    }

    window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", handleEmotionEvent);
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
      <H1>{facesDetected ? dominantEmotion : ''}</H1>
      <Image
        src={imageSrc}
        alt={dominantEmotion || "random"}
        priority
        fill
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <HiddenImagesContainer>
        {allImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`preload-${index}`}
            priority
            width={854}
            height={480}
          />
        ))}
      </HiddenImagesContainer>
    </FullScreenContainer>
  );
};

export default EmotionImageChanger;
