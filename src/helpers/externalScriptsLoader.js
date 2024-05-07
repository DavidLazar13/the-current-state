import { useEffect, useState } from "react";

// Custom hook for loading external scripts dynamically
// Source: https://github.com/MorphCast/mph-sdk-integration-react/tree/master/src/helpers/ai-sdk
export const useExternalScript = (url) => {
  // State to track the script loading status
  const [state, setState] = useState(url ? "loading" : "idle");

  useEffect(() => {
    // Early exit if no URL is provided
    if (!url) {
      setState("idle");
      return;
    }

    // Check if script is already included in the document
    let script = document.querySelector(`script[src="${url}"]`);

    // Function to handle script load or error events
    const handleScriptEvent = (event) => {
      setState(event.type === "load" ? "ready" : "error");
    };

    // Only append script if it doesn't already exist
    if (!script) {
      script = document.createElement("script");
      script.type = "application/javascript";
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener("load", handleScriptEvent);
      script.addEventListener("error", handleScriptEvent);
    } else {
      // If the script exists, attach the event listeners
      // This is useful if the same script might be managed by different components
      script.addEventListener("load", handleScriptEvent);
      script.addEventListener("error", handleScriptEvent);
    }

    // Cleanup function to remove event listeners when the component unmounts or url changes
    return () => {
      if (script) {
        script.removeEventListener("load", handleScriptEvent);
        script.removeEventListener("error", handleScriptEvent);
      }
    };
  }, [url]); // Effect depends on the URL

  return state;
};
