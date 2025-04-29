import useWordProvider from './useWordProvider';
import useTypingSession from './useTypingSession';
import useTypingTimer from './useTypingTimer';
import { GameState } from '../types/GameState';
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage the typing test logic (words, timer, session state)
 */
const useTypingTest = (options: {
  gameDuration: number;
  mode: "random" | "adaptive";
}) => {

  // State to track the current game state (Idle, Running, Ended)
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);

  // Load words and settings based on the selected mode
  const { words, settings, fetchNewWords } = useWordProvider(options.mode);

  // Manage typing session (user input tracking, backspaces, etc.)
  const typingSession = useTypingSession(words);

  // Manage the countdown timer
  const timer = useTypingTimer(options.gameDuration);

  /**
   * Starts the typing test
   */
  const startGame = useCallback(() => {
    setGameState(GameState.Running);
    timer.start();
  }, [timer]);

  /**
   * Ends the typing test
   */
  const endGame = useCallback(() => {
    setGameState(GameState.Ended);
    timer.stop();
  }, [timer]);

  /**
   * Resets the typing test (words, timer, session)
   */
  const resetGame = useCallback(() => {
    setGameState(GameState.Idle);

    typingSession.handleReset();
    timer.reset();
    fetchNewWords();
  }, [typingSession, timer, fetchNewWords]);

  /**
   * Handles key presses during the typing session
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState === GameState.Idle && e.key.length === 1) {
      // Start the game on the first valid character key press
      startGame();
      typingSession.handleKeyPress(e);
    }

    if (gameState === GameState.Running) {
      // Delegate keypress handling to typing session logic
      typingSession.handleKeyPress(e);
    }
  }, [gameState, startGame, typingSession]);

  /**
   * Watches for when the timer hits zero to automatically end the game
   */
  useEffect(() => {
    if (timer.timeLeft === 0 && gameState === GameState.Running) {
      endGame();
    }
  }, [timer.timeLeft, gameState, endGame]);

  // Return typing session data, timer data, words, settings, and controls
  return {
    ...typingSession,
    ...timer,
    words,
    settings,
    fetchNewWords,
    gameState,

    // Controls
    handleKeyPress,
    resetGame,
  };
};

export default useTypingTest;