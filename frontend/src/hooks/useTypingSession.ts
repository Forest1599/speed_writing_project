import { useState, KeyboardEvent } from 'react';
import { CompletedWord } from '../types/CompletedWord';

const useTypingSession = (words: string[]) => {
  
  // The current user input
  const [userInput, setUserInput] = useState("");

  // The current word the user is working on
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);

  // The current character the user is working on
  const [charIndex, setCharIndex] = useState<number>(0)

  // All of the user inputted words
  const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);

  // Backspace count per word
  const [backspaceCount, setBackspaceCount] = useState<number>(0);

  const [lineMap, setLineMap] = useState<number[]>([]); // Track which word is on which line

  const updateLineMap = (newLineMap: number[]) => {
    setLineMap(newLineMap);
  };

  // Handle keyboard input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {

    const currentWord: string = words[currentWordIndex];

    // Ignore modifier keys except Backspace and Space
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

    switch(e.key) {
      case "Backspace":
        handleBackspace();
        break;
      case " ":
        handleSpace(currentWord);
        e.preventDefault();
        break;
      default:
        handleCharacterInput(e.key, currentWord);
    }
  }

  // Handles when backspace is clicked
  const handleBackspace = () => {
    if (charIndex === 0 && currentWordIndex > 0) {

      const currentLine = lineMap[currentWordIndex] || 0;
      const prevLine = lineMap[currentWordIndex - 1] || 0;
      
      if (prevLine < currentLine) {
        // Don't allow going back to previous lines
        return;
      }


      // Move to the previous word the user inputted
      const previousWord = completedWords[completedWords.length - 1];
      
      setCompletedWords((prev) => prev.slice(0, -1));
      setCurrentWordIndex((prev) => prev - 1);
      setUserInput(previousWord.typedWord);
      setCharIndex(previousWord.typedWord.length);
      setBackspaceCount(previousWord.backspaceCount + 1);

    } else if (charIndex > 0) { // If not the first character

      setBackspaceCount((prev) => prev + 1); // adds a backspace
      setUserInput(userInput.slice(0, -1)); // removes the last char from user Input
      setCharIndex(charIndex - 1);
    }
  }


  // Handles when space is clicked
  const handleSpace = (currentWord: string) => {

    if (charIndex < 1) return; // Do not allow space as first character

    // Adds a new word to the completedWords
    setCompletedWords((prev) => [
      ...prev,
      {
        targetWord: currentWord,
        typedWord: userInput,
        isCorrect: userInput.trim() === currentWord,
        backspaceCount: backspaceCount
      }
    ])

    // Clear the indexes
    setUserInput("");
    setCharIndex(0);
    setBackspaceCount(0);
    setCurrentWordIndex(prev => prev + 1);
  }


  const handleCharacterInput = (key: string, currentWord: string) => {
    if (charIndex < currentWord.length) {

      // increment the inputs for the word
      setUserInput(userInput + key);
      setCharIndex(charIndex + 1);
    }
  }

  const handleReset = () => {
    setUserInput('');
    setCompletedWords([]);
    setCharIndex(0);
    setCurrentWordIndex(0);
    setBackspaceCount(0);
  }

  return {
    userInput,
    completedWords,
    currentWordIndex,
    handleKeyPress,
    handleReset,
    updateLineMap
  };
}

export default useTypingSession;
