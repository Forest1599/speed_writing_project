import { useState, useEffect } from 'react';
import { fetchWords } from '../components/api/WordService';

/**
 * Custom hook to fetch and manage words for the typing test
 * Supports both 'random' and 'adaptive' modes
 */
const useWordProvider = (mode: 'random' | 'adaptive' = 'random') => {
  // Typing words array
  const [words, setWords] = useState<string[]>([]);

  // Typing settings (difficulty, etc.)
  const [settings, setSettings] = useState<any>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches new words from the server based on the selected mode
   */
  const fetchNewWords = async () => {
    setIsLoading(true);

    try {
      const data = await fetchWords(mode);
      setWords(data.words);
      setSettings(data.settings);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch words immediately on component mount
   */
  useEffect(() => {
    fetchNewWords();
    // Only run once (on mount)
  }, []);

  // Return the state and the fetch function
  return {
    words,
    settings,
    isLoading,
    error,
    fetchNewWords,
  };
};

export default useWordProvider;