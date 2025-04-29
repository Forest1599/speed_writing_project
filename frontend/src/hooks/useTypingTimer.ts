import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to manage a countdown timer for typing tests
 */
const useTypingTimer = (duration: number) => {
  const [timeLeft, setTimeLeft] = useState(duration);    // Time remaining (seconds)
  const [isRunning, setIsRunning] = useState(false);      // Timer running state
  const timerRef = useRef<number | null>(null);           // Reference to the timer interval

  /**
   * Starts the timer from the full duration
   */
  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeLeft(duration);
    setIsRunning(true);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Resets the timer back to the initial duration and stops it
   */
  const reset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  /**
   * Stops the timer without resetting the time
   */
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  };

  /**
   * Clean up the timer interval when the component using this hook unmounts
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Return timer state and controls
  return { timeLeft, isRunning, start, reset, stop };
};

export default useTypingTimer;