import { useEffect, useState } from 'react';
import postRequest from "@/utils/postRequest";

/**
 * Custom hook to fetch poems periodically based on a given prompt.
 */
const useFetchResults = (prompt) => {
  const [generatedPoem, setGeneratedPoem] = useState(''); // State to store the generated poem
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(''); // State to store any error that might occur during fetching

  useEffect(() => {
    /**
     * Fetches poem data from the server and updates the state.
     */
    async function fetchData() {
      console.log('Fetching data...');
      setLoading(true); // Set loading state to true when fetching begins
      try {
        // Attempt to fetch data using a post request to the specified endpoint
        const response = await postRequest('/api/open-ai', { prompt });
        setGeneratedPoem(response.result.content); // Update poem state with fetched data
      } catch (err) {
        // Handle any errors during fetch
        setError('Failed to fetch results. Please try again.');
        console.error(err); // Log the error for debugging
      } finally {
        // Ensure loading state is turned off after fetch is complete
        setLoading(false);
      }
    }

    // Call fetchData when the component mounts
    fetchData();

    // Set up an interval to fetch the data every 5 minutes (300,000 milliseconds)
    const interval = setInterval(fetchData, 300000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);

  }, [prompt]); // Rerun the effect when prompt changes

  return { generatedPoem, loading, error };
}

export default useFetchResults;
