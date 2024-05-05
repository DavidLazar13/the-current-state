import React, { useEffect } from 'react';

export default function FullscreenOnFKeyPress() {
  const requestFullScreen = () => {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'f') {
      console.log('f key pressed');
      requestFullScreen();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <></>
  );
}
