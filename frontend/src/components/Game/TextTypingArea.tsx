import React, { useEffect, useRef, useState } from 'react';
import { CompletedWord } from '../../types/CompletedWord';
import Word from './Word';

type Props = {
  words: string[];
  currentWordIndex: number;
  userInput: string;
  completedWords: CompletedWord[];
  hiddenInputRef: React.RefObject<HTMLInputElement>;
  onLinesCalculated?: (lineMap: number[]) => void; // Add this prop
};

const TextTypingArea: React.FC<Props> = ({
  words,
  currentWordIndex,
  userInput,
  completedWords,
  hiddenInputRef,
  onLinesCalculated,
}) => {

  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollLine, setScrollLine] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const lineMapRef = useRef<number[]>([]); // Track which word is on which line

  // Focuses on the input
  const focusInput = () => hiddenInputRef.current?.focus();


  useEffect(() => {
    const calculateLines = () => {
      const newLineMap: number[] = [];
      let currentLine = 0;
      let lastTop = 0;

      wordRefs.current.forEach((el, index) => {
        if (!el) return;
        
        if (index === 0) {
          newLineMap.push(0);
          lastTop = el.offsetTop;
        } else {
          if (el.offsetTop > lastTop) {
            currentLine++;
            lastTop = el.offsetTop;
          }
          newLineMap.push(currentLine);
        }
      });

      lineMapRef.current = newLineMap;
      if (onLinesCalculated) onLinesCalculated(newLineMap);

      
      // Recalculate line height if needed
      if (wordRefs.current[0] && lineHeight === 0) {
        setLineHeight(wordRefs.current[0].offsetHeight);
      }
    };
    
    calculateLines();

    // Add resize observer
    const resizeObserver = new ResizeObserver(() => {
      calculateLines();


    });

    if (wordRefs.current[0]) {
      resizeObserver.observe(wordRefs.current[0]);
    }

    return () => resizeObserver.disconnect();
  }, [words, lineHeight]);

  useEffect(() => {
    const currentWordEl = wordRefs.current[currentWordIndex];
    if (!currentWordEl) return;

    const currentLine = lineMapRef.current[currentWordIndex] || 0;
    const previousLine = currentWordIndex > 0 ? lineMapRef.current[currentWordIndex - 1] || 0 : 0;

    // Scroll if we're on a new line
    if (currentLine > previousLine) {
      setScrollLine(currentLine);
    }
  }, [currentWordIndex]);
  
  return (
    <div className="typing-area overflow-hidden h-[calc(3.1*3rem)]" onClick={focusInput}>
      <div
        className="text-3xl flex flex-wrap transition-transform duration-200"
        style={{
          transform: `translateY(-${scrollLine * lineHeight}px)`,
        }}
      >
        {words.map((word, index) => (
          <div
            ref={el => (wordRefs.current[index] = el)}
            key={index}
            className="whitespace-nowrap" // Prevent words from breaking
          >
            <Word
              word={word}
              wordIndex={index}
              currentWordIndex={currentWordIndex}
              userInput={userInput}
              completedWords={completedWords.map(completed => completed.typedWord)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextTypingArea;