import React, { useEffect } from 'react';

// Component to enable full screen mode when 'f' key is pressed
export default function FullscreenOnFKeyPress() {
  // Function to request full screen mode for the entire document
  const requestFullScreen = () => {
    const docElement = document.documentElement;

    if (docElement.requestFullscreen) {
      docElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      console.error("Full screen mode is not available.");
    }
  };

  // Event handler for key press
  const handleKeyPress = (event) => {
    if (event.key === 'f') {
      requestFullScreen();
    }
  };

  // Effect hook to attach and clean up the keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null; // Returning null as the component does not render anything
}
