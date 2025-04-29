import React, { useEffect, useRef, useState } from 'react';
import { CompletedWord } from '../../types/CompletedWord';
import Word from './Word';

type Props = {
  words: string[];
  currentWordIndex: number;
  userInput: string;
  completedWords: CompletedWord[];
  onLinesCalculated?: (lineMap: number[]) => void; // Add this prop
};

const TextTypingArea: React.FC<Props> = ({
  words,
  currentWordIndex,
  userInput,
  completedWords,
  onLinesCalculated,
}) => {

  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollLine, setScrollLine] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const lineMapRef = useRef<number[]>([]); // Track which word is on which line

  useEffect(() => {
    // Calculates which word is on which line
    const calculateLines = () => {
      const newLineMap: number[] = [];
      let currentLine = 0;
      let lastTop = 0;
  
      wordRefs.current.forEach((el, index) => {
        if (!el) return;
        
        if (index === 0) {
          // First word always on line 0
          newLineMap.push(0);
          lastTop = el.offsetTop;
        } else {
          // If element has a different top offset, it's a new line
          if (el.offsetTop > lastTop) {
            currentLine++;
            lastTop = el.offsetTop;
          }
          newLineMap.push(currentLine);
        }
      });
  
      // Update line map reference
      lineMapRef.current = newLineMap;
  
      // Call external callback if provided (e.g., to sync typing logic)
      if (onLinesCalculated) onLinesCalculated(newLineMap);
  
      // Save line height for later scrolling
      if (wordRefs.current[0] && lineHeight === 0) {
        setLineHeight(wordRefs.current[0].offsetHeight);
      }
    };
  
    // Initial calculation when words are rendered
    calculateLines();
  
    // Watch for resizes (important for responsive layouts)
    const resizeObserver = new ResizeObserver(() => {
      calculateLines();
    });
  
    if (wordRefs.current[0]) {
      resizeObserver.observe(wordRefs.current[0]);
    }
  
    // Clean up observer when component unmounts or dependencies change
    return () => resizeObserver.disconnect();
  }, [words, lineHeight]);
  
  useEffect(() => {
    const currentWordEl = wordRefs.current[currentWordIndex];
    if (!currentWordEl) return;
  
    const currentLine = lineMapRef.current[currentWordIndex] || 0;
    const previousLine = currentWordIndex > 0 ? lineMapRef.current[currentWordIndex - 1] || 0 : 0;
  
    // Scroll down only when moving to a new line
    if (currentLine > previousLine) {
      setScrollLine(currentLine);
    }
  }, [currentWordIndex]);
  
  return (
    <div className="typing-area overflow-hidden h-[calc(3.1*3rem)]">
      <div
        className="text-3xl flex flex-wrap transition-transform duration-200"
        style={{
          transform: `translateY(-${scrollLine * lineHeight}px)`, // Scroll vertically by line
        }}
      >
        {words.map((word, index) => (
          <div
            ref={el => (wordRefs.current[index] = el)} // Attach each word element to refs
            key={index}
            className="whitespace-nowrap" // Prevent words from breaking mid-line
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