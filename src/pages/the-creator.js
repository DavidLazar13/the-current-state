import React from 'react';
import useFetchResults from "@/hooks/useFetchResults"; // Custom hook to fetch poem data
import PoemComponent from "@/components/PoemComponent"; // Component to display the poem
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent"; // Component to toggle fullscreen mode

/**
 * TheCreator page - Displays a generated poem and toggles fullscreen mode.
 * It utilizes a custom hook to fetch the poem data and displays it using the PoemComponent.
 * Fullscreen mode can be toggled using the F key.
 */
function TheCreator() {
  // Destructuring the returned values from the useFetchResults hook.
  const {
    generatedPoem,
    loading,
    error,
  } = useFetchResults(); // Hook call without any parameters, assuming defaults are handled within the hook.

  return (
    <div>
      <FullscreenOnFKeyPress /> {/* Component to enable fullscreen mode on F key press */}
      {/* PoemComponent receives fetched poem data along with loading and error states */}
      <PoemComponent generatedPoem={generatedPoem} loading={loading} error={error} />
    </div>
  );
}

export default TheCreator;
