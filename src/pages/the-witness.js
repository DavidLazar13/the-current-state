import { useEffect, useRef } from "react";
import { useExternalScript } from "../helpers/externalScriptsLoader";
import { getAiSdkControls } from "../helpers/loader";

import DominantEmotionComponent from "@/components/DominantEmotionComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";

/**
 * Component to render AI SDK functionalities and emotion recognition features.
 * It loads external scripts for Morphcast AI SDK, sets up the camera, and displays detected emotions.
 */
export default function TheWitness() {
  // Load external AI SDK scripts and monitor their loading status.
  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

  // Reference to the video element where the camera feed will be shown.
  const videoEl = useRef(null);

  useEffect(() => {
    // Function to initialize AI SDK and camera once external scripts are loaded.
    async function initializeAiSdk() {
      if (aiSdkState === "ready" && mphToolsState === "ready") {
        // Retrieve AI SDK controls and start the camera.
        const { source, start } = await getAiSdkControls();
        await source.useCamera({
          toVideoElement: videoEl.current, // Use the ref for direct DOM manipulation.
        });
        await start(); // Start the AI SDK functionalities.
      }
    }

    initializeAiSdk(); // Call the initialization function.
  }, [aiSdkState, mphToolsState]); // Re-run effect when script states change.

  return (
    <div>
      <FullscreenOnFKeyPress />
      {/* Hidden video element for capturing video feed but not displaying it. */}
      <div style={{ width: "600px", height: "400px", position: "relative", display: "none" }}>
        <video ref={videoEl} id="videoEl"></video>
      </div>
      {/* Component to display the dominant emotion detected by the AI. */}
      <DominantEmotionComponent />
    </div>
  );
}
