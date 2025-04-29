import { CompletedWord } from "../types/CompletedWord";

/**
 * Selects up to 5 words to store for analysis
 * Prioritizes incorrect words, then fills with difficult correct words if needed
 */
export const selectWordsToStore = (completedWords: CompletedWord[]): CompletedWord[] => {
  // First, filter out the incorrect words
  const incorrectWords = completedWords.filter(word => !word.isCorrect);

  // Sort incorrect words by highest backspace count (most struggled first)
  const sortedIncorrect = incorrectWords.sort(
    (a, b) => b.backspaceCount - a.backspaceCount
  );

  // If there are at least 5 incorrect words, return the top 5
  if (sortedIncorrect.length >= 5) {
    return sortedIncorrect.slice(0, 5);
  }

  // Otherwise, fill the remaining slots with difficult correct words
  const remaining = 5 - sortedIncorrect.length;

  const remainingWords = completedWords
    .filter(word => word.isCorrect && !sortedIncorrect.includes(word))
    .sort((a, b) => b.backspaceCount - a.backspaceCount) // Prioritize hardest correct words
    .slice(0, remaining);

  // Combine incorrect and selected correct words
  return [...sortedIncorrect, ...remainingWords];
};