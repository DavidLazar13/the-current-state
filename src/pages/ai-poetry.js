import React, { useEffect, useState } from 'react';
import useFetchResults from "@/hooks/useFetchResults";

function AIPoetry() {


  const {
    generatedPoem,
    loading,
    error,
  } = useFetchResults();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {generatedPoem}
    </div>
  );
}

export default AIPoetry;
