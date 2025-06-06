import { CompletedWord } from "../../types/CompletedWord";
import api from "./api";

// Saves typing session information
const SaveTypingSession = async (
  wpm: number,
  accuracy: number,
  minWordLength: number,
  maxWordLength: number,
  frequencyRank: number,
  mode: string,
  wordsToStore: CompletedWord[],
) => {
  try {

    // Used so it is interpreted by Django
    const payloadWords = wordsToStore.map(word => ({
      target_word: word.targetWord,
      typed_word: word.typedWord,
      is_correct: word.isCorrect,
      backspace_count: word.backspaceCount,
    }));

    await api.post("/api/typing-sessions/", {
      wpm,
      accuracy,
      min_word_length: minWordLength,
      max_word_length: maxWordLength,
      frequency_rank: frequencyRank,
      word_performances: payloadWords,
      mode: mode
    });

  } catch (error) {
    alert('There was an error saving your typing session. Please try again.');
  }
};

export default SaveTypingSession;