import React from 'react';
import useFetchResults from "@/hooks/useFetchResults";
import PoemComponent from "@/components/PoemComponent";
import FullscreenOnFKeyPress from "@/components/FullscreenToggleComponent";

function TheCreator() {

  const {
    generatedPoem,
    loading,
    error,
  } = useFetchResults();



  return (
    <div>
      <FullscreenOnFKeyPress />
      <PoemComponent generatedPoem={generatedPoem} loading={loading} error={error}/>
    </div>
  );
}

export default TheCreator;
