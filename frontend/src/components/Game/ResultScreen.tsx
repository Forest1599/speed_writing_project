import React from 'react';
import { useState, useEffect, useRef } from 'react';
import saveTypingSession from '../api/SaveTypingSession';
import { CompletedWord } from '../../types/CompletedWord';
import { selectWordsToStore } from '../../utils/wordAnalysis';
import { calculateTypingResults, TypingResults } from '../../utils/typingCalculations';
import { ACCESS_TOKEN } from '../../constants/constants'; // import the access token key

// Define the TypingSettings type to describe session settings
type TypingSettings = {
    min_word_length: number,
    max_word_length: number,
    word_frequency_rank: number,
    mode: string,
}

// Define the expected props for the ResultScreen component
type ResultScreenProps = {
    completedWords: CompletedWord[], // list of words typed during the session
    settings: TypingSettings // settings used for the typing session
}

const ResultScreen: React.FC<ResultScreenProps> = ({
    completedWords,
    settings
}) => {
    // State to store calculated results like WPM, accuracy, etc.
    const [results, setResults] = useState<TypingResults>({
      correctWords: 0,
      incorrectWords: 0,
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      totalTypedChars: 0,
      totalBackspaces: 0
    });

    // State to track if the session has already been saved to backend
    const [hasSaved, setHasSaved] = useState<boolean>(false);

    // Calculate typing results when completedWords change
    useEffect(() => {
       const calculatedResults = calculateTypingResults(completedWords);
       setResults(calculatedResults);
    }, [completedWords])

    // Ref to prevent multiple POST requests
    const hasPosted = useRef(false);

    // Effect to save the session results once calculated
    useEffect(() => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (results.wpm > 0 && token && !hasSaved && !hasPosted.current) {
        hasPosted.current = true; // prevent multiple API calls
        const wordsToStore = selectWordsToStore(completedWords); // select important word data

        saveTypingSession(
          results.wpm,
          results.accuracy,
          settings.min_word_length,
          settings.max_word_length,
          settings.word_frequency_rank,
          settings.mode,
          wordsToStore
        )
        // After successful save, mark session as saved
        .then(() => setHasSaved(true));
      }
    }, [results]);

    // Component render
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Typing Test Results</h2>

        {/* Main results summary */}
        <div className="space-y-4 text-lg">
          <div className="flex justify-between">
            <span>Time:</span>
            <span>60 seconds</span>
          </div>

          <div className="flex justify-between">
            <span>Words Per Minute (WPM):</span>
            <span className="font-semibold text-green-400">{results.correctWords}</span>
          </div>

          <div className="flex justify-between">
            <span>Accuracy:</span>
            <span className="font-semibold text-blue-400">{results?.accuracy || 0}%</span>
          </div>

          <div className="flex justify-between">
            <span>Correct Words:</span>
            <span>{results.correctWords} / {completedWords.length}</span>
          </div>

          <div className="flex justify-between">
            <span>Backspaces Used:</span>
            <span className="text-red-500">{results.totalBackspaces}</span>
          </div>

          {/* Display mistyped words */}
          <div className="mt-8">
          <h3 className="text-center font-semibold text-lg mb-4">❌ Mistyped Words</h3>

          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-sm sm:text-base">
            <div className="text-center font-semibold text-red-400">You Typed</div>
            <div className="text-center font-semibold text-green-400">Correct Word</div>

            {/* List mistyped words */}
            {completedWords
              .filter(word => !word.isCorrect)
              .map((word, index) => (
                <React.Fragment key={`mistake-${index}`}>
                  <div className="text-center px-3 py-1 bg-red-500/20 text-red-300 rounded-full">
                    {word.typedWord || <em>(empty)</em>}
                  </div>
                  <div className="text-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
                    {word.targetWord}
                  </div>
                </React.Fragment>
              ))}
          </div>

        </div>
          
        </div>
      </div>
    );
}

export default ResultScreen;