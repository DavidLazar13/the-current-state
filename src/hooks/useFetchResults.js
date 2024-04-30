import { useEffect, useState } from 'react';
import postRequest from "@/utils/postRequest";
const useFetchResults  = (prompt) => {
  const [generatedPoem, setGeneratedPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      // if (!prompt) return;

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

    fetchData();
  }, [prompt]);

  return { generatedPoem, loading, error };
}
export default useFetchResults
