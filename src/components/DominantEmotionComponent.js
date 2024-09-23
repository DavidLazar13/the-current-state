import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";
import * as faceapi from 'face-api.js';

// Styled component for the fullscreen container
const FullScreenContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;  // Ensure no overflow
`;

// Styled component for the header displaying emotion
const StyledHeader = styled.h1`
    font-size: 80px;
    font-weight: bold;
    z-index: 10;
    color: #33ff18;
    font-family: 'VT323', sans-serif;
`;

// Styled video feed to cover the whole screen
const VideoFeed = styled.video`
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;  // Cover the entire screen, maintaining aspect ratio
    z-index: 1;
`;

// Canvas overlay for face landmarks, matching video size
const CanvasOverlay = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;  // Cover the entire screen, maintaining aspect ratio
    z-index: 2;  // Higher z-index so it's on top of the video
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

const DominantEmotionComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [imageIndex, setImageIndex] = useState(0); // Track current image index
  const [facesDetected, setFacesDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false); // Track if models are loaded
  const videoRef = useRef(null);  // Reference for video element
  const canvasRef = useRef(null); // Reference for canvas element

  const findDominantEmotion = (emotions) =>
    Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

  const loadModels = async () => {
    try {
      // Load the models for face detection, landmarks, and emotions
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      setModelsLoaded(true); // Mark models as loaded once done
    } catch (error) {
      console.error("Error loading face-api models:", error);
    }
  };

  useEffect(() => {
    loadModels();

    // Access webcam stream
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Error accessing webcam:", err));
  }, []);

  useEffect(() => {
    const detectFaceAndEmotion = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && modelsLoaded) {
        const video = videoRef.current;

        // Detect faces with landmarks and expressions
        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceExpressions();

        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear canvas
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw detections (landmarks and expressions)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Draw only face landmarks
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Draw emotions as text

        if (detections.length > 0) {
          setFacesDetected(true);
          const expressions = detections[0].expressions;
          const dominant = findDominantEmotion(expressions);
          if (dominant !== dominantEmotion) {
            setDominantEmotion(dominant);
          }
        } else {
          setFacesDetected(false);
        }
      }
    };

    // Run detection every 100ms
    const intervalId = setInterval(() => {
      detectFaceAndEmotion();
    }, 100);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [dominantEmotion, modelsLoaded]); // Include modelsLoaded as dependency

  // Automatically change the image every 1 second
  useEffect(() => {
    const imageChangeInterval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 1000); // Change image every 1 second

    return () => clearInterval(imageChangeInterval); // Cleanup the interval on unmount
  }, []); // Runs once on mount

  return (
    <FullScreenContainer>
      {/* Random image as the background */}
      <Image
        src={allImages[imageIndex]} // Use the current image based on index
        alt={dominantEmotion || "random"}
        fill
        priority
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      {/* Fullscreen video feed */}
      <VideoFeed ref={videoRef} autoPlay muted />
      {/* Fullscreen canvas for displaying face landmarks and expressions */}
      <CanvasOverlay ref={canvasRef} />
      {/* Preload all images */}
      <HiddenImagesContainer>
        {allImages.map((src, index) => (
          <Image key={index} src={src} priority alt={`preload-${index}`} width={854} height={480} />
        ))}
      </HiddenImagesContainer>
    </FullScreenContainer>
  );
};

export default DominantEmotionComponent;
