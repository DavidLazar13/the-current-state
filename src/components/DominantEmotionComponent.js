import { useEffect, useState, useRef } from "react";
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

// Styled component for background video (replace images)
const BackgroundVideo = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: 0;
`;

// Main component
const DominantEmotionComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [facesDetected, setFacesDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);  // Reference for video element
  const canvasRef = useRef(null); // Reference for canvas element
  const bgVideoRef = useRef(null); // Reference for the background video element

  const findDominantEmotion = (emotions) =>
    Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

  const loadModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading face-api models:", error);
    }
  };

  useEffect(() => {
    loadModels();

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

        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceExpressions();

        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

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

    const intervalId = setInterval(() => {
      detectFaceAndEmotion();
    }, 100);

    return () => clearInterval(intervalId);
  }, [dominantEmotion, modelsLoaded]);

  return (
    <FullScreenContainer>
      {/* Background video */}
      {/*<BackgroundVideo ref={bgVideoRef} autoPlay muted loop>*/}
      {/*  <source src="/path-to-your-video.mp4" type="video/mp4" />*/}
      {/*  Your browser does not support the video tag.*/}
      {/*</BackgroundVideo>*/}

      {/* Fullscreen video feed */}
      <VideoFeed ref={videoRef} autoPlay muted />

      {/* Fullscreen canvas for displaying face landmarks and expressions */}
      <CanvasOverlay ref={canvasRef} />

    </FullScreenContainer>
  );
};

export default DominantEmotionComponent;
