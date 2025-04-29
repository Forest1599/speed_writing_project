import { useState, KeyboardEvent } from 'react';
import { CompletedWord } from '../types/CompletedWord';

/**
 * Custom hook to manage a typing session state
 */
const useTypingSession = (words: string[]) => {
  
  // Typing state
  const [userInput, setUserInput] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);

  // Mapping of words to their line number for multi-line support
  const [lineMap, setLineMap] = useState<number[]>([]);

  /**
   * Updates the map of lines
   */
  const updateLineMap = (newLineMap: number[]) => {
    setLineMap(newLineMap);
  };

  /**
   * Handles all key press events
   */
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const currentWord = words[currentWordIndex];

    // Ignore modifier keys except Backspace and Space
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

    switch (e.key) {
      case "Backspace":
        handleBackspace();
        break;
      case " ":
        handleSpace(currentWord);
        e.preventDefault(); // Prevent space from typing inside the input
        break;
      default:
        handleCharacterInput(e.key, currentWord);
    }
  };

  /**
   * Handles when backspace is pressed
   */
  const handleBackspace = () => {
    if (charIndex === 0 && currentWordIndex > 0) {
      const currentLine = lineMap[currentWordIndex] || 0;
      const prevLine = lineMap[currentWordIndex - 1] || 0;

      // Prevent going back to previous lines
      if (prevLine < currentLine) return;

      // Go back to previous word
      const previousWord = completedWords[completedWords.length - 1];

      setCompletedWords((prev) => prev.slice(0, -1));
      setCurrentWordIndex((prev) => prev - 1);
      setUserInput(previousWord.typedWord);
      setCharIndex(previousWord.typedWord.length);
      setBackspaceCount(previousWord.backspaceCount + 1);

    } else if (charIndex > 0) {
      // Remove last character
      setBackspaceCount((prev) => prev + 1);
      setUserInput((prev) => prev.slice(0, -1));
      setCharIndex((prev) => prev - 1);
    }
  };

  /**
   * Handles when space is pressed
   * Finalizes the current word
   */
  const handleSpace = (currentWord: string) => {
    if (charIndex < 1) return; // Do not allow submitting empty words

    setCompletedWords((prev) => [
      ...prev,
      {
        targetWord: currentWord,
        typedWord: userInput,
        isCorrect: userInput.trim() === currentWord,
        backspaceCount: backspaceCount,
      },
    ]);

    // Reset state for next word
    setUserInput("");
    setCharIndex(0);
    setBackspaceCount(0);
    setCurrentWordIndex((prev) => prev + 1);
  };

  /**
   * Handles character input typing
   */
  const handleCharacterInput = (key: string, currentWord: string) => {
    if (charIndex < currentWord.length) {
      setUserInput((prev) => prev + key);
      setCharIndex((prev) => prev + 1);
    }
  };

  /**
   * Resets the typing session
   */
  const handleReset = () => {
    setUserInput('');
    setCompletedWords([]);
    setCharIndex(0);
    setCurrentWordIndex(0);
    setBackspaceCount(0);
  };

  // Return the state and handlers
  return {
    userInput,
    completedWords,
    currentWordIndex,
    handleKeyPress,
    handleReset,
    updateLineMap,
  };
};

export default useTypingSession;