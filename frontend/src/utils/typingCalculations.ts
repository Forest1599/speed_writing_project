import { CompletedWord } from "../types/CompletedWord";

/**
 * Interface describing the structure of typing session results
 */
export interface TypingResults {
  correctWords: number;
  incorrectWords: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalTypedChars: number;
  totalBackspaces: number;
}

/**
 * Calculates typing session results based on completed words
 */
export const calculateTypingResults = (completedWords: CompletedWord[]): TypingResults => {
  const totalWords = completedWords.length;

  // Count the number of correctly typed words
  const correctCount = completedWords.filter(word => word.isCorrect).length;

  // Remaining words are considered incorrect
  const incorrectCount = totalWords - correctCount;

  // Calculate correct character matches across all words
  const correctChars = completedWords.reduce((acc, word) => {
    return acc + [...word.typedWord].filter((char, i) => char === word.targetWord[i]).length;
  }, 0);

  // Total characters typed by the user
  const totalTypedChars = completedWords.reduce((acc, word) => acc + word.typedWord.length, 0);

  // Total backspaces used across all words
  const totalBackspaces = completedWords.reduce((acc, word) => acc + word.backspaceCount, 0);

  // Calculate typing accuracy
  const accuracy = correctChars / (totalTypedChars + totalBackspaces);

  return {
    correctWords: correctCount,
    incorrectWords: incorrectCount,
    wpm: correctCount, // WPM is approximated by the number of correct words
    accuracy: Math.round(accuracy * 100), // Accuracy percentage
    correctChars,
    totalTypedChars,
    totalBackspaces,
  };
};
