import { useEffect, useState } from 'react';
import postRequest from "@/utils/postRequest";

const useFetchResults = (prompt) => {
  const [generatedPoem, setGeneratedPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch the poem data
    async function fetchData() {
      console.log('Fetching data...');
      setLoading(true);
      try {
        const poem = await postRequest('/api/open-ai', { prompt });
        setGeneratedPoem(poem.result.content);
      } catch (err) {
        setError('Failed to fetch results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Immediately fetch data when the component mounts
    fetchData();

    // Set up an interval to fetch the data every 3 minutes (180000 milliseconds)
    const interval = setInterval(fetchData, 180000); // 60,000 milliseconds = 1 minute

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);

  }, [prompt]);

  return { generatedPoem, loading, error };
}

export default useFetchResults;
