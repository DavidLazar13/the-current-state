import { useEffect, useRef } from "react";
import styled from 'styled-components';

// Styled components definitions
const TrackerContainer = styled.div`
    position: relative;  // Assuming the container needs relative positioning
`;

const FaceTracker = styled.div`
    position: absolute;
    display: none;  // Start hidden, show based on detection
    border: 2px solid red;  // Assuming there's a border for visual tracking
    box-sizing: border-box;
`;

const FaceTrackerComponent = ({ videoEl }) => {
  const timeout = useRef(undefined);
  const faceTracker= useRef(null);
  const sdk_w = useRef(undefined);
  const sdk_h = useRef(undefined);

  useEffect(() => {
    if(videoEl.current){
      bindEvent();
    }

    function bindEvent() {
      window.addEventListener("CY_FACE_DETECTOR_RESULT", handleFaceEvents);
      window.addEventListener("CY_CAMERA_RESULT", setSdkDimensions);
    }

    function handleFaceEvents(evt) {
      if (evt.detail && evt.detail.rects && evt.detail.rects.length > 0) {
        const scale_w = videoEl.current.offsetWidth / sdk_w.current;
        const scale_h = videoEl.current.offsetHeight / sdk_h.current;

        const y_diff = videoEl.current.offsetHeight - (sdk_h.current * scale_h);
        const x_diff = videoEl.current.offsetWidth - (sdk_w.current * scale_w);

        const offset_x = Math.round(x_diff / 2);
        const offset_y = Math.round(y_diff / 2);

        faceTracker.current.style.width = `${Math.round(evt.detail.rects[0].width * scale_w)}px`;
        faceTracker.current.style.height = `${Math.round(evt.detail.rects[0].height * scale_h)}px`;
        faceTracker.current.style.top = `${Math.round(evt.detail.rects[0].y * scale_h) + offset_y}px`;
        faceTracker.current.style.left = `${Math.round(evt.detail.rects[0].x * scale_w) + offset_x}px`;
        faceTracker.current.style.display = "block";

        resetTimeout();
      }
    }

    function setSdkDimensions(evt) {
      sdk_w.current = evt.detail.width;
      sdk_h.current = evt.detail.height;
    }

    function resetTimeout() {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setAllToZero();
      }, 3000);
    }

    function setAllToZero() {
      faceTracker.current.style.display = "none";
    }

  }, [videoEl]);

  return (
    <TrackerContainer>
      <FaceTracker ref={faceTracker} />
    </TrackerContainer>
  );
};

export default FaceTrackerComponent;
