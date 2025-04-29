import { useRef, useState } from 'react';
import useTypingTest from '../../hooks/useTypingTest';
import HiddenInput from './HiddenInput';
import Timer from './Timer';
import ResultScreen from './ResultScreen';
import TextTypingArea from './TextTypingArea';
import ResetButton from './ResetButton';
import { GameState } from '../../types/GameState';

type TypingTestProps = {
  mode: 'random' | 'adaptive';
};

const TypingTest: React.FC<TypingTestProps> = ({ mode }) => {
  // Typing test options
  const gameOptions = {
    gameDuration: 60,
    mode: mode,
  };

  // Typing test hook providing full game state for the UI
  const {
    userInput,
    completedWords,
    handleKeyPress,
    timeLeft,
    settings,
    gameState,
    resetGame,
    currentWordIndex,
    words,
    updateLineMap,
  } = useTypingTest(gameOptions);

  // Track if the hidden input is focused
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  /**
   * If game ended, show result screen
   */
  if (gameState === GameState.Ended) {
    return (
      <>
        <div className="mt-10">
          <ResetButton resetGame={resetGame} />
        </div>
        <ResultScreen completedWords={completedWords} settings={settings} />
      </>
    );
  }

  /**
   * Render typing test
   */
  return (
    <section className="">
      <HiddenInput 
        ref={inputRef} 
        onKeyDown={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <div className="mt-44">
        <h2 className="text-center text-4xl font-semibold text-gray-700 mb-8">
          {mode === 'random' ? 'Randomized Word Test' : 'Adapted Word Test'}
        </h2>

        <Timer duration={gameOptions.gameDuration} timeLeft={timeLeft} />

        <div className="relative p-6">
          {/* Blurred overlay when input is not focused */}
          {!isFocused && (
            <div
              className="absolute inset-0 z-10 bg-neutral-800 bg-opacity-50 backdrop-blur-sm flex items-center justify-center rounded-lg cursor-pointer"
              onClick={() => inputRef.current?.focus()} // Focus input when clicked
            >
              <span className="text-xl text-white">Click to start typing</span>
            </div>
          )}

          {/* Main text typing area */}
          <TextTypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            userInput={userInput}
            completedWords={completedWords}
            onLinesCalculated={updateLineMap}
          />
        </div>
      </div>

      <div className="mt-5">
        <ResetButton resetGame={resetGame} />
      </div>
    </section>
  );
};

export default TypingTest;